import React from "react";
import { connect, Dispatch } from "react-redux";
import Moment from "moment";
import {
  TrackingCategoryTypesEnum,
  trackingCategoryTypeFrom,
  TrackingType,
  TrackingTypesEnum
} from "./Utils/TrackingUtils";
import TrackingData, { MealItem } from "../Models/TrackingData";
import {
  TrackingAction,
  saveTrackingDataActionCreator,
  updateTrackingTimestampActionCreator,
  deleteTrackingDataActionCreator,
  initTrackingActionCreator
} from "./TrackingActions";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableHighlight,
  Image,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import TrackingSliderView from "./Views/TrackingSliderView";
import TrackingFreeTextView from "./Views/TrackingFreeTextView";

import { Button, Text, Card } from "native-base";
import {
  trackingCategoryElementListFull,
  TrackingCategoryElement
} from "./Utils/TrackingCategoriesManager";
import {
  getDidTrackForCategoryDict,
  getTimestampTracking
} from "./TrackingReducer";
import TrackingStoolView from "./Views/TrackingStoolView";
import TrackingFoodView from "./Views/TrackingFoodView";
import DatePickerComponent from "./Components/DatePickerComponent";
import { injectIntl, InjectedIntlProps } from "react-intl";
import { carrotRedColour } from "../Utils/Constants";
import { NavigationScreenProp } from "react-navigation";

// Interfaces and types

interface OwnProps {
  navigation: NavigationScreenProp<any, any>;
}

interface StateProps {
  didUserTrackDict: { [key: string]: boolean };
  unsavedTrackingData: TrackingData[];
  isEditionMode: boolean;
  timestamptracking?: Date;
}

interface DispatchProps {
  saveTrackingAction: () => void;
  updateTimestamp: (timestamp: Date) => void;
  deleteTrackingPoint: (trackingType: TrackingType) => void;
  initTracking: (
    trackingDataArray: TrackingData[],
    isEditionMode: boolean
  ) => void;
}

type Props = StateProps & DispatchProps & OwnProps & InjectedIntlProps;

interface State {
  selectedTrackingIndex: number;
  previousSelectedIndex: number;
  trackingCategoryElementList: TrackingCategoryElement[];
}

// Component class

