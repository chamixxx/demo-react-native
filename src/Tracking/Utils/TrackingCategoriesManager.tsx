import {
  TrackingCategoryTypesEnum,
  TrackingCategoryType,
  TrackingType,
  trackingTypesFrom
} from "./TrackingUtils";
import {
  GraphTypeEnum,
  graphTypeFromTrackingType
} from "../../Overviews/OverviewsUtils";
import { OverviewsEnum } from "../../Overviews/TrackingOverviews";

export interface TrackingCategoryElement {
  categoryType: TrackingCategoryType;
  isActive: boolean;
  indexPosition: number;
  iconInactive: any;
  iconActive: any;
}

export let trackingCategoryElementListFull: TrackingCategoryElement[] = [
  {
    categoryType: TrackingCategoryTypesEnum.foodCategoryType,
    isActive: true,
    indexPosition: 0,
    iconInactive: require("../Images/TrackingIconsCircledInactive/iCNTrackingFood.png"),
    iconActive: require("../Images/TrackingIconsCircledActive/iCNTrackingFoodActive.png")
  },
  {
    categoryType: TrackingCategoryTypesEnum.waterCategoryType,
    isActive: true,
    indexPosition: 1,
    iconInactive: require("../Images/TrackingIconsCircledInactive/iCNTrackingWater.png"),
    iconActive: require("../Images/TrackingIconsCircledActive/iCNTrackingWaterActive.png")
  },
  {
    categoryType: TrackingCategoryTypesEnum.stoolCategoryType,
    isActive: true,
    indexPosition: 2,
    iconInactive: require("../Images/TrackingIconsCircledInactive/iCNTrackingPoop.png"),
    iconActive: require("../Images/TrackingIconsCircledActive/iCNTrackingPoopActive.png")
  },
  {
    categoryType: TrackingCategoryTypesEnum.digestionCategoryType,
    isActive: true,
    indexPosition: 3,
    iconInactive: require("../Images/TrackingIconsCircledInactive/iCNTrackingDigestive.png"),
    iconActive: require("../Images/TrackingIconsCircledActive/iCNTrackingDigestiveActive.png")
  },
  {
    categoryType: TrackingCategoryTypesEnum.mentalCategoryType,
    isActive: true,
    indexPosition: 4,
    iconInactive: require("../Images/TrackingIconsCircledInactive/iCNTrackingMental.png"),
    iconActive: require("../Images/TrackingIconsCircledActive/iCNTrackingMentalActive.png")
  },
  // {
  //   categoryType: TrackingCategoryTypesEnum.medicationsCategoryType,
  //   isActive: true,
  //   indexPosition: 5,
  //   iconInactive: require("../Images/TrackingIconsCircledInactive/iCNTrackingMeds.png"),
  //   iconActive: require("../Images/TrackingIconsCircledActive/iCNTrackingMedsActive.png")
  // },
  {
    categoryType: TrackingCategoryTypesEnum.periodCategoryType,
    isActive: true,
    indexPosition: 6,
    iconInactive: require("../Images/TrackingIconsCircledInactive/iCNTrackingPeriod.png"),
    iconActive: require("../Images/TrackingIconsCircledActive/iCNTrackingPeriodActive.png")
  },
  // {
  //   categoryType: TrackingCategoryTypesEnum.skinCategoryType,
  //   isActive: true,
  //   indexPosition: 7,
  //   iconInactive: require("../Images/TrackingIconsCircledInactive/iCNTrackingSkin.png"),
  //   iconActive: require("../Images/TrackingIconsCircledActive/ICNTrackingSkinActive.png")
  // },
  {
    categoryType: TrackingCategoryTypesEnum.workoutCategoryType,
    isActive: true,
    indexPosition: 8,
    iconInactive: require("../Images/TrackingIconsCircledInactive/iCNTrackingWorkout.png"),
    iconActive: require("../Images/TrackingIconsCircledActive/iCNTrackingWorkoutActive.png")
  },
  {
    categoryType: TrackingCategoryTypesEnum.sleepCategoryType,
    isActive: true,
    indexPosition: 9,
    iconInactive: require("../Images/TrackingIconsCircledInactive/iCNTrackingSleep.png"),
    iconActive: require("../Images/TrackingIconsCircledActive/iCNTrackingSleepActive.png")
  },
  {
    categoryType: TrackingCategoryTypesEnum.painCategoryType,
    isActive: true,
    indexPosition: 10,
    iconInactive: require("../Images/TrackingIconsCircledInactive/iCNTrackingPain.png"),
    iconActive: require("../Images/TrackingIconsCircledActive/iCNTrackingPainActive.png")
  },
  {
    categoryType: TrackingCategoryTypesEnum.notesCategoryType,
    isActive: true,
    indexPosition: 11,
    iconInactive: require("../Images/TrackingIconsCircledInactive/iCNTrackingNotes.png"),
    iconActive: require("../Images/TrackingIconsCircledActive/iCNTrackingNotesActive.png")
  },
  {
    categoryType: TrackingCategoryTypesEnum.additionalSymptomCategoryType,
    isActive: true,
    indexPosition: 12,
    iconInactive: require("../Images/TrackingIconsCircledInactive/iCNTrackingAdditionalSymptoms.png"),
    iconActive: require("../Images/TrackingIconsCircledActive/iCNTrackingAdditionalSymptomsActive.png")
  }
];

const categoriesNonSupportedInMonthly: TrackingCategoryType[] = [
  TrackingCategoryTypesEnum.foodCategoryType,
  TrackingCategoryTypesEnum.skinCategoryType,
  TrackingCategoryTypesEnum.notesCategoryType,
  TrackingCategoryTypesEnum.medicationsCategoryType,
  TrackingCategoryTypesEnum.additionalSymptomCategoryType
];

export function trackingTypesActiveOrdered(
  overviewType: OverviewsEnum
): TrackingType[] {
  let activeTrackingTypes: TrackingType[] = [];
  trackingCategoryElementListFull.forEach(categoryElement => {
    //TODO: check contains monthly
    //   if (!weekly && categoriesNonSupportedInMonthly.contains(TrackingUtils.TrackingCategoryTypes(rawValue: categoryElement.categoryType!)!)) {
    //     continue
    // }
    if (categoryElement.isActive) {
      let trackingTypes = trackingTypesFrom(categoryElement.categoryType);
      trackingTypes.forEach(trackingType => {
        if (
          graphTypeFromTrackingType(trackingType) == GraphTypeEnum.simpleBar ||
          graphTypeFromTrackingType(trackingType) == GraphTypeEnum.doubleLine ||
          graphTypeFromTrackingType(trackingType) ==
            GraphTypeEnum.combinedLineBar ||
          graphTypeFromTrackingType(trackingType) == GraphTypeEnum.simpleLine
        ) {
          activeTrackingTypes.push(trackingType);
        }
      });

      //TODO: check special categories
      // trackingType in trackingTypes {
      //     if !(trackingType == TrackingUtils.TrackingTypes.medicationsType) {
      //         if trackingType == TrackingUtils.TrackingTypes.stoolType {
      //             icons.append(self.iconActiveFrom(trackingType: trackingType))
      //             icons.append(self.iconActiveFrom(permission: HealthKitManager.ExtraType.bowelMovements))
      //         }
      //         else {
      //             icons.append(self.iconActiveFrom(trackingType: trackingType))
      //         }
      //     }
      // }
    }
  });

  //TODO: HealthKit
  // for permission in HealthKitManager.ExtraType.values {
  //     icons.append(self.iconActiveFrom(permission: permission))
  // }
  return activeTrackingTypes;
}
