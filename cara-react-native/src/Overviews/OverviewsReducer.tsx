import {
  getChangeOverTimeForDate,
  TrackingType,
  TrackingTypesEnum
} from "../Tracking/Utils/TrackingUtils";
import { OverviewsAction } from "./OverviewsActions";
import { AnyAction } from "react-redux/node_modules/redux";
import { OverviewsEnum } from "./TrackingOverviews";

export interface OverviewsState {
  selectedDay: Date;
  weeklySelectedTrackingType: TrackingType;
  monthlySelectedTrackingType: TrackingType;
}

export const initialOverviewsState: OverviewsState = {
  selectedDay: getChangeOverTimeForDate(new Date()),
  weeklySelectedTrackingType: TrackingTypesEnum.waterType,
  monthlySelectedTrackingType: TrackingTypesEnum.waterType
};
export enum OverviewsActionTypes {
  UPDATE_SELECTED_DAY = "[overviews] UPDATE_SELECTED_DAY",
  UPDATE_SELECTED_TRACKING_TYPE = "[overviews] UPDATE_SELECTED_TRACKING_TYPE"
}

export function overviews(
  state: OverviewsState = initialOverviewsState,
  incomingAction: AnyAction
): OverviewsState {
  const action = incomingAction as OverviewsAction;
  switch (action.type) {
    case OverviewsActionTypes.UPDATE_SELECTED_DAY:
      return { ...state, selectedDay: action.selectedDay };
    case OverviewsActionTypes.UPDATE_SELECTED_TRACKING_TYPE:
      switch (action.overviewType) {
        case OverviewsEnum.weekly:
          return {
            ...state,
            weeklySelectedTrackingType: action.selectedTrackingType
          };
        case OverviewsEnum.monthly:
          return {
            ...state,
            monthlySelectedTrackingType: action.selectedTrackingType
          };
        default:
          return state;
      }
    default:
      return state;
  }
}
