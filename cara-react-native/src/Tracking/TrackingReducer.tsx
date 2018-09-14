import {
  TrackingType,
  mappingForSliderWithFiveTrackingValues,
  mappingForSliderWithFourTrackingValues,
  mappingForSliderWithThreeTrackingValues,
  trackingCategoryTypeFrom,
  trackingStoolMappingSliderIndexToValue,
  TrackingTypesEnum
} from "./Utils/TrackingUtils";
import TrackingData, { MealItem } from "../Models/TrackingData";
import { TrackingAction } from "./TrackingActions";
import { invert, each } from "lodash";

export const getUnsavedTrackingDefaultValue = () => {
  let trackingDataArray: TrackingData[] = [];
  for (let trackingType of TrackingTypesEnum.getEnumValues()) {
    let trackingData: TrackingData = new TrackingData(trackingType);
    if (trackingData.trackingType === TrackingTypesEnum.foodType) {
      trackingData.mealItems.push(new MealItem());
    }
    trackingDataArray.push(trackingData);
  }
  return trackingDataArray;
};

export interface TrackingState {
  unsavedTracking: TrackingData[];
  shouldReloadOverviews: boolean;
  isEditionMode: boolean;
  shouldComputeWeeklySymptomScore: boolean;
}

export const initialTrackingState: TrackingState = {
  unsavedTracking: [],
  shouldReloadOverviews: false,
  isEditionMode: false,
  shouldComputeWeeklySymptomScore: true
};

export enum TrackingActionTypes {
  INIT_TRACKING = "[tracking] INIT_TRACKING",
  UPDATE_TRACKING_DATA_SLIDER = "[tracking] UPDATE_TRACKING_DATA_SLIDER",
  UPDATE_TRACKING_DATA_FREE_TEXT = "[tracking] UPDATE_TRACKING_DATA_FREE_TEXT",
  UPDATE_TRACKING_DATA_FOOD = "[tracking] UPDATE_TRACKING_DATA_FOOD",
  SAVE_TRACKING_DATA = "[tracking] SAVE_TRACKING_DATA",
  SAVE_TRACKING_DATA_SUCCESS = "[tracking] SAVE_TRACKING_DATA_SUCCESS",
  POST_TRACKING_DATA = "[tracking] POST_TRACKING_DATA",
  POST_TRACKING_DATA_SUCCESS = "[tracking] POST_TRACKING_DATA_SUCCESS",
  UPDATE_TRACKING_TIMESTAMP = "[tracking] UPDATE_TRACKING_TIMESTAMP",
  DELETE_TRACKING_DATA = "[tracking] DELETE_TRACKING_DATA",
  OVERVIEWS_RELOADED = "[tracking] OVERVIEWS_RELOADED",
  WEEKLY_SYMPTOM_SCORE_COMPUTED = "[tracking] WEEKLY_SYMPTOM_SCORE_COMPUTED"
}

// Reducer
export function tracking(
  state: TrackingState = initialTrackingState,
  action: TrackingAction
): TrackingState {
  let trackingDataArray: TrackingData[] = [];
  switch (action.type) {
    case TrackingActionTypes.INIT_TRACKING:
      return {
        ...state,
        unsavedTracking: action.trackingDataArray,
        isEditionMode: action.isEditionMode
      };
    case TrackingActionTypes.UPDATE_TRACKING_DATA_SLIDER:
      trackingDataArray = state.unsavedTracking.map(function(
        trackingData: TrackingData
      ) {
        if (trackingData.trackingType === action.trackingType) {
          trackingData.value = sliderValueToNormalizedValue(
            action.value,
            action.sliderRange
          );
          trackingData.didTrack = didTrack(trackingData);
        }
        return trackingData;
      });
      return { ...state, unsavedTracking: trackingDataArray };
    case TrackingActionTypes.UPDATE_TRACKING_DATA_FREE_TEXT:
      trackingDataArray = state.unsavedTracking.map(function(
        trackingData: TrackingData
      ) {
        if (trackingData.trackingType === action.trackingType) {
          trackingData.text = action.text;
          trackingData.didTrack = didTrack(trackingData);
        }
        return trackingData;
      });
      return { ...state, unsavedTracking: trackingDataArray };
    case TrackingActionTypes.UPDATE_TRACKING_DATA_FOOD:
      trackingDataArray = state.unsavedTracking.map(function(
        trackingData: TrackingData
      ) {
        if (trackingData.trackingType === TrackingTypesEnum.foodType) {
          if (action.imagePathTemp == undefined) {
            trackingData.mealItems[0].imagePath = undefined;
          }
          trackingData.mealItems[0].name = action.text;
          trackingData.mealItems[0].imagePathTemp = action.imagePathTemp;
          trackingData.mealItems[0].foodItems = action.foodItems;
          trackingData.didTrack = didTrack(trackingData);
        }
        return trackingData;
      });
      return { ...state, unsavedTracking: trackingDataArray };
    case TrackingActionTypes.SAVE_TRACKING_DATA_SUCCESS:
      return {
        ...state,
        shouldReloadOverviews: true,
        shouldComputeWeeklySymptomScore: true
      };
    case TrackingActionTypes.UPDATE_TRACKING_TIMESTAMP:
      trackingDataArray = state.unsavedTracking.map(trackingData => {
        trackingData.timestamptracking = action.timestamp;
        trackingData.didTrack = didTrack(trackingData);
        return trackingData;
      });
      return { ...state, unsavedTracking: trackingDataArray };
    case TrackingActionTypes.DELETE_TRACKING_DATA:
      trackingDataArray = state.unsavedTracking.map(trackingData => {
        if (trackingData.trackingType === action.trackingType) {
          trackingData.deleted = true;
          trackingData.didTrack = true;
        }
        return trackingData;
      });
      return { ...state, unsavedTracking: trackingDataArray };
    case TrackingActionTypes.OVERVIEWS_RELOADED:
      return { ...state, shouldReloadOverviews: false };
    case TrackingActionTypes.WEEKLY_SYMPTOM_SCORE_COMPUTED:
      return { ...state, shouldComputeWeeklySymptomScore: false };
    default:
      return state;
  }
}

