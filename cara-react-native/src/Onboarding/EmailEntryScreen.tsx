import React from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
  Button,
  NetInfo
} from "react-native";
// import { Button } from "native-base";
import {
  darkGreyColour,
  mainSeaColour,
  supportEmail,
  carrotRedColour,
  whiteBackgroundColor
} from "../Utils/Constants";
import { injectIntl, InjectedIntlProps } from "react-intl";
import { connect } from "react-redux";
import realm from "../RealmDB/RealmInit";
import AccountInfo from "../Models/AccountInfo";
import {
  postMetadataActionCreator,
  resetEmailStatusActionCreator
} from "../Auth/AuthActions";
import { NavigationScreenProp } from "react-navigation";
import EmailTextInputComponent from "./EmailTextInputComponent";
import { isEmailValid, openEmailDraft } from "../Utils/Utils";
import { resendEmailConfirmation } from "../Backend/DjangoBackend";
import { Button as NativeBaseButton } from "native-base";
import { getAccountInfo } from "../RealmDB/RealmUtils";

interface OwnProps {
  navigation: NavigationScreenProp<any, any>;
}

interface AppStateProps {
  isFetching: boolean;
  credentials: string;
}

interface DispatchProps {
  postMetadata: (delay?: number) => void;
  resetEmailStatus: () => void;
}

interface LState {
  email: string;
  emailValid: boolean;
  emailConfirmationPending: boolean;
  emailAlreadyInUse: boolean;
  emailConfirmed: boolean;
  isConnected: boolean;
}

type Props = OwnProps & InjectedIntlProps & DispatchProps & AppStateProps;

class EmailEntryScreen extends React.Component<Props, LState> {
  constructor(props: Props) {
    super(props);
    const accountInfo = getAccountInfo();
    const emailAlreadyInUse =
      accountInfo.emailAlreadyInUse === undefined || null
        ? false
        : accountInfo.emailAlreadyInUse;
    const emailConfirmed =
      accountInfo.emailConfirmed === undefined || null
        ? false
        : accountInfo.emailConfirmed;
    this.state = {
      email: "",
      emailValid: false,
      emailConfirmationPending: false,
      emailAlreadyInUse: emailAlreadyInUse,
      emailConfirmed: emailConfirmed,
      isConnected: false
    };
  }

  componentWillReceiveProps(newProps: Props) {
    if (
      newProps.isFetching === false &&
      newProps.navigation.isFocused() === true
    ) {
      const accountInfo = getAccountInfo();
      const emailAlreadyInUse =
        accountInfo.emailAlreadyInUse === undefined || null
          ? false
          : accountInfo.emailAlreadyInUse;
      const emailConfirmed =
        accountInfo.emailConfirmed === undefined || null
          ? false
          : accountInfo.emailConfirmed;
      this.setState({
        emailConfirmed: emailConfirmed,
        emailAlreadyInUse: emailAlreadyInUse
      });
      if (accountInfo.email !== null) {
        if (accountInfo.emailConfirmed === true) {
          this.props.navigation.navigate("App");
        } else if (accountInfo.emailAlreadyInUse === false) {
          if (
            this.state.emailConfirmationPending === true &&
            this.state.isConnected === true
          ) {
            //We already post once, so 2second delay
            this.props.postMetadata(2000);
          }
        } else {
          // We stop posting as email is already in use, so resetting emailConfirmationPending to false;
          this.setState({ emailConfirmationPending: false });
        }
      }
    }
  }

