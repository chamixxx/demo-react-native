import React from "react";
import { TextInput, StyleSheet } from "react-native";
import { darkGreyColour } from "../Utils/Constants";
import { injectIntl, InjectedIntlProps } from "react-intl";

interface OwnProps {
  onEmailConfirm: () => void;
  onEmailBoxChange: (email: string) => void;
  initialTextValue?: string;
  style?: any;
}

interface LState {}

type Props = OwnProps & InjectedIntlProps;

class EmailTextInputComponent extends React.Component<Props, LState> {
  constructor(props: Props) {
    super(props);
  }

  onEmailBoxChange = (text: string) => {
    this.props.onEmailBoxChange(text);
  };

  onEmailConfirm = () => {
    this.props.onEmailConfirm();
  };

  render() {
    const textInputStyle = {
      ...StyleSheet.flatten(styles.emailBox),
      ...this.props.style
    };

    const placeholder = this.props.intl.formatMessage({
      id: "emailEntry.yourEmailAddress",
      defaultMessage: "Your email address"
    });

    return (
      <TextInput
        placeholder={placeholder}
        defaultValue={this.props.initialTextValue}
        style={textInputStyle}
        keyboardType={"email-address"}
        spellCheck={false}
        autoCapitalize={"none"}
        onChangeText={this.onEmailBoxChange}
        onSubmitEditing={this.onEmailConfirm}
      />
    );
  }
}

const styles = StyleSheet.create({
  emailBox: {
    width: 200,
    textAlign: "center",
    color: darkGreyColour
  }
});

export default injectIntl(EmailTextInputComponent);