export default tracking;

function sliderValueToNormalizedValue(
  sliderValue: number,
  sliderLength: number
): number | undefined {
  switch (sliderLength) {
    case 3:
      return mappingForSliderWithThreeTrackingValues[sliderValue];
    case 4:
      return mappingForSliderWithFourTrackingValues[sliderValue];
    case 5:
      return mappingForSliderWithFiveTrackingValues[sliderValue];
    case 8:
      return trackingStoolMappingSliderIndexToValue[sliderValue];
  }
}

function didTrack(trackingData: TrackingData): boolean {
  if (trackingData.text !== undefined && trackingData.text !== null) {
    return true;
  } else if (trackingData.value !== undefined && trackingData.value !== null) {
    return true;
  } else if (trackingData.mealItems.length > 0) {
    if (
      (trackingData.mealItems[0].name !== undefined &&
        trackingData.mealItems[0].name !== null) ||
      (trackingData.mealItems[0].imagePathTemp !== undefined &&
        trackingData.mealItems[0].imagePathTemp !== null) ||
      trackingData.mealItems[0].foodItems.length != 0
    ) {
      return true;
    }
  }
  return false;
}

// Selectors

export function getTrackingData(
  trackingType: TrackingType,
  trackingDataArray: TrackingData[]
): TrackingData {
  return trackingDataArray.filter(
    trackingData => trackingData.trackingType == trackingType
  )[0];
}

export function getMealItem(trackingDataArray: TrackingData[]): MealItem {
  const trackingDataFood = getTrackingData(
    TrackingTypesEnum.foodType,
    trackingDataArray
  );
  return trackingDataFood.mealItems[0];
}

export function getSliderValue(
  sliderLength: number,
  normalizedValue?: number
): number | undefined {
  if (normalizedValue !== undefined) {
    switch (sliderLength) {
      case 3:
        return +invert(mappingForSliderWithThreeTrackingValues)[
          normalizedValue.toString()
        ];
      case 4:
        if (normalizedValue === 99) {
          normalizedValue = 100;
        }
        return +invert(mappingForSliderWithFourTrackingValues)[
          normalizedValue.toString()
        ];
      case 5:
        return +invert(mappingForSliderWithFiveTrackingValues)[
          normalizedValue.toString()
        ];
      case 8:
        return +invert(trackingStoolMappingSliderIndexToValue)[
          normalizedValue.toString()
        ];
    }
    return undefined;
  }
}

export function getDidTrackForCategoryDict(
  trackingDataArray: TrackingData[]
): { [key: string]: boolean } {
  let getDidTrackForCategoryDict: { [key: string]: boolean } = {};
  each(trackingDataArray, function(trackingData) {
    const trackingCategory = trackingCategoryTypeFrom(
      trackingData.trackingType
    );
    if (getDidTrackForCategoryDict[trackingCategory] !== undefined) {
      getDidTrackForCategoryDict[trackingCategory] =
        getDidTrackForCategoryDict[trackingCategory] || trackingData.didTrack;
    } else {
      getDidTrackForCategoryDict[trackingCategory] = trackingData.didTrack;
    }
  });
  return getDidTrackForCategoryDict;
}

export function getNormalizedValue(
  trackingType: TrackingType,
  trackingDataArray: TrackingData[]
) {
  return trackingDataArray.filter(
    trackingData => trackingData.trackingType === trackingType
  )[0].value;
}

export function getTimestampTracking(
  trackingDataArray: TrackingData[]
): Date | undefined {
  if (trackingDataArray.length > 0) {
    return trackingDataArray[0].timestamptracking;
  }
  return undefined;
}
