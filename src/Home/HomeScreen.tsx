import React from "react";
import { View, StyleSheet } from "react-native";
import Intercom from "react-native-intercom";
import TrackingData from "../Models/TrackingData";
import { connect } from "react-redux";
import { initTrackingActionCreator } from "../Tracking/TrackingActions";
import {
  TrackingTypesEnum,
  trackingTypesFrom,
  trackingCategoryTypeFrom,
  TrackingType
} from "../Tracking/Utils/TrackingUtils";
import { getMealItemImageFullPathForReading } from "../Tracking/Utils/MealItemImageManager";
import TrackingOverviews from "../Overviews/TrackingOverviews";
import { NavigationScreenProp } from "react-navigation";

interface LState {
  modalVisibleTracking: boolean;
}

interface OwnProps {
  navigation: NavigationScreenProp<any, any>;
}

interface StateProps {}

interface DispatchProps {
  initTracking: (
    trackingDataArray: TrackingData[],
    isEditionMode: boolean
  ) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

class HomeScreen extends React.Component<Props, LState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      modalVisibleTracking: false
    };
  }

  componentWillMount() {
    Intercom.setLauncherVisibility("VISIBLE");
  }

  componentWillUnmount() {
    Intercom.setLauncherVisibility("GONE");
  }

  setModalVisibleTracking(visible: boolean) {
    this.setState({ modalVisibleTracking: visible });
  }

  startTracking = (trackingDataToEdit: TrackingData) => {
    let trackingDataArray: TrackingData[] = [];
    let trackingTypesToDisplay: TrackingType[] = trackingTypesFrom(
      trackingCategoryTypeFrom(trackingDataToEdit.trackingType)
    );
    for (let trackingType of trackingTypesToDisplay) {
      let trackingData: TrackingData;
      if (trackingDataToEdit.trackingType == trackingType) {
        trackingData = trackingDataToEdit;
        if (
          trackingType == TrackingTypesEnum.foodType &&
          trackingData.mealItems[0].imagePath !== null
        ) {
          trackingData.mealItems[0].imagePathTemp = getMealItemImageFullPathForReading(
            trackingData.mealItems[0].imagePath!
          );
        }
      } else {
        trackingData = new TrackingData(trackingType);
        trackingData.timestamptracking = trackingDataToEdit.timestamptracking;
      }
      trackingDataArray.push(trackingData);
    }
    this.props.initTracking(trackingDataArray, true);
    this.props.navigation.navigate("TrackingModal");
  };

  render() {
    return (
      <View style={styles.container}>
        <TrackingOverviews startTracking={this.startTracking} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  },
  tracking: {
    margin: 10
  }
});

function mapStateToProps(state: any): StateProps {
  return {};
}

function mapDispatchToProps(dispatch: any): DispatchProps {
  return {
    initTracking: (
      trackingDataArray: TrackingData[],
      isEditionMode: boolean
    ) => {
      dispatch(initTrackingActionCreator(trackingDataArray, isEditionMode));
    }
  };
}

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
