import { AuthActions } from "./AuthActions";
import { RequestError } from "../Utils/Store";

export enum AuthActionTypes {
  REQUEST_USER = "[auth] REQUEST_USER",
  REQUEST_USER_SUCCESS = "[auth] REQUEST_USER_SUCCESS",
  REQUEST_USER_ERROR = "[auth] REQUEST_USER_ERROR",
  POST_METADATA = "[auth] POST_METADATA",
  POST_METADATA_SUCCESS = "[auth] POST_METADATA_SUCCESS",
  POST_METADATA_ERROR = "[auth] POST_METADATA_ERROR",
  RESET_EMAIL_STATUS = "[auth] RESET_EMAIL_STATUS",
  RESET_EMAIL_STATUS_SUCCESS = "[auth] RESET_EMAIL_STATUS_SUCCESS",
  REQUEST_EXPORT_LINK = "[auth] REQUEST_EXPORT_LINK",
  REQUEST_EXPORT_LINK_SUCCESS = "[auth] REQUEST_EXPORT_LINK_SUCCESS",
  REQUEST_EXPORT_LINK_ERROR = "[auth] REQUEST_EXPORT_LINK_ERROR"
}

export interface AuthState {
  credentials?: undefined;
  isFetching: boolean;
  isFetchingExportToken: boolean;
  exportTokenError: RequestError;
}

const initialState: AuthState = {
  credentials: undefined,
  isFetching: false,
  isFetchingExportToken: false,
  exportTokenError: { statusCode: undefined, description: undefined }
};

export function auth(state: AuthState = initialState, action: AuthActions) {
  switch (action.type) {
    case AuthActionTypes.REQUEST_USER:
      return state;
    case AuthActionTypes.REQUEST_USER_SUCCESS:
      return { ...state, credentials: action.credentials, isFetching: true };
    case AuthActionTypes.POST_METADATA:
      return { ...state, isFetching: true };
    case AuthActionTypes.POST_METADATA_SUCCESS:
      return { ...state, isFetching: false };
    case AuthActionTypes.POST_METADATA_ERROR:
      return { ...state, isFetching: false };
    case AuthActionTypes.RESET_EMAIL_STATUS:
      return state;
    case AuthActionTypes.RESET_EMAIL_STATUS_SUCCESS:
      return state;
    case AuthActionTypes.REQUEST_EXPORT_LINK:
      return {
        ...state,
        isFetchingExportToken: true,
        exportTokenError: initialState.exportTokenError
      };
    case AuthActionTypes.REQUEST_EXPORT_LINK_SUCCESS:
      return { ...state, isFetchingExportToken: false };
    case AuthActionTypes.REQUEST_EXPORT_LINK_ERROR:
      return {
        ...state,
        isFetchingExportToken: false,
        exportTokenError: action.error
      };
    default:
      return state;
  }
}
