import { createStore, applyMiddleware } from "redux";
import logger from "redux-logger";
import rootReducer from "./RootReducer";
import { combineEpics, createEpicMiddleware } from "redux-observable";
import {
  requestUserEpic,
  postMetaDataEpic,
  resetEmailStatusEpic,
  postExportLinkRequestEpic
} from "../Auth/AuthEpics";
import {
  saveTrackingDataEpic,
  postTrackingDataEpic
} from "../Tracking/TrackingEpics";

import { AuthActions } from "../Auth/AuthActions";
import { AuthState } from "../Auth/AuthReducer";
import { TrackingState } from "../Tracking/TrackingReducer";
import { TrackingAction } from "../Tracking/TrackingActions";

import { OverviewsState } from "../Overviews/OverviewsReducer";
import { OverviewsAction } from "../Overviews/OverviewsActions";

export type RootState = TrackingState | AuthState | OverviewsState;

export type RootAction = TrackingAction | AuthActions | OverviewsAction;

const rootEpic = combineEpics<RootAction, RootState>(
  postMetaDataEpic,
  requestUserEpic,
  postTrackingDataEpic,
  saveTrackingDataEpic,
  resetEmailStatusEpic,
  postExportLinkRequestEpic
);
const epicMiddleware = createEpicMiddleware(rootEpic);
let store: any;
if (__DEV__ === true) {
  store = createStore(rootReducer, applyMiddleware(logger, epicMiddleware));
} else {
  store = createStore(rootReducer, applyMiddleware(epicMiddleware));
}

export default store;

export interface RequestError {
  description?: any;
  statusCode?: number;
}
