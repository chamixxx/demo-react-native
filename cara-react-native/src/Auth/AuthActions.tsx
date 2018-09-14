import { AuthActionTypes } from "./AuthReducer";
import { RequestError } from "../Utils/Store";

export function requestUserActionCreator(): RequestUserAction {
  return {
    type: AuthActionTypes.REQUEST_USER
  };
}

export function requestUserSuccessActionCreator(
  credentials: string
): RequestUserSuccessAction {
  return {
    type: AuthActionTypes.REQUEST_USER_SUCCESS,
    credentials: credentials
  };
}

export function postMetadataActionCreator(
  withDelay?: number
): PostMetadataAction {
  return {
    type: AuthActionTypes.POST_METADATA,
    withDelay: withDelay
  };
}

export function postMetadataSuccessActionCreator(): PostMetadataSuccessAction {
  return {
    type: AuthActionTypes.POST_METADATA_SUCCESS
  };
}

export function postMetadataErrorActionCreator(): PostMetadataErrorAction {
  return {
    type: AuthActionTypes.POST_METADATA_ERROR
  };
}

export function resetEmailStatusActionCreator(): ResetEmailStatusAction {
  return {
    type: AuthActionTypes.RESET_EMAIL_STATUS
  };
}

export function resetEmailStatusSuccessActionCreator(): ResetEmailStatusSuccessAction {
  return {
    type: AuthActionTypes.RESET_EMAIL_STATUS_SUCCESS
  };
}

export function requestExportLinkActionCreator(
  isPersonal: boolean
): RequestExportLinkAction {
  return {
    type: AuthActionTypes.REQUEST_EXPORT_LINK,
    isPersonal: isPersonal
  };
}

export function requestExportLinkSuccessAction(): RequestExportLinkSuccessAction {
  return {
    type: AuthActionTypes.REQUEST_EXPORT_LINK_SUCCESS
  };
}

export function requestExportLinkErrorActionCreator(
  description?: string,
  statusCode?: number
): RequestExportLinkErrorAction {
  return {
    type: AuthActionTypes.REQUEST_EXPORT_LINK_ERROR,
    error: { description: description, statusCode: statusCode }
  };
}

interface RequestUserAction {
  type: AuthActionTypes.REQUEST_USER;
}

interface RequestUserSuccessAction {
  type: AuthActionTypes.REQUEST_USER_SUCCESS;
  credentials: string;
}

interface PostMetadataAction {
  type: AuthActionTypes.POST_METADATA;
  withDelay?: number;
}

interface PostMetadataSuccessAction {
  type: AuthActionTypes.POST_METADATA_SUCCESS;
}

interface PostMetadataErrorAction {
  type: AuthActionTypes.POST_METADATA_ERROR;
}

interface ResetEmailStatusAction {
  type: AuthActionTypes.RESET_EMAIL_STATUS;
}

interface ResetEmailStatusSuccessAction {
  type: AuthActionTypes.RESET_EMAIL_STATUS_SUCCESS;
}

interface RequestExportLinkAction {
  type: AuthActionTypes.REQUEST_EXPORT_LINK;
  isPersonal: boolean;
}

interface RequestExportLinkSuccessAction {
  type: AuthActionTypes.REQUEST_EXPORT_LINK_SUCCESS;
}

interface RequestExportLinkErrorAction {
  type: AuthActionTypes.REQUEST_EXPORT_LINK_ERROR;
  error: RequestError;
}

export type AuthActions =
  | RequestUserAction
  | RequestUserSuccessAction
  | PostMetadataAction
  | PostMetadataSuccessAction
  | PostMetadataErrorAction
  | ResetEmailStatusAction
  | ResetEmailStatusSuccessAction
  | RequestExportLinkAction
  | RequestExportLinkSuccessAction
  | RequestExportLinkErrorAction;
