import { ObjectSchema } from "realm";
import { TrackingType } from "../Tracking/Utils/TrackingUtils";
import FoodItem, {
  mapRealmFoodItemToFoodItem,
  mapFoodItemToFoodItemRealm
} from "./FoodItem";

const uuid = require("react-native-uuid");

export default class TrackingData {
  realmIdString: string = uuid.v1();
  trackingType: TrackingType;
  timestamptracking?: Date = undefined;
  timestampentry?: Date = undefined;
  timestampLastModified?: Date = undefined;
  value?: number = undefined;
  text?: string = undefined;
  tags?: string = undefined;
  mealItems: MealItem[];
  medication?: string = undefined;
  medicationUnit?: string = undefined;
  healthkitCategoriesWritten?: string = undefined;
  tagsArray?: string = undefined;
  didTrack: boolean;
  needsSync: boolean;
  deleted: boolean = false;

  constructor(trackingType: TrackingType) {
    this.trackingType = trackingType;
    this.didTrack = false;
    this.needsSync = true;
    this.mealItems = [];
    this.timestamptracking = new Date();
  }

  static schema: ObjectSchema = {
    name: "TrackingData",
    primaryKey: "realmIdString",
    properties: {
      realmIdString: "string",
      trackingType: "string",
      text: "string?",
      value: "double?",
      mealItems: "MealItem[]",
      medication: "string?",
      medicationUnit: "string?",
      tagsArray: "string?",
      timestamptracking: "date?",
      timestampLastModified: "date?",
      timestampentry: "date?",
      needsSync: "bool?",
      deleted: "bool"
    }
  };
}

export function mapRealmTrackingDataToTrackingData(
  realmObject: any
): TrackingData {
  const trackingData = new TrackingData(realmObject.trackingType);
  trackingData.realmIdString = realmObject.realmIdString;
  trackingData.text = realmObject.text;
  trackingData.value = realmObject.value;
  trackingData.mealItems = (realmObject.mealItems as MealItem[]).map(
    element => {
      return mapRealmMealItemToMealItem(element);
    }
  );
  trackingData.medication = undefined;
  trackingData.medicationUnit = undefined;
  trackingData.tagsArray = undefined;
  trackingData.timestamptracking = realmObject.timestamptracking;
  trackingData.timestampLastModified = realmObject.timestampLastModified;
  trackingData.timestampentry = realmObject.timestampentry;
  trackingData.needsSync = realmObject.needsSync;
  trackingData.deleted = realmObject.deleted;
  return trackingData;
}

export function mapTrackingDataToRealmTrackingData(
  trackingData: TrackingData
): any {
  return {
    ...trackingData,
    mealItems: trackingData.mealItems.map(mealItem =>
      mapMealItemToRealmMealItem(mealItem)
    )
  };
}

export interface TrackingDataResponse {
  description: string;
  realmIdString: string;
  result: string;
  timestampLastModified: string;
}

export class MealItem {
  realmIdString: string = uuid.v1();
  name?: string = undefined;
  orderingNumber?: number = 0;

  foodItems: FoodItem[] = [];
  customFoodItems?: string[] = [];
  isFavourite: boolean = false;
  timestampLastModified?: Date = new Date();
  imagePath?: string;
  needsImageSync: boolean = false;

  deleted: boolean = false;

  // Only for account restoration, do not use for anything else
  hasImage?: boolean = undefined;
  imagePathTemp?: string;

  constructor() {}

  static schema: ObjectSchema = {
    name: "MealItem",
    primaryKey: "realmIdString",
    properties: {
      realmIdString: "string",
      name: "string?",
      orderingNumber: "int?",
      foodItems: "FoodItem[]",
      customFoodItems: "string?[]",
      isFavourite: "bool",
      timestampLastModified: "date?",
      imagePath: "string?",
      needsImageSync: "bool",
      deleted: "bool"
    }
  };
}

export function mapRealmMealItemToMealItem(realmObject: any): MealItem {
  const mealItem = new MealItem();
  mealItem.realmIdString = realmObject.realmIdString;
  mealItem.name = realmObject.name;
  mealItem.orderingNumber = realmObject.orderingNumber;
  mealItem.foodItems = (realmObject.foodItems as FoodItem[]).map(element => {
    return mapRealmFoodItemToFoodItem(element);
  });
  mealItem.customFoodItems = [];
  mealItem.imagePath = realmObject.imagePath;
  mealItem.timestampLastModified = realmObject.timestampLastModified;
  mealItem.needsImageSync = realmObject.needsImageSync;
  mealItem.deleted = realmObject.deleted;
  return mealItem;
}

export function mapMealItemToRealmMealItem(mealItem: MealItem): any {
  let recipeRealm = undefined;
  return {
    ...mealItem,
    foodItems: mealItem.foodItems.map(foodItem =>
      mapFoodItemToFoodItemRealm(foodItem)
    ),
    recipe: recipeRealm
  };
}