class TrackingScreen extends React.Component<Props, State> {
  private categoryPickerFlatList!: FlatList<TrackingCategoryElement>;
  private datePickerComponent!: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      selectedTrackingIndex: 0,
      previousSelectedIndex: 0,
      trackingCategoryElementList: []
    };
  }

  componentWillMount() {
    this.setState({
      trackingCategoryElementList: this.getCategoriesToDisplay()
    });
  }

  shouldComponentUpdate() {
    return this.props.navigation.isFocused();
  }

  getCategoriesToDisplay = (): TrackingCategoryElement[] => {
    if (this.props.isEditionMode) {
      return trackingCategoryElementListFull.filter(
        element =>
          element.categoryType ===
          trackingCategoryTypeFrom(
            this.props.unsavedTrackingData![0].trackingType
          )
      );
    }
    return trackingCategoryElementListFull;
  };

  getFooterToDisplay = (): JSX.Element => {
    if (this.props.isEditionMode) {
      return (
        <Button
          full
          light
          style={styles.deleteButton}
          onPressOut={event => {
            this.handleTouchDeleteButton();
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: carrotRedColour
            }}
          >
            {this.props.intl.formatMessage({
              id: "_common.delete.Normal",
              defaultMessage: "Delete"
            })}
          </Text>
        </Button>
      );
    }
    return (
      <FlatList
        data={this.getCategoriesToDisplay()}
        renderItem={({ item, index }) => this.renderPickerItem(item, index)}
        horizontal={true}
        style={styles.pickerView}
        keyExtractor={(item: TrackingCategoryElement, index: number) =>
          item.categoryType
        }
        extraData={{
          selectedTrackingIndex: this.state.selectedTrackingIndex,
          didUserTrackDict: this.props.didUserTrackDict
        }}
        ref={ref => {
          this.categoryPickerFlatList = ref as any;
        }}
      />
    );
  };

  handleTouchDeleteButton = () => {
    this.props.unsavedTrackingData.forEach(element => {
      this.props.deleteTrackingPoint(element.trackingType);
    });
    this.onSavePress();
  };

  handleTrackingPickerClick = (index: number) => {
    this.setState({ previousSelectedIndex: this.state.selectedTrackingIndex });
    this.setState({ selectedTrackingIndex: index });
    this.categoryPickerFlatList.scrollToIndex({
      animated: true,
      index: index,
      viewPosition: 0.5
    });
  };

  onSavePress = () => {
    this.props.navigation.pop();
    this.props.saveTrackingAction();
  };

  onCancelPress = () => {
    this.props.navigation.pop();
  };

  renderPickerItem = (
    item: TrackingCategoryElement,
    index: number
  ): JSX.Element => {
    let iconSource = item.iconInactive;
    if (index == this.state.selectedTrackingIndex) {
      iconSource = item.iconActive;
    }
    const displayStyle: any = this.props.didUserTrackDict[item.categoryType]
      ? { display: "flex" }
      : { display: "none" };

    const circleImageStyle = {
      ...StyleSheet.flatten(styles.circleImageStyle),
      ...displayStyle
    };

    return (
      <View style={styles.listItem}>
        <Image
          style={circleImageStyle}
          source={require("./Images/TrackingIconsCircledInactive/iCNTrackingTrackedIndicator.png")}
        />
        <TouchableHighlight
          onPress={() => this.handleTrackingPickerClick(index)}
          underlayColor="#ffffff00"
        >
          <Image
            source={iconSource}
            style={{
              width: (Dimensions.get("window").width * 16) / 75 - 20,
              height: (Dimensions.get("window").width * 16) / 75 - 20
            }}
          />
        </TouchableHighlight>
      </View>
    );
  };

  getTrackingViewForCategory(): JSX.Element {
    const trackingSliderView = (
      <TrackingSliderView
        trackingCategoryType={
          this.state.trackingCategoryElementList[
            this.state.selectedTrackingIndex
          ].categoryType
        }
        style={{ margin: 0, marginTop: 40 }}
      />
    );

    const trackingFreeTextView = (
      <TrackingFreeTextView
        trackingCategoryType={
          this.state.trackingCategoryElementList[
            this.state.selectedTrackingIndex
          ].categoryType
        }
        style={{
          marginLeft: 17,
          marginRight: 17,
          marginTop: 40,
          marginBottom: 60
        }}
      />
    );

    const trackingStoolView = (
      <TrackingStoolView
        trackingCategoryType={
          this.state.trackingCategoryElementList[
            this.state.selectedTrackingIndex
          ].categoryType
        }
        style={{ margin: 0, marginTop: 40 }}
      />
    );

    const trackingFoodView = (
      <TrackingFoodView
        trackingCategoryType={
          this.state.trackingCategoryElementList[
            this.state.selectedTrackingIndex
          ].categoryType
        }
        style={{
          marginLeft: 17,
          marginRight: 17,
          marginTop: 40,
          marginBottom: 60
        }}
      />
    );

    switch (
      this.state.trackingCategoryElementList[this.state.selectedTrackingIndex]
        .categoryType
    ) {
      case TrackingCategoryTypesEnum.additionalSymptomCategoryType:
        return trackingFreeTextView;
      case TrackingCategoryTypesEnum.digestionCategoryType:
        return trackingSliderView;
      case TrackingCategoryTypesEnum.foodCategoryType:
        return trackingFoodView;
      case TrackingCategoryTypesEnum.medicationsCategoryType:
        return <View />;
      case TrackingCategoryTypesEnum.mentalCategoryType:
        return trackingSliderView;
      case TrackingCategoryTypesEnum.notesCategoryType:
        return trackingFreeTextView;
      case TrackingCategoryTypesEnum.painCategoryType:
        return trackingSliderView;
      case TrackingCategoryTypesEnum.periodCategoryType:
        return trackingSliderView;
      case TrackingCategoryTypesEnum.skinCategoryType:
        return <View />;
      case TrackingCategoryTypesEnum.sleepCategoryType:
        return trackingSliderView;
      case TrackingCategoryTypesEnum.stoolCategoryType:
        return trackingStoolView;
      case TrackingCategoryTypesEnum.waterCategoryType:
        return trackingSliderView;
      case TrackingCategoryTypesEnum.workoutCategoryType:
        return trackingSliderView;
    }
  }

  updateTimestampTracking = (timestamp: Date) => {
    this.props.updateTimestamp(timestamp);
  };

  onTimeButtonPress = () => {
    this.datePickerComponent.onPress();
  };

  render() {
    const timeButtonText =
      this.props.timestamptracking === undefined
        ? this.props.intl.formatMessage({
            id: "addtracking.justNow",
            defaultMessage: "Just now"
          })
        : Moment(this.props.timestamptracking)
            .format("lll")
            .toLowerCase();

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.parentView}>
          <Image
            style={styles.backGroundImage}
            source={require("./Images/Common/bodyGradient.png")}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10
            }}
          >
            <Button
              style={styles.topButton}
              transparent
              light
              onPress={this.onCancelPress}
              color="#ffffff"
            >
              <Text>
                {this.props.intl.formatMessage({ id: "_common.cancel" })}
              </Text>
            </Button>

            <Button
              style={[
                styles.topButton,
                {
                  position: "absolute",
                  alignSelf: "center",
                  marginTop: 0,
                  top: 0,
                  left: 90,
                  right: 90,
                  bottom: 0,
                  justifyContent: "center",
                  alignItems: "center"
                }
              ]}
              transparent
              light
              onPress={this.onTimeButtonPress}
              color="#ffffff"
            >
              <Text style={{ fontSize: 13 }}>{timeButtonText}</Text>
            </Button>

            <Button
              style={styles.topButton}
              transparent
              light
              onPress={this.onSavePress}
              color="#ffffff"
            >
              <Text>
                {this.props.intl.formatMessage({
                  id: "_common.save",
                  defaultMessage: "Save all"
                })}
              </Text>
            </Button>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: "#FFFFFF00"
            }}
            removeClippedSubviews={false}
          >
            <Card style={styles.cardBackground}>
              {this.getTrackingViewForCategory()}
            </Card>
            <View>{this.getFooterToDisplay()}</View>
          </View>

          <DatePickerComponent
            updateTrackingTimeStamp={this.updateTimestampTracking}
            ref={ref => {
              this.datePickerComponent = ref as any;
            }}
            startDate={this.props.timestamptracking}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

