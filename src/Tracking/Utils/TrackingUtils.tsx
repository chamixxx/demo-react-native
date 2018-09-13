import { IntlMessageContent } from "./TrackingStaticData";

// Tracking types
// Namespace is used to add customs functionalities

export enum TrackingTypesEnum {
  additionalSymptomsType = "additionalSymptoms",
  bloatingType = "bloating",
  foodType = "food",
  headacheType = "headache",
  medicationsType = "medications",
  medicationsType2 = "medications2",
  moodType = "mood",
  notesType = "notes",
  otherPainType = "otherPain",
  tummyPainType = "pain",
  periodType = "periodCycle",
  skinType = "skin",
  sleepType = "sleep",
  stoolType = "stool",
  stressType = "stress",
  waterType = "water",
  workoutType = "workout"
}

export type TrackingType =
  | TrackingTypesEnum.additionalSymptomsType
  | TrackingTypesEnum.bloatingType
  | TrackingTypesEnum.foodType
  | TrackingTypesEnum.headacheType
  | TrackingTypesEnum.medicationsType
  | TrackingTypesEnum.medicationsType2
  | TrackingTypesEnum.moodType
  | TrackingTypesEnum.notesType
  | TrackingTypesEnum.otherPainType
  | TrackingTypesEnum.periodType
  | TrackingTypesEnum.skinType
  | TrackingTypesEnum.sleepType
  | TrackingTypesEnum.stoolType
  | TrackingTypesEnum.stressType
  | TrackingTypesEnum.tummyPainType
  | TrackingTypesEnum.waterType
  | TrackingTypesEnum.workoutType;

export namespace TrackingTypesEnum {
  export function getEnumValues(): TrackingType[] {
    return [
      TrackingTypesEnum.additionalSymptomsType,
      TrackingTypesEnum.bloatingType,
      TrackingTypesEnum.foodType,
      TrackingTypesEnum.headacheType,
      TrackingTypesEnum.medicationsType,
      TrackingTypesEnum.medicationsType2,
      TrackingTypesEnum.moodType,
      TrackingTypesEnum.notesType,
      TrackingTypesEnum.otherPainType,
      TrackingTypesEnum.tummyPainType,
      TrackingTypesEnum.periodType,
      TrackingTypesEnum.skinType,
      TrackingTypesEnum.sleepType,
      TrackingTypesEnum.stoolType,
      TrackingTypesEnum.stressType,
      TrackingTypesEnum.waterType,
      TrackingTypesEnum.workoutType
    ];
  }
}

// Tracking Category

export enum TrackingCategoryTypesEnum {
  additionalSymptomCategoryType = "additionalSymptomsCategory",
  digestionCategoryType = "digestionCategory",
  foodCategoryType = "foodCategory",
  medicationsCategoryType = "medicationsCategory",
  mentalCategoryType = "mentalCategory",
  notesCategoryType = "notesCategory",
  painCategoryType = "painCategory",
  periodCategoryType = "periodCategory",
  skinCategoryType = "skinCategory",
  sleepCategoryType = "sleepCategory",
  stoolCategoryType = "stoolCategory",
  waterCategoryType = "waterCategory",
  workoutCategoryType = "workoutCategory"
}

export type TrackingCategoryType =
  | TrackingCategoryTypesEnum.additionalSymptomCategoryType
  | TrackingCategoryTypesEnum.digestionCategoryType
  | TrackingCategoryTypesEnum.foodCategoryType
  | TrackingCategoryTypesEnum.medicationsCategoryType
  | TrackingCategoryTypesEnum.mentalCategoryType
  | TrackingCategoryTypesEnum.notesCategoryType
  | TrackingCategoryTypesEnum.painCategoryType
  | TrackingCategoryTypesEnum.periodCategoryType
  | TrackingCategoryTypesEnum.skinCategoryType
  | TrackingCategoryTypesEnum.sleepCategoryType
  | TrackingCategoryTypesEnum.stoolCategoryType
  | TrackingCategoryTypesEnum.waterCategoryType
  | TrackingCategoryTypesEnum.workoutCategoryType;