  componentDidMount() {
    NetInfo.getConnectionInfo().then(connectionInfo => {
      if (connectionInfo.type === "none" || connectionInfo.type === "NONE") {
        this.setState({ isConnected: false });
      } else {
        this.setState({ isConnected: true });
      }
    });
    NetInfo.isConnected.addEventListener(
      "connectionChange",
      this.handleConnectionChange
    );
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      "connectionChange",
      this.handleConnectionChange
    );
  }

  handleConnectionChange = (isConnected: boolean) => {
    this.setState({ isConnected });
  };

  onEmailBoxChange = (text: string) => {
    this.setState({
      email: text,
      emailValid: isEmailValid(text)
    });
  };

  onEmailConfirm = () => {
    const { email, emailValid } = this.state;

    if (emailValid) {
      const ai = realm.objects<AccountInfo>("AccountInfo")[0];
      realm.write(() => {
        ai.email = email;
      });
      this.props.postMetadata();
      this.setState({ emailConfirmationPending: true });
    }
  };

  resetEmailStatus = () => {
    this.props.resetEmailStatus();
    this.setState({
      emailConfirmationPending: false,
      emailValid: false,
      email: "",
      emailAlreadyInUse: false,
      emailConfirmed: false
    });
  };

  resendEmailConfirmation = () => {
    resendEmailConfirmation(this.props.credentials);
  };

  retryButton = () => {
    this.props.postMetadata();
  };

  supportButton = () => {
    openEmailDraft(supportEmail);
  };

  presentAccountRestoration = () => {
    this.props.navigation.navigate("AccountRestoration", {
      email: this.state.email,
      emailValid: this.state.emailValid
    });
  };

  getRetryButton = (): JSX.Element => (
    <Button
      color={mainSeaColour}
      onPress={this.retryButton}
      title={this.props.intl.formatMessage({
        id: "emailEntry.retry",
        defaultMessage: "Retry"
      })}
    />
  );

  getResendConfirmationButton = (): JSX.Element => (
    <Button
      color={mainSeaColour}
      onPress={this.resendEmailConfirmation}
      title={this.props.intl.formatMessage({
        id: "emailEntry.resendConfirmation",
        defaultMessage: "Resend email confirmation"
      })}
    />
  );

  render() {
    // We are currently posting to the backend in order to update the metadata
    if (this.state.emailConfirmationPending === true) {
      let rightButton;
      let warningText;
      let activityIndicator;
      if (this.state.isConnected === true) {
        rightButton = this.getResendConfirmationButton();
        warningText = null;
        activityIndicator = (
          <ActivityIndicator size="large" style={styles.activityIndicator} />
        );
      } else {
        rightButton = this.getRetryButton();
        warningText = (
          <Text
            style={[
              styles.instructions,
              { color: carrotRedColour, marginTop: 12 }
            ]}
          >
            {this.props.intl.formatMessage({
              id: "_common.noNetwork",
              defaultMessage: "No internet connection, please try again later"
            })}
          </Text>
        );
        activityIndicator = null;
      }
      return (
        <View style={styles.container}>
          <Text style={styles.instructions}>
            {this.props.intl.formatMessage({
              id: "emailEntry.confirmEmail",
              defaultMessage:
                "Waiting for you to confirm your email address. Please check your email box."
            })}
          </Text>
          {activityIndicator}
          <View style={styles.buttonsBox}>
            <View style={styles.buttonBoxElement}>
              <Button
                color={mainSeaColour}
                onPress={this.resetEmailStatus}
                title={this.props.intl.formatMessage({
                  id: "emailEntry.submitNewEmail",
                  defaultMessage: "Submit new email"
                })}
              />
            </View>
            <View style={styles.buttonBoxElement}>{rightButton}</View>
          </View>
          {warningText}
        </View>
      );
    } else if (this.state.emailAlreadyInUse === true) {
      return (
        <View style={styles.container}>
          <Text style={styles.instructions}>
            {this.props.intl.formatMessage({
              id: "emailEntry.emailAlreadyInUse",
              defaultMessage:
                "This e-mail address is already linked to a Cara account. Please login or use a different address."
            })}
          </Text>
          <View style={styles.buttonsBox}>
            <View style={styles.buttonBoxElement}>
              <Button
                color={mainSeaColour}
                onPress={this.resetEmailStatus}
                title={this.props.intl.formatMessage({
                  id: "emailEntry.submitNewEmail",
                  defaultMessage: "Submit new email"
                })}
              />
            </View>
            <View style={styles.buttonBoxElement}>
              <Button
                color={mainSeaColour}
                onPress={this.presentAccountRestoration}
                title={this.props.intl.formatMessage({
                  id: "emailEntry.login",
                  defaultMessage: "Log in"
                })}
              />
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <View>
            <Text style={styles.welcome}>
              {this.props.intl.formatMessage({
                id: "emailEntry.welcome",
                defaultMessage: "Welcome to Cara!"
              })}
            </Text>
            <Text style={styles.instructions}>
              {this.props.intl.formatMessage({
                id: "emailEntry.enterYourEmail",
                defaultMessage:
                  "Please enter your email address in order to start."
              })}
            </Text>
            <Text style={styles.instructions}>
              {this.props.intl.formatMessage({
                id: "emailEntry.support",
                defaultMessage:
                  "If you have any questions, please contact us at: "
              })}
            </Text>
            <NativeBaseButton
              onPress={this.supportButton}
              transparent
              light
              style={styles.supportButton}
            >
              <Text style={styles.supportText}>{supportEmail}</Text>
            </NativeBaseButton>
          </View>
          <EmailTextInputComponent
            onEmailConfirm={this.onEmailConfirm}
            style={{ marginBottom: 12 }}
            onEmailBoxChange={this.onEmailBoxChange}
          />
          <View style={styles.buttonSingle}>
            <Button
              color={mainSeaColour}
              disabled={!this.state.emailValid}
              onPress={this.onEmailConfirm}
              title={this.props.intl.formatMessage({
                id: "emailEntry.submit",
                defaultMessage: "Submit"
              })}
            />
          </View>
          <Text style={styles.instructions}>
            {this.props.intl.formatMessage({
              id: "emailEntry.alreadyUsedCara",
              defaultMessage: "If you already use Cara, you can login here:"
            })}
          </Text>
          <View style={styles.buttonSingle}>
            <Button
              color={mainSeaColour}
              onPress={this.presentAccountRestoration}
              title={this.props.intl.formatMessage({
                id: "emailEntry.login",
                defaultMessage: "Log in"
              })}
            />
          </View>
        </KeyboardAvoidingView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: whiteBackgroundColor,
    padding: 30
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    color: darkGreyColour,
    marginTop: -25,
    marginBottom: 50
  },
  instructions: {
    justifyContent: "flex-start",
    color: darkGreyColour,
    marginBottom: 12
  },
  emailBox: {
    width: 200,
    textAlign: "center"
  },
  buttonsBox: {
    flexDirection: "row"
  },
  buttonBoxElement: {
    marginHorizontal: 6,
    marginTop: 0,
    flex: 0.5,
    flexWrap: "wrap"
  },
  buttonSingle: {
    marginHorizontal: 6,
    marginBottom: 24,
    flexWrap: "wrap"
  },
  activityIndicator: {
    margin: 6
  },
  supportButton: {
    padding: 0,
    height: 22,
    marginBottom: 12
  },
  supportText: {
    fontWeight: "bold"
  }
});

function mapStateToProps(state: any): AppStateProps {
  return {
    isFetching: state.auth.isFetching,
    credentials: state.auth.credentials
  };
}

function mapDispatchToProps(dispatch: any): DispatchProps {
  return {
    postMetadata: (delay?: number) => {
      dispatch(postMetadataActionCreator(delay));
    },
    resetEmailStatus: () => {
      dispatch(resetEmailStatusActionCreator());
    }
  };
}

export default connect<AppStateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(EmailEntryScreen));
