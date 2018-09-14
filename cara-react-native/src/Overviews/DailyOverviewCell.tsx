import React from "react";
import {
  TrackingTypesEnum,
  trackingIconFrom,
  labelFromTrackingType
} from "../Tracking/Utils/TrackingUtils";
import Moment from "moment";

import { View, Text, Image, TouchableHighlight } from "react-native";
import { Card, CardItem, Left, Body, Right } from "native-base";
import { getMealItemImageFullPathForReading } from "../Tracking/Utils/MealItemImageManager";
import { getSliderValue } from "../Tracking/TrackingReducer";
import { TrackingSliderTextArray } from "../Tracking/Utils/TrackingStaticData";
import { InjectedIntlProps, injectIntl } from "react-intl";
import {
  darkGreyColour,
  trafficLightColourScaleStool,
  blueColourFromScheme,
  trafficLightColourScale,
  mainSeaColour
} from "../Utils/Constants";
import {
  requestExportLinkActionCreator,
  postMetadataActionCreator
} from "../Auth/AuthActions";
import TrackingData, {
  mapRealmTrackingDataToTrackingData
} from "../Models/TrackingData";
import FoodItem, { mapRealmFoodItemToFoodItem } from "../Models/FoodItem";
const uuid = require("react-native-uuid");

interface OwnProps {
  trackingData: TrackingData;
  index: number;
  startTracking: (trackingDataToEdit: TrackingData) => void;
}

interface StateProps {}

interface DispatchProps {}

type Props = StateProps & DispatchProps & OwnProps & InjectedIntlProps;

interface State {}

