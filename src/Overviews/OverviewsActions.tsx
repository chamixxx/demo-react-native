import { OverviewsActionTypes } from "./OverviewsReducer";
import { TrackingType } from "../Tracking/Utils/TrackingUtils";
import { OverviewsEnum } from "./TrackingOverviews";

// Action Creators
export function updateSelectedDayActionCreator(
  selectedDay: Date
): UpdateSelectedDayAction {
  return {
    type: OverviewsActionTypes.UPDATE_SELECTED_DAY,
    selectedDay: selectedDay
  };
}

export function updateSelectedTrackingTypeActionCreator(
  selectedTrackingType: TrackingType,
  overviewType: OverviewsEnum
): UpdateSelectedTrackingTypeAction {
  return {
    type: OverviewsActionTypes.UPDATE_SELECTED_TRACKING_TYPE,
    selectedTrackingType: selectedTrackingType,
    overviewType: overviewType
  };
}

// Actions
interface UpdateSelectedDayAction {
  type: OverviewsActionTypes.UPDATE_SELECTED_DAY;
  selectedDay: Date;
}

interface UpdateSelectedTrackingTypeAction {
  type: OverviewsActionTypes.UPDATE_SELECTED_TRACKING_TYPE;
  selectedTrackingType: TrackingType;
  overviewType: OverviewsEnum;
}

export type OverviewsAction =
  | UpdateSelectedDayAction
  | UpdateSelectedTrackingTypeAction;
