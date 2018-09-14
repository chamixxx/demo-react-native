import React from "react";
import TrackingSliderComponent from "../Components/TrackingSliderComponent";
import { View, StyleSheet, Text } from "react-native";
import {
  TrackingCategoryType,
  trackingTypesFrom,
  TrackingType,
  labelFromTrackingCategoryType
} from "../Utils/TrackingUtils";
import { injectIntl, InjectedIntlProps } from "react-intl";

interface Props {
  trackingCategoryType: TrackingCategoryType;
  style: any;
}

class TrackingSliderView extends React.Component<
  Props & InjectedIntlProps,
  {}
> {
  render() {
    const { trackingCategoryType } = this.props;
    const titleLabel = labelFromTrackingCategoryType(trackingCategoryType);

    const trackingTypes: TrackingType[] = trackingTypesFrom(
      trackingCategoryType
    );

    const containerStyle = {
      ...StyleSheet.flatten(styles.containerView),
      ...this.props.style
    };

    if (trackingTypes.length === 1) {
      return (
        <View style={containerStyle}>
          <Text style={styles.titleLabel}>
            {this.props.intl.formatMessage(titleLabel)}
          </Text>
          <View style={styles.sliderComponentView}>
            <TrackingSliderComponent trackingType={trackingTypes[0]} />
          </View>
        </View>
      );
    } else {
      return (
        <View style={containerStyle}>
          <Text style={styles.titleLabel}>
            {this.props.intl.formatMessage(titleLabel)}
          </Text>
          <View style={[styles.sliderComponentView, styles.sliderInterMargin]}>
            <TrackingSliderComponent trackingType={trackingTypes[0]} />
          </View>
          <View style={styles.sliderComponentView}>
            <TrackingSliderComponent trackingType={trackingTypes[1]} />
          </View>
        </View>
      );
    }
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
    color: "#595959",
    fontWeight: "600",
    marginBottom: 24.5
  },
  sliderComponentView: {
    flexDirection: "row"
  },
  sliderInterMargin: {
    marginBottom: 30
  }
});

export default injectIntl(TrackingSliderView);