export namespace TrackingCategoryTypesEnum {
  export function getEnumValues(): TrackingCategoryType[] {
    return [
      TrackingCategoryTypesEnum.additionalSymptomCategoryType,
      TrackingCategoryTypesEnum.digestionCategoryType,
      TrackingCategoryTypesEnum.foodCategoryType,
      TrackingCategoryTypesEnum.medicationsCategoryType,
      TrackingCategoryTypesEnum.mentalCategoryType,
      TrackingCategoryTypesEnum.notesCategoryType,
      TrackingCategoryTypesEnum.painCategoryType,
      TrackingCategoryTypesEnum.periodCategoryType,
      TrackingCategoryTypesEnum.skinCategoryType,
      TrackingCategoryTypesEnum.sleepCategoryType,
      TrackingCategoryTypesEnum.stoolCategoryType,
      TrackingCategoryTypesEnum.waterCategoryType,
      TrackingCategoryTypesEnum.workoutCategoryType
    ];
  }
}

// Utils functions

export function labelFromTrackingCategoryType(
  trackingCategoryType: TrackingCategoryType
): IntlMessageContent {
  switch (trackingCategoryType) {
    case TrackingCategoryTypesEnum.additionalSymptomCategoryType:
      return {
        id: "_common.additionalSymptoms",
        defaultMessage: "Additional symptoms"
      };
    case TrackingCategoryTypesEnum.digestionCategoryType:
      return {
        id: "_common.digestion",
        defaultMessage: "Digestion"
      };
    case TrackingCategoryTypesEnum.foodCategoryType:
      return {
        id: "_common.food",
        defaultMessage: "Food"
      };
    case TrackingCategoryTypesEnum.medicationsCategoryType:
      return {
        id: "_common.medications",
        defaultMessage: "Medications"
      };
    case TrackingCategoryTypesEnum.mentalCategoryType:
      return {
        id: "_common.mental",
        defaultMessage: "Mental"
      };
    case TrackingCategoryTypesEnum.notesCategoryType:
      return {
        id: "_common.notes",
        defaultMessage: "Notes"
      };
    case TrackingCategoryTypesEnum.painCategoryType:
      return {
        id: "_common.pain",
        defaultMessage: "Pain"
      };
    case TrackingCategoryTypesEnum.periodCategoryType:
      return {
        id: "_common.period",
        defaultMessage: "Period"
      };
    case TrackingCategoryTypesEnum.skinCategoryType:
      return {
        id: "_common.skin",
        defaultMessage: "Skin"
      };
    case TrackingCategoryTypesEnum.sleepCategoryType:
      return {
        id: "_common.sleep",
        defaultMessage: "Sleep"
      };
    case TrackingCategoryTypesEnum.stoolCategoryType:
      return {
        id: "_common.stool",
        defaultMessage: "Stool"
      };
    case TrackingCategoryTypesEnum.waterCategoryType:
      return {
        id: "_common.water",
        defaultMessage: "Water"
      };
    case TrackingCategoryTypesEnum.workoutCategoryType:
      return {
        id: "_common.workout",
        defaultMessage: "Workout"
      };
  }
}

export function labelFromTrackingType(
  trackingType: TrackingType
): IntlMessageContent {
  switch (trackingType) {
    case TrackingTypesEnum.additionalSymptomsType:
      return {
        id: "_common.additionalSymptoms",
        defaultMessage: "Additional symptoms"
      };
    case TrackingTypesEnum.bloatingType:
      return { id: "_common.bloating", defaultMessage: "Bloating" };
    case TrackingTypesEnum.foodType:
      return { id: "_common.food", defaultMessage: "Food" };
    case TrackingTypesEnum.headacheType:
      return { id: "_common.headache", defaultMessage: "Headache" };
    case TrackingTypesEnum.medicationsType:
      return { id: "_common.medications", defaultMessage: "Medications" };
    case TrackingTypesEnum.medicationsType2:
      return { id: "_common.medications", defaultMessage: "Medications" };
    case TrackingTypesEnum.moodType:
      return { id: "_common.mood", defaultMessage: "Mood" };
    case TrackingTypesEnum.notesType:
      return { id: "_common.notes", defaultMessage: "Notes" };
    case TrackingTypesEnum.otherPainType:
      return { id: "_common.otherPain", defaultMessage: "Other pain" };
    case TrackingTypesEnum.periodType:
      return { id: "_common.period", defaultMessage: "Period" };
    case TrackingTypesEnum.skinType:
      return { id: "_common.skin", defaultMessage: "Skin" };
    case TrackingTypesEnum.sleepType:
      return { id: "_common.sleep", defaultMessage: "Sleep" };
    case TrackingTypesEnum.stoolType:
      return { id: "_common.stool", defaultMessage: "Stool" };
    case TrackingTypesEnum.stressType:
      return { id: "_common.stress", defaultMessage: "Stress" };
    case TrackingTypesEnum.tummyPainType:
      return { id: "_common.tummyPain", defaultMessage: "Tummy pain" };
    case TrackingTypesEnum.waterType:
      return { id: "_common.water", defaultMessage: "Water" };
    case TrackingTypesEnum.workoutType:
      return { id: "_common.workout", defaultMessage: "Workout" };
  }
}

