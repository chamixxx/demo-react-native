import Realm from "realm";
import AccountInfo, { UserPreferences } from "../Models/AccountInfo";
import TrackingData, { MealItem } from "../Models/TrackingData";
import { TrackingTypesEnum } from "../Tracking/Utils/TrackingUtils";
import FoodItem from "../Models/FoodItem";

const realm = new Realm({
  schema: [
    AccountInfo.schema,
    TrackingData.schema,
    MealItem.schema,
    FoodItem.schema
  ],
  schemaVersion: 15,
  migration: function(oldRealm, newRealm) {
    if (oldRealm.schemaVersion < 8) {
      newRealm.deleteAll();
    }
    if (oldRealm.schemaVersion < 10) {
      const newTrackingData = newRealm.objects<TrackingData>("TrackingData");
      for (let i = 0; i < newTrackingData.length; i++) {
        if (newTrackingData[i].trackingType === TrackingTypesEnum.foodType) {
          newTrackingData[i].mealItems[0].orderingNumber = 0;
          newTrackingData[i].needsSync = true;
        }
      }
    }
    if (oldRealm.schemaVersion < 11) {
      const newMealItems = newRealm.objects<MealItem>("MealItem");
      for (let i = 0; i < newMealItems.length; i++) {
        newMealItems[i].foodItems = [];
      }
    }
    if (oldRealm.schemaVersion < 13) {
      const newAccountInfo = newRealm.objects("AccountInfo")[0] as any;
      const userPreferences: UserPreferences = { favouriteRecipesId: [] };
      newAccountInfo.userPreferences = JSON.stringify(userPreferences);
    }
    if (oldRealm.schemaVersion < 14) {
      const newTrackingData = newRealm.objects<TrackingData>("TrackingData");
      for (let i = 0; i < newTrackingData.length; i++) {
        if (newTrackingData[i].trackingType === TrackingTypesEnum.foodType) {
          if (newTrackingData[i].mealItems[0].orderingNumber !== 0) {
            newTrackingData[i].mealItems[0].orderingNumber = 0;
            newTrackingData[i].needsSync = true;
          }
        }
      }
    }
    if (oldRealm.schemaVersion < 15) {
      // Fix for wrong mapping slider 4 value for first android versions
      const newTrackingData = newRealm.objects<TrackingData>("TrackingData");
      for (let i = 0; i < newTrackingData.length; i++) {
        if (newTrackingData[i].trackingType === TrackingTypesEnum.periodType) {
          if (newTrackingData[i].value === 99) {
            newTrackingData[i].value = 100;
            newTrackingData[i].needsSync = true;
          }
        }
      }
    }
  }
});
console.log(realm.path);

export default realm;
