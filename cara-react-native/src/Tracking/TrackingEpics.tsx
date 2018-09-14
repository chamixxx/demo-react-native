import { Epic, ActionsObservable } from "redux-observable";
import { TrackingActionTypes } from "./TrackingReducer";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/observable/forkJoin";
import { saveTrackingDataArray, syncTrackingData } from "../RealmDB/RealmUtils";
import {
  saveTrackingDataSuccessActionCreator,
  postTrackingDataSuccessActionCreator
} from "./TrackingActions";
import {
  postTrackingData,
  didPostRequestSucceed
} from "../Backend/DjangoBackend";
import TrackingData from "../Models/TrackingData";
import { TrackingTypesEnum, TrackingType } from "./Utils/TrackingUtils";
import { sendMealItemImageToBackend } from "./Utils/MealItemImageManager";
import { each } from "lodash";
import Mixpanel from "react-native-mixpanel";
import { trackingAddViewSaved } from "../Utils/Constants";

export const saveTrackingDataEpic = (
  action$: ActionsObservable<any>,
  store: any
) => {
  // TODO: save image in mobile document folder and copy path to imagePath
  return action$
    .ofType(TrackingActionTypes.SAVE_TRACKING_DATA)
    .mergeMap(action => {
      // Filtering tracking data, updating timestamps if required, saving to realm
      let trackingDataArray = store
        .getState()
        .tracking.unsavedTracking.filter((elem: TrackingData) => elem.didTrack);
      saveTrackingDataArray(trackingDataArray);

      //Mixpanel tracking
      const activeTrackingTypes = trackingDataArray.map(
        (trackingData: TrackingData) => trackingData.trackingType
      );
      let properties: { [key: string]: boolean } = {};
      each(TrackingTypesEnum.getEnumValues(), (trackingType: TrackingType) => {
        properties[trackingType] =
          activeTrackingTypes.indexOf(trackingType) !== -1;
      });
      Mixpanel.trackWithProperties(trackingAddViewSaved, properties);

      return Observable.of(
        saveTrackingDataSuccessActionCreator(trackingDataArray)
      );
    });
};

export const postTrackingDataEpic = (
  action$: ActionsObservable<any>,
  store: any
) => {
  return action$
    .ofType(
      TrackingActionTypes.SAVE_TRACKING_DATA_SUCCESS,
      TrackingActionTypes.POST_TRACKING_DATA
    )
    .mergeMap(action => {
      let requests = action.trackingDataToPost.map(
        (trackingData: TrackingData) => {
          return Observable.from(
            postTrackingData(store.getState().auth.credentials, trackingData)
              .then(res => {
                if (didPostRequestSucceed(res.statusCode, res.jsonData)) {
                  syncTrackingData(res.jsonData);
                }

                if (trackingData.trackingType == TrackingTypesEnum.foodType) {
                  if (
                    trackingData.mealItems[0].imagePath !== undefined &&
                    trackingData.mealItems[0].imagePath !== null
                  ) {
                    sendMealItemImageToBackend(
                      trackingData.mealItems[0].imagePath!
                    );
                  }
                }
                return res;
              })
              .catch(err => {
                return err;
              })
          );
        }
      );
      // Ignoring err/results as this is being handled by the sync mechanism
      // Just waiting all promise to return in order to dispatch event POST_TRACKING_DATA_SUCCESS
      return Observable.forkJoin(requests).map(responses => {
        return postTrackingDataSuccessActionCreator();
      });
    });
};
