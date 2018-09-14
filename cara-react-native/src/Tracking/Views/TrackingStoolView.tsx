import React from "react";
// @ts-ignore
import SliderCustom from "react-native-slider";
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  TouchableWithoutFeedback,
  Image
} from "react-native";
import {
  TrackingCategoryType,
  trackingTypesFrom,
  TrackingType,
  labelFromTrackingCategoryType,
  TrackingTypesEnum,
  trackingIconFrom
} from "../Utils/TrackingUtils";
import { injectIntl, InjectedIntlProps } from "react-intl";
import {
  TrackingSliderTextArray,
  IntlMessageContent
} from "../Utils/TrackingStaticData";
import { connect } from "react-redux";
import { updateTrackingDataSliderActionCreator } from "../TrackingActions";
import {
  getSliderValue,
  getTrackingData,
  getNormalizedValue
} from "../TrackingReducer";
import {
  trafficLightColourScaleStool,
  darkGreyColour
} from "../../Utils/Constants";

interface OwnProps {
  trackingCategoryType: TrackingCategoryType;
  selectedValue?: number;
  style: any;
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

class TrackingStoolView extends React.Component<Props, LState> {
  private sliderView!: View;
  private trackingType: TrackingType = TrackingTypesEnum.stoolType;

  constructor(props: Props) {
    super(props);
    this.state = {
      sliderValue:
        this.props.currentSliderValue === undefined
          ? 0
          : this.props.currentSliderValue
    };
  }

  getTrackingIconImgSource = () => {
    return trackingIconFrom(this.trackingType, this.state.sliderValue);
  };

  getThumbImgSource = (currentSliderValue: number) => {
    const thumbImgSourcesTrafficLight = [
      require("../Images/SlidersThumbImage/sliderCircleGrey.png"),
      require("../Images/SlidersThumbImage/sliderCircleRed.png"),
      require("../Images/SlidersThumbImage/sliderCircleRed.png"),
      require("../Images/SlidersThumbImage/sliderCircleYellow.png"),
      require("../Images/SlidersThumbImage/sliderCircleDarkGreen.png"),
      require("../Images/SlidersThumbImage/sliderCircleDarkGreen.png"),
      require("../Images/SlidersThumbImage/sliderCircleYellow.png"),
      require("../Images/SlidersThumbImage/sliderCircleRed.png"),
      require("../Images/SlidersThumbImage/sliderCircleRed.png")
    ];
    return thumbImgSourcesTrafficLight[currentSliderValue];
  };

  getIconTintColor = (value: number): any => {
    return { tintColor: trafficLightColourScaleStool[value] };
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

  updateSliderValue = (value: number) => {
    this.setState({
      sliderValue: value
    });
  };

  updateAppState = (value: number) => {
    const sliderRange = TrackingSliderTextArray.trackingTextArrayFromTrackingType(
      this.trackingType
    ).length;
    this.props.updateTrackingData(this.trackingType, value, sliderRange);
  };

  tapSliderHandler = (evt: any) => {
    this.sliderView.measure((fx, fy, width, height, px, py) => {
      const sliderMaxValue: number = TrackingSliderTextArray.trackingTextArrayFromTrackingType(
        this.trackingType
      ).length;

      let sliderValue = Math.round(
        (evt.nativeEvent.locationX * sliderMaxValue) / width
      );
      this.updateAppState(sliderValue);
      this.updateSliderValue(sliderValue);
    });
  };

  render() {
    const { trackingCategoryType } = this.props;
    const titleLabel = labelFromTrackingCategoryType(trackingCategoryType);
    const sliderTextArray = TrackingSliderTextArray.trackingTextArrayFromTrackingType(
      this.trackingType
    );

    const sliderTextQuestion = TrackingSliderTextArray.trackingQuestionString(
      this.trackingType
    );

    const trackingIconStyle = {
      ...StyleSheet.flatten(styles.trackingIcon),
      ...this.getIconTintColor(this.state.sliderValue)
    };

    const containerStyle = {
      ...StyleSheet.flatten(styles.containerView),
      ...this.props.style
    };

    const sliderValueLabel = this.getLabelForSliderValue(
      sliderTextQuestion,
      sliderTextArray,
      this.state.sliderValue
    );

    return (
      <View style={containerStyle}>
        <Text style={styles.titleLabel}>
          {this.props.intl.formatMessage(titleLabel)}
        </Text>

        <Text style={styles.valueLabel}>
          {this.props.intl.formatMessage(sliderValueLabel)}
        </Text>

        <Image
          source={this.getTrackingIconImgSource()}
          style={trackingIconStyle}
        />

        <ImageBackground
          source={require("../Images/SliderTracks/stoolSliderTrack.png")}
          style={{
            width: "95%",
            marginTop: 25
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
                clipChildren={false}
                clipToPadding={false}
                thumbStyle={{
                  width: 34,
                  height: 33,
                  borderColor: "transparent",
                  backgroundColor: "transparent"
                }}
              />
            </TouchableWithoutFeedback>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center"
  },
  titleLabel: {
    fontSize: 14,
    color: darkGreyColour,
    fontWeight: "600",
    marginBottom: 24.5
  },
  valueLabel: {
    color: darkGreyColour,
    fontSize: 14
  },
  slider: {
    height: 32
  },
  trackingIcon: {
    height: 42,
    width: 42,
    resizeMode: "center",
    marginTop: 15
  }
});

function mapStateToProps(state: any, ownProps: OwnProps): StateProps {
  const trackingType = TrackingTypesEnum.stoolType;
  return {
    currentSliderValue: getSliderValue(
      TrackingSliderTextArray.trackingTextArrayFromTrackingType(trackingType)
        .length,
      getTrackingData(trackingType, state.tracking.unsavedTracking).value
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
)(injectIntl(TrackingStoolView));
