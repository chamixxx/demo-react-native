import realm from "./RealmInit";
import TrackingData, {
  TrackingDataResponse,
  MealItem,
  mapRealmTrackingDataToTrackingData,
  mapTrackingDataToRealmTrackingData,
  mapMealItemToRealmMealItem
} from "../Models/TrackingData";
import { each } from "lodash";
import AccountInfo, {
  AccountInfoResponse,
  mapRealmAccountInfoToAccountInfo,
  mapAccountInfoToRealmAccountInfo
} from "../Models/AccountInfo";
import DeviceInfo from "react-native-device-info";
import moment from "moment";
import { TrackingTypesEnum } from "../Tracking/Utils/TrackingUtils";
import { saveMealItemImage } from "../Tracking/Utils/MealItemImageManager";
import { Platform } from "react-native";
import RNFetchBlob from "react-native-fetch-blob";
import FoodItem, { mapFoodItemToFoodItemRealm } from "../Models/FoodItem";
import { isEmpty } from "lodash";

// Account Info

export function getAccountInfo(): AccountInfo {
  const accountInfoRealm = realm.objects<AccountInfo>("AccountInfo")[0];
  return mapRealmAccountInfoToAccountInfo(accountInfoRealm);
}

export function createAccountInfoIfNeeded() {
  if (realm.objects("AccountInfo").length === 0) {
    const ai: AccountInfo = new AccountInfo();
    realm.write(() => {
      realm.create("AccountInfo", mapAccountInfoToRealmAccountInfo(ai));
    });
  }
}

export function updateAccountInfo(): AccountInfo {
  const accountInfo = getAccountInfo();
  accountInfo.languageCode = DeviceInfo.getDeviceLocale();
  accountInfo.timezone = DeviceInfo.getTimezone();
  accountInfo.platform = "rn_" + Platform.OS;
  accountInfo.timestampLastModified = new Date();
  realm.write(() => {
    realm.create(
      "AccountInfo",
      mapAccountInfoToRealmAccountInfo(accountInfo),
      true
    );
  });
  return accountInfo;
}

export function resetEmailStatus() {
  const accountInfo = getAccountInfo();
  accountInfo.emailConfirmed = false;
  accountInfo.emailAlreadyInUse = false;
  accountInfo.email = undefined;
  realm.write(() => {
    realm.create(
      "AccountInfo",
      mapAccountInfoToRealmAccountInfo(accountInfo),
      true
    );
  });
}

export function syncAccountInfo(
  accountInfoResponse: AccountInfoResponse
): AccountInfo {
  const dataToSync = getAccountInfo();
  const timeStampStorage = dataToSync.timestampLastModified.getTime();
  const timeStampResponse = moment(accountInfoResponse.timestampLastModified)
    .toDate()
    .getTime();
  if (dataToSync.email !== undefined) {
    if (accountInfoResponse.confirmedEmail === dataToSync.email) {
      dataToSync.emailConfirmed = accountInfoResponse.emailConfirmed;
      dataToSync.intercomTokenAndroidEmail =
        accountInfoResponse.intercomTokenAndroidEmail;
      dataToSync.intercomTokenIosEmail =
        accountInfoResponse.intercomTokenIosEmail;
    }
    dataToSync.emailAlreadyInUse = accountInfoResponse.emailAlreadyInUse;
    if (accountInfoResponse.exportPersonalToken !== "None") {
      dataToSync.exportPersonalToken = accountInfoResponse.exportPersonalToken;
    }
    if (accountInfoResponse.exportShareToken !== "None") {
      dataToSync.exportShareToken = accountInfoResponse.exportShareToken;
    }
    if (timeStampStorage === timeStampResponse) {
      dataToSync.needsSync = false;
      realm.write(() => {
        realm.create(
          "AccountInfo",
          mapAccountInfoToRealmAccountInfo(dataToSync),
          true
        );
      });
      console.log("Account Info has been synchronized");
    }
  }
  return dataToSync;
}

export function persistUser(username: string, password: string) {
  const accountInfo = getAccountInfo();
  realm.write(() => {
    accountInfo.username = username;
    accountInfo.password = password;
    realm.create(
      "AccountInfo",
      mapAccountInfoToRealmAccountInfo(accountInfo),
      true
    );
  });
}

export function updateFavouriteRecipes(recipeId: number) {
  const accountInfo = getAccountInfo();
  const recipeIndex = accountInfo.userPreferences.favouriteRecipesId.indexOf(
    recipeId
  );
  if (recipeIndex !== -1) {
    accountInfo.userPreferences.favouriteRecipesId.splice(recipeIndex, 1);
  } else {
    accountInfo.userPreferences.favouriteRecipesId.push(recipeId);
  }
  console.log(accountInfo);
  realm.write(() => {
    realm.create(
      "AccountInfo",
      mapAccountInfoToRealmAccountInfo(accountInfo),
      true
    );
  });
}

export function getFavouriteRecipeIds() {
  const accountInfo = getAccountInfo();
  return accountInfo.userPreferences.favouriteRecipesId;
}

// Tracking Data

export function syncTrackingData(trackingDataResponse: TrackingDataResponse) {
  const dataToSync = realm.objectForPrimaryKey<TrackingData>(
    "TrackingData",
    trackingDataResponse.realmIdString
  )!;
  const timeStampStorage = dataToSync.timestampLastModified!.getTime();
  const timeStampResponse = moment(trackingDataResponse.timestampLastModified)
    .toDate()
    .getTime();
  if (timeStampStorage === timeStampResponse) {
    realm.write(() => {
      dataToSync.needsSync = false;
    });
  }
}

