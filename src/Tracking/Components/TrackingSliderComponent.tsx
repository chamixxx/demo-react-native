import React from "react";
// @ts-ignore
import SliderCustom from "react-native-slider";
import {
  View,
  Text,
  Image,
  Slider,
  StyleSheet,
  Dimensions,
  ImageBackground,
  TouchableWithoutFeedback
} from "react-native";
import {
  TrackingTypesEnum,
  TrackingType,
  trackingIconFrom,
  mappingForSliderWithFiveTrackingValues
} from "../Utils/TrackingUtils";
import {
  TrackingSliderTextArray,
  IntlMessageContent
} from "../Utils/TrackingStaticData";
import { injectIntl, InjectedIntlProps } from "react-intl";
import { connect } from "react-redux";
import { updateTrackingDataSliderActionCreator } from "../TrackingActions";
import { getSliderValue, getTrackingData } from "../TrackingReducer";
import {
  trafficLightColourScale,
  blueColourFromScheme,
  mediumGreyColour,
  darkGreyColour
} from "../../Utils/Constants";

interface OwnProps {
  trackingType: TrackingType;
  selectedValue?: number;
}

interface StateProps {
  currentSliderValue?: number;
}

interface DispatchProps {
  updateTrackingData: (
    trackingType: TrackingType,
    value: number,
    sliderRange: number
  ) => void;
}

interface LState {
  sliderValue: number;
}

type Props = OwnProps & StateProps & DispatchProps & InjectedIntlProps;

class TrackingSliderComponent extends React.Component<Props, LState> {
  private sliderView!: View;

  constructor(props: Props) {
    super(props);
    const { trackingType, selectedValue } = this.props;
    this.state = {
      sliderValue:
        this.props.currentSliderValue === undefined
          ? 0
          : this.props.currentSliderValue
    };
  }

  componentWillReceiveProps(newProps: Props) {
    const currentSliderValue =
      newProps.currentSliderValue === undefined
        ? 0
        : newProps.currentSliderValue;
    if (newProps.trackingType !== this.props.trackingType) {
      this.setState({ sliderValue: currentSliderValue });
    }
  }

  getTrackingIconImgSource = () => {
    return trackingIconFrom(this.props.trackingType, this.state.sliderValue);
  };

  isTrafficLightSlider = (): boolean => {
    switch (this.props.trackingType) {
      case TrackingTypesEnum.bloatingType:
        return true;
      case TrackingTypesEnum.headacheType:
        return true;
      case TrackingTypesEnum.moodType:
        return true;
      case TrackingTypesEnum.otherPainType:
        return true;
      case TrackingTypesEnum.tummyPainType:
        return true;
      case TrackingTypesEnum.periodType:
        return false;
      case TrackingTypesEnum.sleepType:
        return false;
      case TrackingTypesEnum.stressType:
        return true;
      case TrackingTypesEnum.waterType:
        return false;
      case TrackingTypesEnum.workoutType:
        return false;
      default:
        // Not handling types that are not tracked with sliders
        return false;
    }
  };

  updateSliderValue = (value: number) => {
    this.setState({
      sliderValue: value
    });
  };

  updateAppState = (value: number) => {
    const sliderRange = TrackingSliderTextArray.trackingTextArrayFromTrackingType(
      this.props.trackingType
    ).length;
    this.props.updateTrackingData(this.props.trackingType, value, sliderRange);
  };

  getThumbImgSource = (currentSliderValue: number) => {
    const thumbImgSourcesTrafficLight = [
      require("../Images/SlidersThumbImage/sliderCircleDarkGreen.png"),
      require("../Images/SlidersThumbImage/sliderCircleLightGreen.png"),
      require("../Images/SlidersThumbImage/sliderCircleYellow.png"),
      require("../Images/SlidersThumbImage/sliderCircleOrange.png"),
      require("../Images/SlidersThumbImage/sliderCircleRed.png")
    ];

    const thumbImgSourceBlue = require("../Images/SlidersThumbImage/sliderCircleBlue.png");
    const thumbImgSourceGrey = require("../Images/SlidersThumbImage/sliderCircleGrey.png");

    if (currentSliderValue === 0) {
      return thumbImgSourceGrey;
    } else if (this.isTrafficLightSlider() === false) {
      return thumbImgSourceBlue;
    } else {
      return thumbImgSourcesTrafficLight[currentSliderValue - 1];
    }
  };

  getLabelForSliderValue = (
    sliderTextQuestion: IntlMessageContent,
    sliderTextArray: IntlMessageContent[],
    currentSliderValue: number
  ) => {
    if (currentSliderValue === 0) {
      return sliderTextQuestion;
    }
    return sliderTextArray[currentSliderValue - 1];
  };

