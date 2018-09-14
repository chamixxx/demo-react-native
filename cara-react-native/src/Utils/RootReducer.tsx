import { combineReducers } from "redux";
import tracking from "../Tracking/TrackingReducer";
import { auth } from "../Auth/AuthReducer";
import { overviews } from "../Overviews/OverviewsReducer";

const rootReducer = combineReducers({
  tracking,
  auth,
  overviews
});

export default rootReducer;
