import { Linking, Platform, NativeModules } from "react-native";

export const isEmailValid = (text: string): boolean => {
  const re = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
  return re.test(text.toLowerCase());
};

export const openEmailDraft = (emailDestination: string, subject?: string) => {
  if (Platform.OS === "android") {
    if (subject !== undefined) {
      Linking.openURL(
        "mailto:?to=" + emailDestination + "?subject=" + subject!
      );
    } else {
      Linking.openURL("mailto:?to=" + emailDestination);
    }
  }
};

export const toTitleCase = (element: string): string => {
  return element
    .split(" ")
    .map(s => s.slice(0, 1).toUpperCase() + s.slice(1).toLowerCase())
    .join(" ");
};