export function syncMealItemData(response: any) {
  const dataToSync = realm.objectForPrimaryKey<MealItem>(
    "MealItem",
    response.realmIdString
  )!;
  realm.write(() => {
    dataToSync.needsImageSync = false;
  });
}

export function getTrackingDataToSync(): TrackingData[] {
  const trackingDataResults = realm
    .objects<TrackingData>("TrackingData")
    .filtered("needsSync == true");
  return trackingDataResults.map(realmObject => {
    let trackingData = mapRealmTrackingDataToTrackingData(realmObject);
    return trackingData;
  });
}

export function getMealItemImageUrisToSync(): string[] {
  const mealItemResults = realm
    .objects<MealItem>("MealItem")
    .filtered("needsImageSync == true");
  return mealItemResults.map(realmObject => realmObject.imagePath!);
}

export function saveTrackingDataArray(trackingData: TrackingData[]) {
  realm.write(() => {
    each(trackingData, trackingData => {
      trackingData.timestampLastModified = new Date();
      if (trackingData.timestampentry === undefined) {
        trackingData.timestampentry = new Date();
      }
      if (trackingData.trackingType === TrackingTypesEnum.foodType) {
        if (trackingData.mealItems[0].imagePathTemp != undefined) {
          let mealItemImagePath = trackingData.mealItems[0].realmIdString;
          trackingData.mealItems[0].imagePath =
            trackingData.mealItems[0].realmIdString;
          saveMealItemImage(
            trackingData.mealItems[0].imagePathTemp!,
            mealItemImagePath
          );
          trackingData.mealItems[0].needsImageSync = true;
        } else {
          trackingData.mealItems[0].needsImageSync = false;
        }
      }
      realm.create(
        "TrackingData",
        mapTrackingDataToRealmTrackingData(trackingData),
        true
      );
    });
  });
}

// Account restoration
export function restoreData(
  accountInfo: AccountInfo,
  trackingData: TrackingData[],
  mealItems: MealItem[]
) {
  let localAccountInfo = getAccountInfo();
  realm.write(() => {
    localAccountInfo.email = accountInfo.email;
    localAccountInfo.emailConfirmed = true;
    localAccountInfo.emailAlreadyInUse = false;
    localAccountInfo.intercomTokenAndroidEmail =
      accountInfo.intercomTokenAndroidEmail;
    localAccountInfo.intercomTokenIosEmail = accountInfo.intercomTokenIosEmail;
    localAccountInfo.userPreferences = accountInfo.userPreferences;
    realm.create(
      "AccountInfo",
      mapAccountInfoToRealmAccountInfo(localAccountInfo),
      true
    );
    each(trackingData, (data: TrackingData) => {
      // Fix for wrong mapping slider 4 value for first android versions
      if (data.trackingType === TrackingTypesEnum.periodType) {
        if (data.value === 99) {
          data.value = 100;
          data.needsSync = true;
        }
      }
      if (data.trackingType === TrackingTypesEnum.foodType) {
        each(data.mealItems, (mealItem: MealItem) => {
          mealItem.deleted = false;
          //TODO: Remove once data model is using foodItems[] instead of string[]
          mealItem.customFoodItems = new Array<string>();
          mealItem.needsImageSync = false;
          // Support old meal items
          if (mealItem.isFavourite === null) {
            mealItem.isFavourite = false;
          }
        });
      }
      //TODO: Remove once we use real medication instead of string
      else if (
        data.trackingType === TrackingTypesEnum.medicationsType ||
        data.trackingType === TrackingTypesEnum.medicationsType2
      ) {
        data.medication = undefined;
        data.medicationUnit = undefined;
      }
      data.deleted = false;
      realm.create(
        "TrackingData",
        mapTrackingDataToRealmTrackingData(data),
        true
      );
    });
    each(mealItems, (mealItem: MealItem) => {
      mealItem.orderingNumber = 0;
      //TODO: Remove once data model is using foodItems[] instead of string[]
      mealItem.customFoodItems = new Array<string>();
      mealItem.needsImageSync = false;
      mealItem.deleted = false;
      if (mealItem.hasImage === true) {
        mealItem.imagePath = mealItem.realmIdString;
      }

      // Support old tracking data point
      if (mealItem.isFavourite === null) {
        mealItem.isFavourite = false;
      }
      realm.create("MealItem", mapMealItemToRealmMealItem(mealItem), true);
    });
  });
}

export function updateLocalObjectItemDB() {
  const foodItemPath =
    RNFetchBlob.fs.dirs.DocumentDir + "/backendCache/v3/foodItem/index";
  RNFetchBlob.fs.readFile(foodItemPath, "utf8").then(data => {
    const foodItemJsonArray: FoodItem[] = JSON.parse(data);
    realm.write(() => {
      each(foodItemJsonArray, foodItemJson => {
        if (isEmpty(foodItemJson.substitutes) === true) {
          foodItemJson.substitutes = { comment: "", foodItemIds: [] };
        }
        realm.create(
          "FoodItem",
          mapFoodItemToFoodItemRealm(foodItemJson),
          true
        );
      });
    });
  });
}
