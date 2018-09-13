import { ObjectSchema } from "realm";
import { each } from "lodash";

const uuid = require("react-native-uuid");

export default class AccountInfo {
  [key: string]: any;

  realmIdString: string = uuid.v1();
  username?: string = undefined; // Not optional for testing purpose, forces us to set an initial value or implement a constructor
  password?: string = undefined; // Not optional for testing purpose
  backingNickname?: string = undefined;
  sex?: string = undefined;
  age?: number = undefined;
  symptoms?: string = undefined;
  digestionLifeLimitation?: number = undefined;
  nutritionLimitation?: number = undefined;
  diagnosis?: string = undefined;
  diagnosisTime?: string = undefined;
  foodSensitivities?: string = undefined;
  treatment?: string = undefined;
  doctorEmail?: string = undefined;
  email?: string = undefined;
  emailConfirmed?: boolean = undefined;
  emailAlreadyInUse?: boolean = undefined;
  wantsNewsletter?: boolean = undefined;
  acceptedTac?: boolean = undefined;
  onboardingDoneOnDate?: Date = undefined;
  pushDeviceToken?: string = undefined;
  pushFirebaseToken?: string = undefined;
  timezone?: string = undefined;
  countryCode?: string = undefined;
  city?: string = undefined;
  languageCode?: string = undefined;
  platform?: string = undefined;
  timestampLastModified: Date = new Date();
  mixpanelToken?: string = undefined;
  intercomTokenIosEmail?: string = undefined;
  intercomTokenAndroidEmail?: string = undefined;
  exportPersonalToken?: string = undefined;
  exportShareToken?: string = undefined;
  needsSync: boolean = true;
  userPreferences: UserPreferences = { favouriteRecipesId: [] };

  constructor() {
    this.userPreferences = { favouriteRecipesId: [] };
  }

  static schema: ObjectSchema = {
    name: "AccountInfo",
    primaryKey: "realmIdString",
    properties: {
      realmIdString: "string",
      username: "string?",
      password: "string?",
      email: "string?",
      backingNickname: "string?",
      timestampLastModified: "date?",
      languageCode: "string?",
      timezone: "string?",
      emailConfirmed: "bool?",
      emailAlreadyInUse: "bool?",
      needsSync: "bool",
      intercomTokenIosEmail: "string?",
      intercomTokenAndroidEmail: "string?",
      exportPersonalToken: "string?",
      exportShareToken: "string?",
      platform: "string?",
      city: "string?",
      countryCode: "string?",
      userPreferences: "string"
    }
  };
}

export function isAuthenticatedWithBackend(
  username?: string,
  password?: string
): boolean {
  return username !== null && password !== null;
}

export interface AccountInfoResponse {
  [key: string]: any;
  confirmedEmail: string;
  email: string;
  emailAlreadyInUse: boolean;
  emailConfirmed: boolean;
  exportPersonalToken: string;
  exportShareToken: string;
  intercomTokenAndroid: string;
  intercomTokenAndroidEmail: string;
  intercomTokenIos: string;
  intercomTokenIosEmail: string;
  intercomTokenWeb: string;
  intercomTokenWebEmail: string;
  timestampLastModified: string;
  userPreferences: UserPreferences;
}

export function mapAccountInfoToRealmAccountInfo(
  accountInfo: AccountInfo
): any {
  return {
    ...accountInfo,
    userPreferences: JSON.stringify(accountInfo.userPreferences)
  };
}

export function mapRealmAccountInfoToAccountInfo(
  realmObject: any
): AccountInfo {
  let accountInfo = new AccountInfo();
  accountInfo.acceptedTac = realmObject.acceptedTac;
  accountInfo.age = realmObject.age;
  accountInfo.backingNickname = realmObject.backingNickname;
  accountInfo.city = realmObject.city;
  accountInfo.countryCode = realmObject.countryCode;
  accountInfo.diagnosis = realmObject.diagnosis;
  accountInfo.diagnosisTime = realmObject.diagnosisTime;
  accountInfo.digestionLifeLimitation = realmObject.digestionLifeLimitation;
  accountInfo.doctorEmail = realmObject.doctorEmail;
  accountInfo.email = realmObject.email;
  accountInfo.emailAlreadyInUse = realmObject.emailAlreadyInUse;
  accountInfo.emailConfirmed = realmObject.emailConfirmed;
  accountInfo.exportPersonalToken = realmObject.exportPersonalToken;
  accountInfo.exportShareToken = realmObject.exportShareToken;
  accountInfo.foodSensitivities = realmObject.foodSensitivities;
  accountInfo.intercomTokenAndroidEmail = realmObject.intercomTokenAndroidEmail;
  accountInfo.intercomTokenIosEmail = realmObject.intercomTokenIosEmail;
  accountInfo.languageCode = realmObject.languageCode;
  accountInfo.mixpanelToken = realmObject.mixpanelToken;
  accountInfo.needsSync = realmObject.needsSync;
  accountInfo.nutritionLimitation = realmObject.nutritionLimitation;
  accountInfo.onboardingDoneOnDate = realmObject.onboardingDoneOnDate;
  accountInfo.password = realmObject.password;
  accountInfo.platform = realmObject.platform;
  accountInfo.pushDeviceToken = realmObject.pushDeviceToken;
  accountInfo.pushFirebaseToken = realmObject.pushFirebaseToken;
  accountInfo.realmIdString = realmObject.realmIdString;
  accountInfo.sex = realmObject.sex;
  accountInfo.symptoms = realmObject.symptoms;
  accountInfo.timestampLastModified = realmObject.timestampLastModified;
  accountInfo.timezone = realmObject.timezone;
  accountInfo.treatment = realmObject.treatment;
  accountInfo.username = realmObject.username;
  if (JSON.parse(realmObject.userPreferences).favouriteRecipesId != undefined) {
    accountInfo.userPreferences.favouriteRecipesId = JSON.parse(
      realmObject.userPreferences
    ).favouriteRecipesId;
  } else {
    accountInfo.userPreferences = {
      favouriteRecipesId: []
    };
  }
  accountInfo.wantsNewsletter = realmObject.wantsNewsletter;
  return accountInfo;
}

export function toAccountInfoResponse(jsonData: any): AccountInfoResponse {
  let accountInfoResponse: AccountInfoResponse = jsonData;
  const propertiesToMapToBool = ["emailConfirmed", "emailAlreadyInUse"];
  each(propertiesToMapToBool, property => {
    if (jsonData[property] === "False") {
      accountInfoResponse[property] = false;
    } else if (jsonData[property] === "True") {
      accountInfoResponse[property] = true;
    }
  });
  return accountInfoResponse;
}

export interface UserPreferences {
  favouriteRecipesId: number[];
}
