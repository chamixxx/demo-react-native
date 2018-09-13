/**
 * Copyright by Cara by HiDoc Technologies GmbH
 * https://cara-app.com
 * @flow
 */

import * as React from "react";
import { Platform, Text, AsyncStorage, AppState, NetInfo } from "react-native";
import { Sentry } from "react-native-sentry";
import { addLocaleData, IntlProvider } from "react-intl";
import DeviceInfo from "react-native-device-info";
import en from "react-intl/locale-data/en";
import de from "react-intl/locale-data/de";
import Intercom from "react-native-intercom";
require("intl");
import { Provider, connect, Dispatch } from "react-redux";
import store from "./Utils/Store";
import {
  createAccountInfoIfNeeded,
  getTrackingDataToSync,
  getAccountInfo,
  getMealItemImageUrisToSync,
  updateLocalObjectItemDB,
  getFavouriteRecipeIds
} from "./RealmDB/RealmUtils";
import { requestUserActionCreator } from "./Auth/AuthActions";
import { postTrackingDataActionCreator } from "./Tracking/TrackingActions";
import { AppNavigator } from "./Navigator/Navigator";
import realm from "./RealmDB/RealmInit";
import AccountInfo, {
  mapAccountInfoToRealmAccountInfo
} from "./Models/AccountInfo";
import TrackingData from "./Models/TrackingData";
import {
  createMealItemImageDirectoryIfDoesntExist,
  sendMealItemImageToBackend
} from "./Tracking/Utils/MealItemImageManager";
import Mixpanel from "react-native-mixpanel";
import {
  appSessionDuration,
  mixpanelToken,
  firstTimeAppLaunchedString,
  appFirstLaunched,
  dbLocalVersionKey,
  dbCacheVersion
} from "./Utils/Constants";
import moment from "moment";
import RNFS from "react-native-fs";

//@ts-ignore
import { unzip } from "react-native-zip-archive";
import RNFetchBlob from "react-native-fetch-blob";

require("moment/locale/de.js");
const messages: any = {
  en: require("../locale/en.json"),
  de: require("../locale/de.json")
};

if (!__DEV__) {
  Sentry.config(
    "https://6cbfd20bcec1492eaf8038481905181d:8a82ed0b4a704d08a68528320a387f15@sentry.io/1190846"
  ).install();
}

interface OwnProps {}
interface StateProps {
  isFetchingAuthMetaData: boolean;
}
interface DispatchProps {
  requestUser: () => void;
  postTrackingData: (trackingData: TrackingData[]) => void;
}
type Props = OwnProps & StateProps & DispatchProps;

interface LState {
  didUpdateIntercom: boolean;
  isMixpanelReady: boolean;
}