export function trackingTypesFrom(
  trackingCategoryType: TrackingCategoryType
): TrackingType[] {
  switch (trackingCategoryType) {
    case TrackingCategoryTypesEnum.additionalSymptomCategoryType:
      return [TrackingTypesEnum.additionalSymptomsType];
    case TrackingCategoryTypesEnum.digestionCategoryType:
      return [TrackingTypesEnum.tummyPainType, TrackingTypesEnum.bloatingType];
    case TrackingCategoryTypesEnum.foodCategoryType:
      return [TrackingTypesEnum.foodType];
    case TrackingCategoryTypesEnum.medicationsCategoryType:
      return [
        TrackingTypesEnum.medicationsType,
        TrackingTypesEnum.medicationsType2
      ];
    case TrackingCategoryTypesEnum.mentalCategoryType:
      return [TrackingTypesEnum.moodType, TrackingTypesEnum.stressType];
    case TrackingCategoryTypesEnum.notesCategoryType:
      return [TrackingTypesEnum.notesType];
    case TrackingCategoryTypesEnum.painCategoryType:
      return [TrackingTypesEnum.headacheType, TrackingTypesEnum.otherPainType];
    case TrackingCategoryTypesEnum.periodCategoryType:
      return [TrackingTypesEnum.periodType];
    case TrackingCategoryTypesEnum.skinCategoryType:
      return [TrackingTypesEnum.skinType];
    case TrackingCategoryTypesEnum.sleepCategoryType:
      return [TrackingTypesEnum.sleepType];
    case TrackingCategoryTypesEnum.stoolCategoryType:
      return [TrackingTypesEnum.stoolType];
    case TrackingCategoryTypesEnum.waterCategoryType:
      return [TrackingTypesEnum.waterType];
    case TrackingCategoryTypesEnum.workoutCategoryType:
      return [TrackingTypesEnum.workoutType];
  }
}

export function trackingCategoryTypeFrom(
  trackingType: TrackingType
): TrackingCategoryType {
  switch (trackingType) {
    case TrackingTypesEnum.additionalSymptomsType:
      return TrackingCategoryTypesEnum.additionalSymptomCategoryType;
    case TrackingTypesEnum.bloatingType:
      return TrackingCategoryTypesEnum.digestionCategoryType;
    case TrackingTypesEnum.foodType:
      return TrackingCategoryTypesEnum.foodCategoryType;
    case TrackingTypesEnum.headacheType:
      return TrackingCategoryTypesEnum.painCategoryType;
    case TrackingTypesEnum.medicationsType:
      return TrackingCategoryTypesEnum.medicationsCategoryType;
    case TrackingTypesEnum.medicationsType2:
      return TrackingCategoryTypesEnum.medicationsCategoryType;
    case TrackingTypesEnum.moodType:
      return TrackingCategoryTypesEnum.mentalCategoryType;
    case TrackingTypesEnum.notesType:
      return TrackingCategoryTypesEnum.notesCategoryType;
    case TrackingTypesEnum.otherPainType:
      return TrackingCategoryTypesEnum.painCategoryType;
    case TrackingTypesEnum.periodType:
      return TrackingCategoryTypesEnum.periodCategoryType;
    case TrackingTypesEnum.skinType:
      return TrackingCategoryTypesEnum.skinCategoryType;
    case TrackingTypesEnum.sleepType:
      return TrackingCategoryTypesEnum.sleepCategoryType;
    case TrackingTypesEnum.stoolType:
      return TrackingCategoryTypesEnum.stoolCategoryType;
    case TrackingTypesEnum.stressType:
      return TrackingCategoryTypesEnum.mentalCategoryType;
    case TrackingTypesEnum.tummyPainType:
      return TrackingCategoryTypesEnum.digestionCategoryType;
    case TrackingTypesEnum.waterType:
      return TrackingCategoryTypesEnum.waterCategoryType;
    case TrackingTypesEnum.workoutType:
      return TrackingCategoryTypesEnum.workoutCategoryType;
  }
}