// Component class
class DailyOverviewCell extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {}

  componentWillReceiveProps(newProps: Props) {}

  renderOverviewItemHeader = (item: TrackingData): JSX.Element => {
    return (
      <CardItem style={{ height: 36, backgroundColor: "#F5F4F4" }}>
        <Left>
          <Image
            source={require("./Images/iCNClockOverview.png")}
            style={{ height: 16, margin: 0, resizeMode: "contain" }}
          />
          <Body style={{ flexDirection: "row" }}>
            <Text>{Moment(item.timestamptracking!).format("LT")}</Text>
            <Text style={{ marginLeft: 12 }}>
              {this.props.intl.formatMessage(
                labelFromTrackingType(item.trackingType)
              )}
            </Text>
          </Body>
        </Left>
        <Right>
          <Image
            source={require("./Images/iCNEdit.png")}
            style={{ height: 36, resizeMode: "contain", marginRight: -10 }}
          />
        </Right>
      </CardItem>
    );
  };

  renderTagLisItem = (item: FoodItem): JSX.Element => {
    let itemMapped = mapRealmFoodItemToFoodItem(item);
    return (
      <View
        key={uuid.v1()}
        style={{
          backgroundColor: mainSeaColour,
          borderRadius: 20,
          margin: 3,
          flexDirection: "row",
          alignItems: "center",
          height: 24
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 11,
            marginLeft: 8,
            marginRight: 8
          }}
        >
          {itemMapped.getLocalName()}
        </Text>
      </View>
    );
  };

  renderFoodOverviewBody = (item: TrackingData): JSX.Element => {
    let imageItem = (
      <View>
        <Image
          source={{
            uri: getMealItemImageFullPathForReading(
              item.mealItems[0].imagePath!
            )
          }}
          style={{
            aspectRatio: 16 / 9,
            width: "100%",
            resizeMode: "cover",
            marginBottom: 6
          }}
        />
      </View>
    );
    if (item.mealItems[0].imagePath == null) {
      imageItem = <View />;
    }
    return (
      <CardItem cardBody style={{ flexDirection: "column" }}>
        {imageItem}
        <View
          style={{
            alignSelf: "flex-start",
            flexDirection: "row",
            flexWrap: "wrap",
            margin: 5,
            marginTop: -2
          }}
        >
          {item.mealItems[0].foodItems.map(item => this.renderTagLisItem(item))}
        </View>
      </CardItem>
    );
  };

  renderOverviewItemBody = (item: TrackingData): JSX.Element => {
    let bodyType: string = "food";
    let tintColorType: string = "blue";
    switch (item.trackingType) {
      case TrackingTypesEnum.foodType:
        bodyType = "food";
        break;
      case TrackingTypesEnum.bloatingType:
        bodyType = "slider";
        tintColorType = "trafficLight";
        break;
      case TrackingTypesEnum.headacheType:
        bodyType = "slider";
        tintColorType = "trafficLight";
        break;
      case TrackingTypesEnum.medicationsType:
        bodyType = "freeText";
        break;
      case TrackingTypesEnum.medicationsType2:
        bodyType = "freeText";
        break;
      case TrackingTypesEnum.moodType:
        bodyType = "slider";
        tintColorType = "trafficLight";
        break;
      case TrackingTypesEnum.notesType:
        bodyType = "freeText";
        break;
      case TrackingTypesEnum.otherPainType:
        bodyType = "slider";
        tintColorType = "trafficLight";
        break;
      case TrackingTypesEnum.periodType:
        bodyType = "slider";
        break;
      case TrackingTypesEnum.skinType:
        bodyType = "nothing";
        break;
      case TrackingTypesEnum.sleepType:
        bodyType = "slider";
        break;
      case TrackingTypesEnum.stoolType:
        bodyType = "slider";
        tintColorType = "trafficLightStool";
        break;
      case TrackingTypesEnum.stressType:
        bodyType = "slider";
        tintColorType = "trafficLight";
        break;
      case TrackingTypesEnum.tummyPainType:
        bodyType = "slider";
        tintColorType = "trafficLight";
        break;
      case TrackingTypesEnum.waterType:
        bodyType = "slider";
        break;
      case TrackingTypesEnum.workoutType:
        bodyType = "slider";
        break;
      case TrackingTypesEnum.additionalSymptomsType:
        bodyType = "freeText";
        break;
    }

    switch (bodyType) {
      case "food":
        return (
          <View>
            <CardItem style={{}}>
              <Left>
                <Image
                  source={trackingIconFrom(item.trackingType)}
                  style={{
                    height: 32,
                    width: 32,
                    margin: 0,
                    resizeMode: "contain",
                    tintColor: darkGreyColour
                  }}
                />
                <Body style={{ flexDirection: "row" }}>
                  <Text>{item.mealItems[0].name}</Text>
                </Body>
              </Left>
            </CardItem>
            {this.renderFoodOverviewBody(item)}
          </View>
        );

      case "slider":
        const labelArray = TrackingSliderTextArray.trackingTextArrayFromTrackingType(
          item.trackingType
        );
        const sliderValue = getSliderValue(labelArray.length, item.value!);
        let tintColor = blueColourFromScheme;
        if (tintColorType == "trafficLight") {
          tintColor = trafficLightColourScale[sliderValue! - 1];
        } else if (tintColorType == "trafficLightStool") {
          tintColor = trafficLightColourScaleStool[sliderValue!];
        }
        return (
          <CardItem style={{}}>
            <Left>
              <Image
                source={trackingIconFrom(item.trackingType, sliderValue)}
                style={{
                  height: 32,
                  width: 32,
                  margin: 0,
                  resizeMode: "contain",
                  tintColor: tintColor
                }}
              />
              <Body style={{ flexDirection: "row" }}>
                <Text>
                  {this.props.intl.formatMessage(labelArray[sliderValue! - 1])}
                </Text>
              </Body>
            </Left>
          </CardItem>
        );

      case "freeText":
        return (
          <CardItem style={{}}>
            <Left>
              <Image
                source={trackingIconFrom(item.trackingType, sliderValue)}
                style={{
                  height: 32,
                  width: 32,
                  margin: 0,
                  resizeMode: "contain"
                }}
              />
              <Body style={{ flexDirection: "row" }}>
                <Text>{item.text!}</Text>
              </Body>
            </Left>
          </CardItem>
        );
      default:
        return <View />;
    }
  };

  handleTouchOnCard = () => {
    const trackingData = mapRealmTrackingDataToTrackingData(
      this.props.trackingData
    );
    this.props.startTracking(trackingData);
  };

  render() {
    return (
      <TouchableHighlight
        onPress={() => this.handleTouchOnCard()}
        underlayColor="#ffffff00"
      >
        <Card style={{ marginLeft: 8, marginRight: 8 }}>
          {this.renderOverviewItemHeader(this.props.trackingData)}
          {this.renderOverviewItemBody(this.props.trackingData)}
        </Card>
      </TouchableHighlight>
    );
  }
}

export default injectIntl(DailyOverviewCell);
