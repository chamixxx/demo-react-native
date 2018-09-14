import FoodItemSuperClass from "./FoodItemSuperClass";
import { ObjectSchema } from "realm";
import _ from "lodash";
import DeviceInfo from "react-native-device-info";
import { highPriorityFoodItemIds } from "../Utils/Constants";

export default class FoodItem extends FoodItemSuperClass {
  [key: string]: any;
  foodItemDescription?: string;
  category?: string;
  rating?: number;

  R1_gluten?: boolean;
  R2_lactose?: boolean;
  R2_lactose_allowed_quantity?: string;
  R2_lactose_comment?: string;
  R3_lactose_carbs?: boolean;
  R4_fructose?: boolean;
  R5_onions?: boolean;
  R6_cabbage?: boolean;
  R7_stonefruit?: boolean;
  R8_pomes?: boolean;
  R9_pulses?: boolean;
  R10_polyols?: boolean;
  R11_caffeine?: boolean;
  R12_alcohol?: boolean;
  R13_softdrinks?: boolean;
  R14_chewinggum?: boolean;
  R15_driedfruit?: boolean;

  adjustment?: number;

  Adjustment_comment?: string;

  synonyms?: string;
  synonyms_en?: string;

  substitutes?: Substitutes;

  deleted?: boolean;

  // Search caches to speed up searching and sorting
  matchingSynonymCache: any = {};
  matchingPriorityCache: any = {};

  static schema: ObjectSchema = {
    name: "FoodItem",
    primaryKey: "id",
    properties: {
      id: "int",
      name: "string",
      name_en: "string",
      imageUrl: "string",
      foodItemDescription: "string?",
      category: "string",
      rating: "double?",
      R1_gluten: "bool?",
      R2_lactose: "bool?",
      R2_lactose_allowed_quantity: "string?",
      R2_lactose_comment: "string?",
      R3_lactose_carbs: "bool?",
      R4_fructose: "bool?",
      R5_onions: "bool?",
      R6_cabbage: "bool?",
      R7_stonefruit: "bool?",
      R8_pomes: "bool?",
      R9_pulses: "bool?",
      R10_polyols: "bool?",
      R11_caffeine: "bool?",
      R12_alcohol: "bool?",
      R13_softdrinks: "bool?",
      R14_chewinggum: "bool?",
      R15_driedfruit: "bool?",
      adjustment: "double?",
      Adjustment_comment: "string?",
      synonyms: "string?",
      synonyms_en: "string?",
      substitutes: "string?",
      deleted: "bool"
    }
  };

  isFoodItemCustom = (): boolean => {
    return false;
  };

  getSynonymsArray = (): string[] => {
    const languageCode = DeviceInfo.getDeviceLocale().substr(0, 2);
    if (languageCode == "de") {
      if (this.synonyms == undefined) {
        return [];
      }
      return this.synonyms!.split(", ");
    } else {
      if (this.synonyms_en == undefined) {
        return [];
      }
      return this.synonyms_en!.split(", ");
    }
  };

  matchingSynonym = (searchString: string): string | undefined => {
    if (this.deleted == true) {
      return undefined;
    }

    if (this.matchingSynonymCache[searchString] != undefined) {
      return this.matchingSynonymCache[searchString];
    } else {
      const ret = this.matchingSynonymCompute(searchString);
      this.matchingSynonymCache[searchString] = ret;
      return ret;
    }
  };

  matchingSynonymCompute = (searchString: string): string | undefined => {
    let localName = this.getLocalName();
    if (localName.toUpperCase().includes(searchString.toUpperCase())) {
      return localName;
    } else {
      const matching = _.filter(this.getSynonymsArray(), synonym => {
        return synonym.toUpperCase().includes(searchString.toUpperCase());
      });

      if (matching.length > 0) {
        return matching[0];
      } else {
        return undefined;
      }
      return undefined;
    }
  };

  matchingPriority = (searchString: string): number | undefined => {
    if (this.matchingPriorityCache[searchString] != undefined) {
      return this.matchingPriorityCache[searchString];
    } else {
      let ret = this.matchingPriorityCompute(searchString);
      this.matchingPriorityCache[searchString] = ret;
      return ret;
    }
  };

  matchingPriorityCompute(searchString: string): number | undefined {
    let matchingSyn = this.matchingSynonym(searchString);
    if (matchingSyn == undefined) {
      return undefined;
    }
    let localName = this.getLocalName();
    let localNameSplit: string[] = localName.split(" ");
    //@ts-ignore
    let isHighPriority = highPriorityFoodItemIds.includes(this.id!);

    let initialNameMatch = localName.startsWith(searchString);
    let initialWordInNameMatch =
      localNameSplit.filter((nameItem: string) => {
        return nameItem.toUpperCase().includes(searchString.toUpperCase());
      }).length > 0;

    let initialSynonymMatch = matchingSyn!.startsWith(searchString);
    var priority = 15;
    if (initialNameMatch) {
      priority = 10;
    } else if (initialWordInNameMatch) {
      priority = 11;
    } else if (initialSynonymMatch) {
      priority = 12;
    }
    if (isHighPriority) {
      priority -= 5;
    }
    return priority;
  }
}

export function mapRealmFoodItemToFoodItem(realmObject: any): FoodItem {
  const foodItem = new FoodItem();

  foodItem.id = realmObject.id;
  foodItem.name = realmObject.name;
  foodItem.name_en = realmObject.name_en;
  foodItem.imageUrl = realmObject.imageUrl;
  foodItem.foodItemDescription = realmObject.foodItemDescription;
  foodItem.category = realmObject.category;
  foodItem.rating = realmObject.rating;
  foodItem.R1_gluten = realmObject.R1_gluten;
  foodItem.R2_lactose = realmObject.R2_lactose;
  foodItem.R2_lactose_allowed_quantity =
    realmObject.R2_lactose_allowed_quantity;
  foodItem.R2_lactose_comment = realmObject.R2_lactose_comment;
  foodItem.R3_lactose_carbs = realmObject.R3_lactose_carbs;
  foodItem.R4_fructose = realmObject.R4_fructose;
  foodItem.R5_onions = realmObject.R5_onions;
  foodItem.R6_cabbage = realmObject.R6_cabbage;
  foodItem.R7_stonefruit = realmObject.R7_stonefruit;
  foodItem.R8_pomes = realmObject.R8_pomes;
  foodItem.R9_pulses = realmObject.R9_pulses;
  foodItem.R10_polyols = realmObject.R10_polyols;
  foodItem.R11_caffeine = realmObject.R11_caffeine;
  foodItem.R12_alcohol = realmObject.R12_alcohol;
  foodItem.R13_softdrinks = realmObject.R13_softdrinks;
  foodItem.R14_chewinggum = realmObject.R14_chewinggum;
  foodItem.R15_driedfruit = realmObject.R15_driedfruit;
  foodItem.adjustment = realmObject.adjustment;
  foodItem.Adjustment_comment = realmObject.Adjustment_comment;
  foodItem.synonyms = realmObject.synonyms;
  foodItem.synonyms_en = realmObject.synonyms_en;
  foodItem.substitutes = JSON.parse(realmObject.substitutes);
  foodItem.deleted = realmObject.deleted;

  return foodItem;
}

export function mapFoodItemToFoodItemRealm(foodItem: any): any {
  return {
    ...foodItem,
    substitutes: JSON.stringify(foodItem.substitutes)
  };
}

export interface Substitutes {
  comment: string;
  foodItemIds: number[];
}