export const mappingForSliderWithThreeTrackingValues: {
  [key: number]: number;
} = {
  1: 0,
  2: 50,
  3: 100
};

export const mappingForSliderWithFourTrackingValues: {
  [key: number]: number;
} = {
  1: 0,
  2: 33,
  3: 66,
  4: 100
};

export const mappingForSliderWithFiveTrackingValues: {
  [key: number]: number;
} = {
  1: 0,
  2: 25,
  3: 50,
  4: 75,
  5: 100
};

export const trackingStoolMappingSliderIndexToValue: {
  [key: number]: number;
} = {
  1: 0,
  2: 14,
  3: 28,
  4: 42,
  5: 57,
  6: 71,
  7: 85,
  8: 100
};

export function trackingIconFrom(
  trackingType: TrackingType,
  sliderValue?: number
) {
  switch (trackingType) {
    case TrackingTypesEnum.additionalSymptomsType:
      return require("../../Images/TrackingTypeIcons/iCNAdditionalSymptoms.png");
    case TrackingTypesEnum.bloatingType:
      return require("../../Images/TrackingTypeIcons/iCNBloating.png");
    case TrackingTypesEnum.foodType:
      return require("../../Images/TrackingTypeIcons/iCNFood.png");
    case TrackingTypesEnum.headacheType:
      return require("../../Images/TrackingTypeIcons/iCNHeadache.png");
    case TrackingTypesEnum.medicationsType:
      return require("../../Images/TrackingTypeIcons/iCNMedication.png");
    case TrackingTypesEnum.medicationsType2:
      return require("../../Images/TrackingTypeIcons/iCNMedication.png");
    case TrackingTypesEnum.moodType:
      switch (sliderValue) {
        case 1:
          return require("../../Images/TrackingTypeIcons/iCNMoodVeryGood.png");
        case 2:
          return require("../../Images/TrackingTypeIcons/iCNMoodGood.png");
        case 3:
          return require("../../Images/TrackingTypeIcons/iCNMoodOkay.png");
        case 4:
          return require("../../Images/TrackingTypeIcons/iCNMoodNotGood.png");
        case 5:
          return require("../../Images/TrackingTypeIcons/iCNMoodAwful.png");
        default:
          return require("../../Images/TrackingTypeIcons/iCNMoodEmpty.png");
      }
    case TrackingTypesEnum.notesType:
      return require("../../Images/TrackingTypeIcons/iCNNotes.png");
    case TrackingTypesEnum.otherPainType:
      return require("../../Images/TrackingTypeIcons/iCNOtherPain.png");
    case TrackingTypesEnum.periodType:
      return require("../../Images/TrackingTypeIcons/iCNPeriod.png");
    case TrackingTypesEnum.skinType:
      return require("../../Images/TrackingTypeIcons/iCNSkin.png");
    case TrackingTypesEnum.sleepType:
      return require("../../Images/TrackingTypeIcons/iCNSleep.png");
    case TrackingTypesEnum.stoolType:
      switch (sliderValue) {
        case 1:
          return require("../Images/StoolIcons/poop1.png");
        case 2:
          return require("../Images/StoolIcons/poop2.png");
        case 3:
          return require("../Images/StoolIcons/poop3.png");
        case 4:
          return require("../Images/StoolIcons/poop4.png");
        case 5:
          return require("../Images/StoolIcons/poop5.png");
        case 6:
          return require("../Images/StoolIcons/poop6.png");
        case 7:
          return require("../Images/StoolIcons/poop7.png");
        case 8:
          return require("../Images/StoolIcons/poop8.png");
        default:
          return require("../Images/StoolIcons/poop0.png");
      }
    case TrackingTypesEnum.stressType:
      return require("../../Images/TrackingTypeIcons/iCNStress.png");
    case TrackingTypesEnum.tummyPainType:
      return require("../../Images/TrackingTypeIcons/iCNTummypain.png");
    case TrackingTypesEnum.waterType:
      return require("../../Images/TrackingTypeIcons/iCNWater.png");
    case TrackingTypesEnum.workoutType:
      return require("../../Images/TrackingTypeIcons/iCNWorkout.png");
  }
}

export function getChangeOverTimeForDate(date: Date): Date {
  let changeOverToday = date.setHours(4, 0, 0, 0);
  if (date.getTime() - changeOverToday < 0) {
    return new Date(changeOverToday - 24 * 3600.0);
  }
  return new Date(changeOverToday);
}
