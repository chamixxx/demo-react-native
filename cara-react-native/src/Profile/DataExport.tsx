import { InjectedIntl } from "react-intl";
import { Alert, AlertButton } from "react-native";
import { getAccountInfo } from "../RealmDB/RealmUtils";
import { RequestError } from "../Utils/Store";

const cancelButton = (intl: InjectedIntl) => {
  const cancelAlertButton: AlertButton = {
    text: intl.formatMessage({
      id: "_common.cancel",
      defaultMessage: "Cancel"
    }),
    onPress: () => {},
    style: "cancel"
  };
  return cancelAlertButton;
};

export const hasAlreadyExportLink = (isPersonal: boolean): boolean => {
  const accountInfo = getAccountInfo();
  const { exportPersonalToken, exportShareToken } = accountInfo;
  if (isPersonal) {
    if (exportPersonalToken === undefined || exportPersonalToken === null) {
      return false;
    }
    return true;
  } else {
    if (exportShareToken === undefined || exportShareToken === null) {
      return false;
    }
    return true;
  }
};

export const showShareYourDataAlert = (
  intl: InjectedIntl,
  requestToken: (isPersonal: boolean) => void
) => {
  const alertTitle = intl.formatMessage({
    id: "profile.sharing.shareYourData",
    defaultMessage: "Share your data"
  });
  const alertBody = intl.formatMessage({
    id: "profile.sharing.doYouWantToMakeAvailableYourTracking",
    defaultMessage:
      "Do you want to make your tracking data available via a web-link?"
  });
  const okButton: AlertButton = {
    text: intl.formatMessage({
      id: "_common.desktopWebInterface",
      defaultMessage: "Desktop web interface"
    }),
    onPress: () => {
      showDataUsageAlert(intl, requestToken);
    }
  };
  Alert.alert(alertTitle, alertBody, [okButton, cancelButton(intl)], {
    cancelable: true
  });
};

export const showDataUsageAlert = (
  intl: InjectedIntl,
  requestToken: (isPersonal: boolean) => void
) => {
  const alertTitle = intl.formatMessage({
    id: "_common.desktopWebInterface",
    defaultMessage: "Desktop web interface"
  });
  const alertBody = intl.formatMessage({
    id: "profile.sharing.doYouWantToUseTheDesktopAppYourselfOrDoYouWantToShare?",
    defaultMessage: "Do you want to use the desktop app yourself or do you want to share your data with someone else, e. g. your HCP?"
  });
  const myselfButton: AlertButton = {
    text: intl.formatMessage({
      id: "profile.sharing.useMyself",
      defaultMessage: "Use myself"
    }),
    onPress: () => {
      if (hasAlreadyExportLink(true) === true) {
        showWarningAboutResettingToken(intl, true, requestToken);
      } else {
        showWaitingAlert(intl);
        requestToken(true);
      }
    }
  };
  const someoneButton: AlertButton = {
    text: intl.formatMessage({
      id: "profile.sharing.shareYourData",
      defaultMessage: "Share your data"
    }),
    onPress: () => {
      if (hasAlreadyExportLink(false) === true) {
        showWarningAboutResettingToken(intl, false, requestToken);
      } else {
        showWaitingAlert(intl);
        requestToken(false);
      }
    }
  };

  Alert.alert(
    alertTitle,
    alertBody,
    [myselfButton, someoneButton, cancelButton(intl)],
    { cancelable: true }
  );
};

export const showWarningAboutResettingToken = (
  intl: InjectedIntl,
  isPersonal: boolean,
  requestToken: (isPersonal: boolean) => void
) => {
  const alertTitle = intl.formatMessage({
    id: "profile.sharing.doYouWantToReSetYourPreviousWebAppLink?",
    defaultMessage: "Do you want to re-set your previous web app link?"
  });
  const alertBody = intl.formatMessage({
    id: "profile.sharing.youHaveAlreadyCreatedDoYouWantToDeactivate?",
    defaultMessage:
      "\nYou have already created a secret link in the past. You might be able to find it in your email archive.\n\nIf you proceed to create a new link, your old link will not work any more.\n\nDo you want to deactivate your previous link now and receive a new one via email?"
  });
  const continueButton: AlertButton = {
    text: intl.formatMessage({
      id: "profile.sharing.resetMySecretLink",
      defaultMessage: "Re-set my secret link"
    }),
    onPress: () => {
      showWaitingAlert(intl);
      requestToken(isPersonal);
    },
    style: "destructive"
  };
  const cancelButton: AlertButton = {
    text: intl.formatMessage({
      id: "profile.sharing.keepMyOldLinkActive",
      defaultMessage: "Keep my old link active"
    }),
    style: "cancel",
    onPress: () => {}
  };

  Alert.alert(alertTitle, alertBody, [continueButton, cancelButton], {
    cancelable: true
  });
};

export const showWaitingAlert = (intl: InjectedIntl) => {
  const alertTitle = intl.formatMessage({
    id: "profile.sharing.exporting",
    defaultMessage: "Exporting"
  });
  const alertBody = intl.formatMessage({
    id: "profile.sharing.yourDataIsCurrentlyBeingExportedToYourEmailAddress!",
    defaultMessage:
      "Your data is currently being exported to your email address!"
  });

  Alert.alert(alertTitle, alertBody);
};

export const showResultAlert = (intl: InjectedIntl, error: RequestError) => {
  let alertTitle = "";
  let alertBody = "";
  if (error.description !== undefined || error.statusCode !== undefined) {
    const statusCode =
      error.statusCode === undefined ? "" : error.statusCode + " ";
    const description =
      error.description === undefined ? "" : error.description;
    alertTitle = intl.formatMessage({
      id: "_common.oops!",
      defaultMessage: "Oops!"
    });
    alertBody =
      intl.formatMessage({
        id: "profile.sharing.weAreSorryTheExportCouldntCompleteForTheFollowingReason:",
        defaultMessage:
          "We are sorry! The export couldn't complete for the following reason: "
      }) +
      statusCode +
      description;
  } else {
    alertTitle = intl.formatMessage({
      id: "_common.great!",
      defaultMessage: "Great!"
    });
    alertBody = intl.formatMessage({
      id: "profile.sharing.youllFindTheDesktopAppLinkInYourMailboxItWillInclude",
      defaultMessage:
        "You'll find the desktop app link in your mailbox. It will include data tracked in the future as well."
    });
  }
  const okButton: AlertButton = {
    text: intl.formatMessage({
      id: "_common.ok!",
      defaultMessage: "Ok!"
    }),
    onPress: () => {}
  };
  Alert.alert(alertTitle, alertBody, [okButton], { cancelable: true });
};
