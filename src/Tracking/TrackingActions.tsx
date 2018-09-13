import { TrackingActionTypes } from "./TrackingReducer";
import TrackingData from "../Models/TrackingData";
import { TrackingType } from "./Utils/TrackingUtils";
import FoodItem from "../Models/FoodItem";

// Action Creators
export function initTrackingActionCreator(
  trackingDataArray: TrackingData[],
  isEditionMode: boolean
): InitTrackingAction {
  return {
    type: TrackingActionTypes.INIT_TRACKING,
    isEditionMode: isEditionMode,
    trackingDataArray: trackingDataArray
  };
}

export function updateTrackingDataSliderActionCreator(
  trackingType: TrackingType,
  value: number,
  sliderRange: number
): UpdateTrackingDataSliderAction {
  return {
    type: TrackingActionTypes.UPDATE_TRACKING_DATA_SLIDER,
    trackingType: trackingType,
    value: value,
    sliderRange: sliderRange
  };
}

export function updateTrackingDataFreeTextActionCreator(
  trackingType: TrackingType,
  text?: string
): UpdateTrackingDataFreeTextAction {
  return {
    type: TrackingActionTypes.UPDATE_TRACKING_DATA_FREE_TEXT,
    trackingType: trackingType,
    text: text
  };
}

export function updateTrackingDataFoodActionCreator(
  foodItems: FoodItem[],
  text?: string,
  imagePathTemp?: string
): UpdateTrackingDataFoodAction {
  return {
    type: TrackingActionTypes.UPDATE_TRACKING_DATA_FOOD,
    text: text,
    foodItems: foodItems,
    imagePathTemp: imagePathTemp
  };
}

export function saveTrackingDataActionCreator(): SaveTrackingDataAction {
  return {
    type: TrackingActionTypes.SAVE_TRACKING_DATA
  };
}

export function saveTrackingDataSuccessActionCreator(
  trackingDataSaved: TrackingData[]
): SaveTrackingDataSuccessAction {
  return {
    type: TrackingActionTypes.SAVE_TRACKING_DATA_SUCCESS,
    trackingDataToPost: trackingDataSaved
  };
}

export function postTrackingDataActionCreator(
  trackingData: TrackingData[]
): PostTrackingDataAction {
  return {
    type: TrackingActionTypes.POST_TRACKING_DATA,
    trackingDataToPost: trackingData
  };
}

export function postTrackingDataSuccessActionCreator(): PostTrackingDataSuccessAction {
  return {
    type: TrackingActionTypes.POST_TRACKING_DATA_SUCCESS
  };
}

export function updateTrackingTimestampActionCreator(
  timestamp: Date
): UpdateTrackingTimestampAction {
  return {
    type: TrackingActionTypes.UPDATE_TRACKING_TIMESTAMP,
    timestamp: timestamp
  };
}

export function deleteTrackingDataActionCreator(
  trackingType: TrackingType
): DeleteTrackingDataAction {
  return {
    type: TrackingActionTypes.DELETE_TRACKING_DATA,
    trackingType: trackingType
  };
}

export function overviewsReloadedActionCreator(): OverviewsReloadedAction {
  return {
    type: TrackingActionTypes.OVERVIEWS_RELOADED
  };
}

export function weeklySymptomScoreComputedActionCreator(): WeeklySymptomScoreComputedAction {
  return {
    type: TrackingActionTypes.WEEKLY_SYMPTOM_SCORE_COMPUTED
  };
}

// Actions
interface InitTrackingAction {
  type: TrackingActionTypes.INIT_TRACKING;
  isEditionMode: boolean;
  trackingDataArray: TrackingData[];
}

interface UpdateTrackingDataSliderAction {
  type: TrackingActionTypes.UPDATE_TRACKING_DATA_SLIDER;
  trackingType: TrackingType;
  value: number;
  sliderRange: number;
}

interface UpdateTrackingDataFreeTextAction {
  type: TrackingActionTypes.UPDATE_TRACKING_DATA_FREE_TEXT;
  trackingType: TrackingType;
  text?: string;
}

interface UpdateTrackingDataFoodAction {
  type: TrackingActionTypes.UPDATE_TRACKING_DATA_FOOD;
  text?: string;
  imagePathTemp?: string;
  foodItems: FoodItem[];
}

interface SaveTrackingDataAction {
  type: TrackingActionTypes.SAVE_TRACKING_DATA;
}

interface PostTrackingDataAction {
  type: TrackingActionTypes.POST_TRACKING_DATA;
  trackingDataToPost: TrackingData[];
}

interface PostTrackingDataSuccessAction {
  type: TrackingActionTypes.POST_TRACKING_DATA_SUCCESS;
}

interface SaveTrackingDataSuccessAction {
  type: TrackingActionTypes.SAVE_TRACKING_DATA_SUCCESS;
  trackingDataToPost: TrackingData[];
}

interface UpdateTrackingTimestampAction {
  type: TrackingActionTypes.UPDATE_TRACKING_TIMESTAMP;
  timestamp: Date;
}
interface DeleteTrackingDataAction {
  type: TrackingActionTypes.DELETE_TRACKING_DATA;
  trackingType: TrackingType;
}

interface OverviewsReloadedAction {
  type: TrackingActionTypes.OVERVIEWS_RELOADED;
}

interface WeeklySymptomScoreComputedAction {
  type: TrackingActionTypes.WEEKLY_SYMPTOM_SCORE_COMPUTED;
}

export type TrackingAction =
  | InitTrackingAction
  | UpdateTrackingDataSliderAction
  | UpdateTrackingDataFreeTextAction
  | UpdateTrackingDataFoodAction
  | SaveTrackingDataAction
  | SaveTrackingDataSuccessAction
  | PostTrackingDataSuccessAction
  | UpdateTrackingTimestampAction
  | DeleteTrackingDataAction
  | OverviewsReloadedAction
  | WeeklySymptomScoreComputedAction;
