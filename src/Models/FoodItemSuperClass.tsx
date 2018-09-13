import DeviceInfo from "react-native-device-info";

export default class FoodItemSuperClass {
  id?: number;
  name?: string;
  name_en?: string;
  imageUrl?: string;

  rules: string[] = [];

  getLocalName = (): string => {
    const languageCode = DeviceInfo.getDeviceLocale().substr(0, 2);
    if (languageCode == "de") {
      return this.name == undefined ? "" : this.name;
    } else {
      return this.name_en == undefined ? "" : this.name_en;
    }
  };

  matchingSynonym = (searchString: string): string | undefined => {
    return undefined;
  };

  setRules = () => {};

  getCurrentRating = (): number | undefined => {
    return undefined;
  };

  matchingPriority = (searchString: string): number | undefined => {
    return undefined;
  };

  isFoodItemCustom = (): boolean => {
    return false;
  };

  getSynonymsArray = (languageCode: string): string[] => {
    return [];
  };
}
