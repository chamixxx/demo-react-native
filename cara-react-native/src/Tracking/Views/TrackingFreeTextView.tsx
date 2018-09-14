import React from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";
import {
  TrackingCategoryType,
  labelFromTrackingCategoryType,
  trackingTypesFrom,
  TrackingType
} from "../Utils/TrackingUtils";
import TrackingFreeTextComponent from "../Components/TrackingFreeTextComponent";
import { injectIntl, InjectedIntlProps } from "react-intl";

interface OwnProps {
  trackingCategoryType: TrackingCategoryType;
  style?: any;
}

type Props = OwnProps & InjectedIntlProps;

class TrackingFreeTextView extends React.Component<Props, {}> {
  render() {
    const { trackingCategoryType } = this.props;
    const titleLabel = labelFromTrackingCategoryType(trackingCategoryType);
    console.log(titleLabel);
    const containerStyle = {
      ...StyleSheet.flatten(styles.containerView),
      ...this.props.style
    };
    const trackingTypes: TrackingType[] = trackingTypesFrom(
      trackingCategoryType
    );

    return (
      <View style={containerStyle}>
        <Text style={styles.titleLabel}>
          {this.props.intl.formatMessage(titleLabel)}
        </Text>
        <TrackingFreeTextComponent trackingType={trackingTypes[0]} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerView: {
    flex: 1
  },
  titleLabel: {
    textAlign: "center",
    color: "#595959",
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 42
  }
});

export default injectIntl(TrackingFreeTextView);