function mapStateToProps(state: any): StateProps {
  return {
    didUserTrackDict: getDidTrackForCategoryDict(
      state.tracking.unsavedTracking
    ),
    unsavedTrackingData: state.tracking.unsavedTracking,
    timestamptracking: getTimestampTracking(state.tracking.unsavedTracking),
    isEditionMode: state.tracking.isEditionMode
  };
}

function mapDispatchToProps(dispatch: Dispatch<TrackingAction>): DispatchProps {
  return {
    saveTrackingAction: () => dispatch(saveTrackingDataActionCreator()),
    updateTimestamp: (timestamp: Date) =>
      dispatch(updateTrackingTimestampActionCreator(timestamp)),
    deleteTrackingPoint: (trackingType: TrackingType) => {
      dispatch(deleteTrackingDataActionCreator(trackingType));
    },
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
)(injectIntl(TrackingScreen));

const styles = StyleSheet.create({
  parentView: {
    height: Dimensions.get("window").height - 20,
    backgroundColor: "white"
  },
  backGroundImage: {
    width: 500,
    height: 358,
    position: "absolute",
    top: 0
  },
  cardBackground: {
    flex: 1,
    marginLeft: 9,
    marginRight: 9
  },
  pickerView: {
    height: (Dimensions.get("window").width * 16) / 75
    //marginBottom: 40
  },
  deleteButton: {
    height: (Dimensions.get("window").width * 16) / 75,
    width: Dimensions.get("window").width
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    marginTop: 20,
    marginBottom: 20
  },
  topButton: {
    margin: 0
  },
  circleImageStyle: {
    width: (Dimensions.get("window").width * 16) / 75 - 12,
    height: (Dimensions.get("window").width * 16) / 75 - 12,
    position: "absolute"
  }
});
