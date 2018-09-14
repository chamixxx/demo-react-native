import React from "react";
import { TextInput, StyleSheet, Keyboard } from "react-native";
import { TrackingSliderTextArray } from "../Utils/TrackingStaticData";
import { TrackingType } from "../Utils/TrackingUtils";
import { injectIntl, InjectedIntlProps } from "react-intl";
import { connect } from "react-redux";
import { updateTrackingDataFreeTextActionCreator } from "../TrackingActions";
import { getTrackingData } from "../TrackingReducer";
import { mediumGreyColour, darkGreyColour } from "../../Utils/Constants";

interface OwnProps {
  style?: any;
  trackingType: TrackingType;
}

interface State {
  didPressReturnKey: boolean;
}

interface StateProps {
  text?: string;
}

interface DispatchProps {
  updateTrackingData: (trackingType: TrackingType, text?: string) => void;
}

type Props = OwnProps & StateProps & DispatchProps & InjectedIntlProps;

class TrackingFreeTextComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      didPressReturnKey: false
    };
  }

  onFocus = () => {
    if (this.props.text === undefined) {
      this.props.updateTrackingData(this.props.trackingType, "");
    }
  };

  onEndEditing = () => {
    if (this.props.text === "") {
      this.props.updateTrackingData(this.props.trackingType, undefined);
    }
  };

  onChangeText = (text: string) => {
    if (this.state.didPressReturnKey === false) {
      this.props.updateTrackingData(this.props.trackingType, text);
    }
  };

  handleReturnKey = (keyboardEvent: { nativeEvent: { key: string } }) => {
    if (keyboardEvent.nativeEvent.key === "Enter") {
      Keyboard.dismiss();
      this.setState({ didPressReturnKey: true });
    } else {
      this.setState({ didPressReturnKey: false });
    }
  };

  render() {
    const placeHolderText = this.props.intl.formatMessage(
      TrackingSliderTextArray.trackingQuestionString(this.props.trackingType)
    );

    const textInputStyle = {
      ...StyleSheet.flatten(styles.textInput),
      ...this.props.style
    };

    return (
      <TextInput
        style={textInputStyle}
        value={this.props.text}
        editable={true}
        multiline={true}
        returnKeyType="done"
        onFocus={this.onFocus}
        onChangeText={this.onChangeText}
        onKeyPress={this.handleReturnKey}
        onEndEditing={this.onEndEditing}
        underlineColorAndroid="transparent"
        placeholder={placeHolderText}
        placeholderTextColor={mediumGreyColour}
      />
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    color: darkGreyColour,
    fontSize: 14,
    borderRadius: 10,
    padding: 12,
    textAlignVertical: "top"
  }
});

function mapStateToProps(state: any, ownProps: OwnProps): StateProps {
  return {
    text: getTrackingData(ownProps.trackingType, state.tracking.unsavedTracking)
      .text
  };
}

function mapDispatchToProps(dispatch: any): DispatchProps {
  return {
    updateTrackingData: (trackingType: TrackingType, text?: string) => {
      dispatch(updateTrackingDataFreeTextActionCreator(trackingType, text));
    }
  };
}

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(TrackingFreeTextComponent));
