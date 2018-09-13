import * as React from "react";
import realm from "./RealmDB/RealmInit";
import AccountInfo from "./Models/AccountInfo";
import { NavigationScreenProp } from "react-navigation";
import { AsyncStorage } from "react-native";
import { inAccountRestorationMode } from "./Utils/Constants";

interface Props {
  navigation: NavigationScreenProp<any, any>;
}

class MainScreen extends React.Component<Props, {}> {
  componentWillMount() {
    const accountInfo = realm.objects<AccountInfo>("AccountInfo")[0];
    AsyncStorage.getItem(inAccountRestorationMode).then(value => {
      if (value === "true") {
        this.props.navigation.navigate("Auth");
        this.props.navigation.navigate("AccountRestoration", {
          isAccountRestoration: true
        });
      } else {
        if (accountInfo.emailConfirmed === true) {
          this.props.navigation.navigate("App");
        } else {
          this.props.navigation.navigate("Auth");
        }
      }
    });
  }

  render() {
    return null;
  }
}

export default MainScreen;