class App extends React.Component<Props, LState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      didUpdateIntercom: false,
      isMixpanelReady: false
    };
  }

  componentWillMount() {}

  componentDidMount() {
    Intercom.handlePushMessage();
    createAccountInfoIfNeeded();
    createMealItemImageDirectoryIfDoesntExist();
    this.props.requestUser();
    this.syncDataWithBackend();
    if (Platform.OS === "ios") {
      Intercom.registerUnidentifiedUser(); // this needs to be done in MainApplication on Android
    }
    this.setupMixpanel();
    // this.debugGetAllFoodItem();
    if (Platform.OS === "ios") {
      Intercom.registerForPush(); // this call doesn't seem to work or be needed on Android
    }
    AppState.addEventListener("change", this.handleAppStateChange);
    NetInfo.isConnected.addEventListener(
      "connectionChange",
      this.handleConnectionChange
    );
    this.unzipAndUpdateLocaleDBIfNeeded();
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this.handleAppStateChange);
    NetInfo.isConnected.removeEventListener(
      "connectionChange",
      this.handleConnectionChange
    );
  }

  componentWillReceiveProps(newProps: Props) {
    this.setupIntercom(newProps.isFetchingAuthMetaData);
  }

  handleConnectionChange = (isConnected: boolean) => {
    if (isConnected) {
      this.setCurrentCity();
    }
  };

  setupIntercom = (isFetchingAuthMetaData: boolean) => {
    if (
      isFetchingAuthMetaData === false &&
      this.state.didUpdateIntercom === false
    ) {
      const accountInfo = realm.objects<AccountInfo>("AccountInfo")[0];
      if (accountInfo.emailConfirmed === true) {
        if (Platform.OS === "ios") {
          Intercom.setUserHash(accountInfo.intercomTokenIosEmail!);
        } else {
          Intercom.setUserHash(accountInfo.intercomTokenAndroidEmail!);
        }

        Intercom.registerIdentifiedUser({
          email: accountInfo.email!
        } as any);

        Intercom.updateUser({
          user_id: accountInfo.username
        });
        this.setState({ didUpdateIntercom: true });
      }
    }
  };

  setupMixpanel = () => {
    const ai = getAccountInfo();
    (Mixpanel.sharedInstanceWithToken(mixpanelToken) as any).then(() => {
      Mixpanel.getDistinctId((id: string) => {
        Mixpanel.identify(id);
        if (ai.username !== undefined) {
          Mixpanel.set({
            $backend_username: ai.username,
            $name: ai.username,
            $platform: ai.platform
          });
          if (__DEV__) {
            Mixpanel.set({
              "Real User": "no"
            });
          } else {
            Mixpanel.set({
              "Real User": "yes"
            });
          }
        }
        this.setState({ isMixpanelReady: true });
        Mixpanel.timeEvent(appSessionDuration);
        this.sendAppFirstLaunchedEventIfNeeded();
      });
    });
  };

  setCurrentCity = () => {
    fetch("http://ip-api.com/json/?fields=city,countryCode", {
      method: "GET"
    })
      .then(res => res.json())
      .then(res => {
        const accountInfo = getAccountInfo();
        accountInfo.city = res.city;
        accountInfo.countryCode = res.countryCode;
        realm.write(() => {
          realm.create(
            "AccountInfo",
            mapAccountInfoToRealmAccountInfo(accountInfo),
            true
          );
        });
      });
  };

  sendAppFirstLaunchedEventIfNeeded = () => {
    AsyncStorage.getItem(firstTimeAppLaunchedString).then(value => {
      if (value === null) {
        AsyncStorage.setItem(firstTimeAppLaunchedString, "true").then(res => {
          Mixpanel.track(appFirstLaunched);
        });
      }
    });
  };

  syncDataWithBackend() {
    const trackingDataToSync = getTrackingDataToSync();
    if (trackingDataToSync.length > 0) {
      this.props.postTrackingData(trackingDataToSync);
    }
    const mealItemImageUrisToSync = getMealItemImageUrisToSync();
    if (mealItemImageUrisToSync.length > 0) {
      mealItemImageUrisToSync.forEach(uri => {
        sendMealItemImageToBackend(uri);
      });
    }
  }

  handleAppStateChange = (nextState: any) => {
    if (this.state.isMixpanelReady) {
      if (nextState === "active") {
        Mixpanel.timeEvent(appSessionDuration);
      } else {
        Mixpanel.track(appSessionDuration);
      }
    }
  };

  unzipAndUpdateLocaleDBIfNeeded = async () => {
    try {
      const dbLocalVersion = await AsyncStorage.getItem(dbLocalVersionKey);
      if (dbLocalVersion === null) {
        this.unzipAndUpdateLocaleDB();
      } else if (+dbLocalVersion < dbCacheVersion) {
        this.unzipAndUpdateLocaleDB();
      }
    } catch (error) {
      console.log(error);
    }
  };

  unzipAndUpdateLocaleDB = async () => {
    try {
      RNFS.copyFileAssets(
        "backendCache.zip",
        RNFS.DocumentDirectoryPath + "backendCache.zip"
      ).then(res => {
        unzip(
          RNFS.DocumentDirectoryPath + "backendCache.zip",
          RNFS.DocumentDirectoryPath
        ).then(async (path: any) => {
          console.log(`zip completed at ${path}`);
          await AsyncStorage.setItem(
            dbLocalVersionKey,
            dbCacheVersion.toString()
          );
          const isDir = await RNFetchBlob.fs.isDir(
            RNFetchBlob.fs.dirs.DocumentDir + "/images/"
          );
          if (!isDir) {
            await RNFetchBlob.fs.mkdir(
              RNFetchBlob.fs.dirs.DocumentDir + "/images/"
            );
          }
          RNFetchBlob.fs.mv(
            RNFetchBlob.fs.dirs.DocumentDir + "/backendCache/images/",
            RNFetchBlob.fs.dirs.DocumentDir + "/images/"
          );
          updateLocalObjectItemDB();
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return <AppNavigator />;
  }
}

function mapStateToProps(state: any): StateProps {
  return {
    isFetchingAuthMetaData: state.auth.isFetching
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>): DispatchProps {
  return {
    requestUser: () => {
      dispatch(requestUserActionCreator());
    },
    postTrackingData: (trackingDataToSync: TrackingData[]) => {
      dispatch(postTrackingDataActionCreator(trackingDataToSync));
    }
  };
}

const ConnectedApp = connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(App);

addLocaleData([...en, ...de]); // Needed for react-intl
let deviceLanguage: string = DeviceInfo.getDeviceLocale().substr(0, 2);
if (deviceLanguage !== "de" && deviceLanguage !== "en") {
  deviceLanguage = "en";
}
moment.locale(deviceLanguage);

const WrappedApp = () => (
  <Provider store={store}>
    <IntlProvider
      locale={deviceLanguage}
      messages={messages[deviceLanguage]}
      textComponent={Text}
    >
      <ConnectedApp />
    </IntlProvider>
  </Provider>
);
export default WrappedApp;