  getSliderTrackImage = (range: number): any => {
    switch (range) {
      case 3:
        return require("../Images/SliderTracks/slider_3_tracking.png");
      case 4:
        return require("../Images/SliderTracks/slider_4_tracking.png");
      case 5:
        return require("../Images/SliderTracks/slider_5_tracking.png");
    }
  };

  getTintColor = (value: number): any => {
    if (value > 0) {
      if (this.isTrafficLightSlider()) {
        return { tintColor: trafficLightColourScale[value - 1] };
      } else {
        return { tintColor: blueColourFromScheme };
      }
    } else {
      return { tintColor: mediumGreyColour };
    }
  };

  tapSliderHandler = (evt: any) => {
    this.sliderView.measure((fx, fy, width, height, px, py) => {
      const sliderMaxValue: number = TrackingSliderTextArray.trackingTextArrayFromTrackingType(
        this.props.trackingType
      ).length;

      let sliderValue = Math.round(
        (evt.nativeEvent.locationX * sliderMaxValue) / width
      );
      this.updateAppState(sliderValue);
      this.updateSliderValue(sliderValue);
    });
  };

  render() {
    const sliderTextArray = TrackingSliderTextArray.trackingTextArrayFromTrackingType(
      this.props.trackingType
    );
    const sliderTextQuestion = TrackingSliderTextArray.trackingQuestionString(
      this.props.trackingType
    );
    const sliderValueLabel = this.getLabelForSliderValue(
      sliderTextQuestion,
      sliderTextArray,
      this.state.sliderValue
    );

    const trackingIconStyle = {
      ...StyleSheet.flatten(styles.trackingIcon),
      ...this.getTintColor(this.state.sliderValue)
    };

    return (
      <View style={styles.containerView}>
        <View style={styles.labelView}>
          <Image
            source={this.getTrackingIconImgSource()}
            style={trackingIconStyle}
          />
          <Text style={styles.valueLabel}>
            {this.props.intl.formatMessage(sliderValueLabel)}
          </Text>
        </View>

        <ImageBackground
          source={this.getSliderTrackImage(sliderTextArray.length)}
          style={{
            width: "97%",
            marginTop: 10
          }}
          imageStyle={{ resizeMode: "contain", margin: 5 }}
        >
          <View
            ref={(ref: any) => {
              this.sliderView = ref as View;
            }}
            collapsable={false}
          >
            <TouchableWithoutFeedback onPressIn={this.tapSliderHandler}>
              <SliderCustom
                step={1}
                maximumValue={sliderTextArray.length}
                style={styles.slider}
                thumbImage={this.getThumbImgSource(this.state.sliderValue)}
                onValueChange={this.updateSliderValue}
                value={this.props.currentSliderValue}
                onSlidingComplete={this.updateAppState}
                maximumTrackTintColor="transparent"
                minimumTrackTintColor="transparent"
                thumbStyle={{
                  width: 34,
                  height: 33,
                  borderColor: "transparent",
                  backgroundColor: "transparent"
                }}
              />
            </TouchableWithoutFeedback>
          </View>
          {/* <Slider

            step={1}
            maximumValue={sliderTextArray.length}
            style={styles.slider}
            thumbImage={this.getThumbImgSource(currentSliderValue)}
            onValueChange={this.updateSliderValue}
            value={this.props.currentSliderValue}
            maximumTrackTintColor="transparent"
            minimumTrackTintColor="transparent"
          /> */}
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    marginLeft: 14,
    marginRight: 14,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  labelView: {
    flexDirection: "row",
    alignItems: "center",
    height: 34
  },
  slider: {
    height: 32
  },
  valueLabel: {
    flex: 1,
    marginLeft: 12,
    color: darkGreyColour,
    fontSize: 14
  },
  trackingIcon: {
    height: 32,
    width: 32,
    resizeMode: "contain"
  }
});

function mapStateToProps(state: any, ownProps: OwnProps): StateProps {
  return {
    currentSliderValue: getSliderValue(
      TrackingSliderTextArray.trackingTextArrayFromTrackingType(
        ownProps.trackingType
      ).length,
      getTrackingData(ownProps.trackingType, state.tracking.unsavedTracking)
        .value
    )
  };
}

function mapDispatchToProps(dispatch: any): DispatchProps {
  return {
    updateTrackingData: (
      trackingType: TrackingType,
      value: number,
      sliderRange: number
    ) => {
      dispatch(
        updateTrackingDataSliderActionCreator(trackingType, value, sliderRange)
      );
    }
  };
}

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(TrackingSliderComponent));
