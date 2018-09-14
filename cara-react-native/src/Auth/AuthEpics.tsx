import { ActionsObservable } from "redux-observable";
import {
  requestUser,
  postMetadata,
  didPostRequestSucceed,
  exportAccountData
} from "../Backend/DjangoBackend";
import {
  requestUserSuccessActionCreator,
  requestUserActionCreator,
  postMetadataSuccessActionCreator,
  postMetadataErrorActionCreator,
  resetEmailStatusSuccessActionCreator,
  requestExportLinkSuccessAction,
  requestExportLinkErrorActionCreator
} from "./AuthActions";
import { AuthActionTypes, AuthState } from "./AuthReducer";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/map";
import "rxjs/add/observable/from";
import "rxjs/add/observable/of";
import "rxjs/add/operator/delay";
import "rxjs/add/operator/takeUntil";
import AccountInfo, {
  isAuthenticatedWithBackend,
  toAccountInfoResponse
} from "../Models/AccountInfo";
import realm from "../RealmDB/RealmInit";
import {
  persistUser,
  syncAccountInfo,
  resetEmailStatus
} from "../RealmDB/RealmUtils";
import { encode } from "base-64";
import Mixpanel from "react-native-mixpanel";
import { userRequestsInteractiveExport } from "../Utils/Constants";

export const requestUserEpic = (action$: ActionsObservable<any>) => {
  return action$.ofType(AuthActionTypes.REQUEST_USER).mergeMap(action => {
    const ai = realm.objects("AccountInfo")[0] as AccountInfo;
    if (isAuthenticatedWithBackend(ai.username, ai.password)) {
      return Observable.of(
        requestUserSuccessActionCreator(encode(ai.username + ":" + ai.password))
      );
    } else {
      return Observable.from(
        requestUser()
          .then(res => {
            if (res.username !== undefined && res.password !== undefined) {
              persistUser(res.username, res.password);
              return requestUserSuccessActionCreator(
                encode(res.username + ":" + res.password)
              );
            } else {
              return requestUserActionCreator();
            }
          })
          .catch(err => {
            return requestUserActionCreator();
          })
      );
    }
  });
};

export const postMetaDataEpic = (
  action$: ActionsObservable<any>,
  store: any
) => {
  return action$
    .ofType(AuthActionTypes.POST_METADATA, AuthActionTypes.REQUEST_USER_SUCCESS)
    .mergeMap(action => {
      const delayIfNeeded =
        action.withDelay === undefined ? 0 : action.withDelay;
      return Observable.from(
        postMetadata(store.getState().auth.credentials)
          .then(res => {
            if (didPostRequestSucceed(res.statusCode, res.jsonData)) {
              const response = toAccountInfoResponse(res.jsonData);
              const syncedAi = syncAccountInfo(response);
              return postMetadataSuccessActionCreator();
            } else {
              return postMetadataErrorActionCreator();
            }
          })
          .catch(err => {
            console.log(err);
            return postMetadataErrorActionCreator();
          })
      )
        .delay(delayIfNeeded)
        .takeUntil(action$.ofType(AuthActionTypes.RESET_EMAIL_STATUS));
    });
};

export const resetEmailStatusEpic = (action$: ActionsObservable<any>) => {
  return action$.ofType(AuthActionTypes.RESET_EMAIL_STATUS).mergeMap(action => {
    resetEmailStatus();
    return Observable.of(resetEmailStatusSuccessActionCreator());
  });
};

export const postExportLinkRequestEpic = (
  action$: ActionsObservable<any>,
  store: any
) => {
  return action$
    .ofType(AuthActionTypes.REQUEST_EXPORT_LINK)
    .mergeMap(action => {
      const isPersonal = action.isPersonal;
      Mixpanel.trackWithProperties(userRequestsInteractiveExport, {
        isPersonal: isPersonal
      });
      return Observable.from(
        exportAccountData(isPersonal, store.getState().auth.credentials)
          .then(res => {
            if (didPostRequestSucceed(res.statusCode, res.jsonData)) {
              return requestExportLinkSuccessAction();
            }
            return requestExportLinkErrorActionCreator(
              res.jsonData["reason"],
              res.statusCode
            );
          })
          .catch(err => requestExportLinkErrorActionCreator(err, undefined))
      );
    });
};
