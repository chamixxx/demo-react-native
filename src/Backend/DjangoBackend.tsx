import realm from "../RealmDB/RealmInit";
import {
  djangoBaseUrl,
  djangoAuthUri,
  djangoTrackingUri,
  djangoFoodItemUri
} from "../Utils/Constants";
import AccountInfo from "../Models/AccountInfo";
import { updateAccountInfo } from "../RealmDB/RealmUtils";
import TrackingData from "../Models/TrackingData";
import RNFetchBlob from "react-native-fetch-blob";
import { getMealItemImageFullPath } from "../Tracking/Utils/MealItemImageManager";
import DeviceInfo from "react-native-device-info";

export function requestUser() {
  const requestUserUri = __DEV__ ? "/requestUserSimulator/" : "/requestUser/";
  const fullUrl = djangoBaseUrl + djangoAuthUri + requestUserUri;
  return fetch(fullUrl, {
    method: "POST"
  }).then(res => res.json());
}

const api = {
  post: (url: string, credentials: string, body?: string) => {
    return fetch(url, {
      method: "POST",
      credentials: "same-origin",
      body: body,
      headers: {
        "Content-Type": "application/json",
        Authorization: "basic " + credentials,
        "Accept-Language": DeviceInfo.getDeviceLocale().substr(0, 2)
      }
    })
      .then(response => {
        const statusCode = response.status;
        const data = response.json();
        return Promise.all([statusCode, data]);
      })
      .then(res => ({ statusCode: res[0], jsonData: res[1] }));
  },
  get: (url: string, credentials: string, body?: string) => {
    return fetch(url, {
      method: "GET",
      credentials: "same-origin",
      body: body,
      headers: {
        Authorization: "basic " + credentials,
        "Accept-Language": DeviceInfo.getDeviceLocale().substr(0, 2)
      }
    })
      .then(response => {
        const statusCode = response.status;
        const data = response.json();
        return Promise.all([statusCode, data]);
      })
      .then(res => ({ statusCode: res[0], jsonData: res[1] }));
  }
};

export function postMetadata(credentials: string) {
  const fullUrl = djangoBaseUrl + djangoAuthUri + "/postMetadata/";
  const accountInfo = updateAccountInfo();
  let body = JSON.stringify(accountInfo);
  return api.post(fullUrl, credentials, body);
}

export function postTrackingData(
  credentials: string,
  trackingData: TrackingData
) {
  const fullUrl = djangoBaseUrl + djangoTrackingUri + "/postTrackingDataPoint/";
  return api.post(fullUrl, credentials, JSON.stringify(trackingData));
}

export function postMealItemImage(
  credentials: string,
  imagePath: string,
  uri: string
) {
  const fullUrl =
    djangoBaseUrl + djangoTrackingUri + "/uploadMealItemImage/" + uri + "/";
  return RNFetchBlob.fetch(
    "PUT",
    fullUrl,
    {
      Authorization: "basic " + credentials,
      "Content-Type": "application/jpg",
      "Content-disposition": "attachment; filename=upload.jpg"
    },
    RNFetchBlob.wrap(imagePath)
  ).then(res => {
    return {
      statusCode: res.respInfo.status,
      jsonData: res.json()
    };
  });
}

export function checkAccountRestoration(credentials: string) {
  const fullUrl = djangoBaseUrl + djangoAuthUri + "/checkAccountRestoration/";
  return api.post(fullUrl, credentials, undefined);
}

export function requestAccountRestoration(credentials: string) {
  const fullUrl = djangoBaseUrl + djangoAuthUri + "/requestAccountRestoration/";
  const accountInfo = realm.objects<AccountInfo>("AccountInfo")[0];
  const body = JSON.stringify({ email: accountInfo.email });
  return api.post(fullUrl, credentials, body);
}

export function getMetadata(credentials: string) {
  const fullUrl = djangoBaseUrl + djangoAuthUri + "/getMetadata/";
  return api.get(fullUrl, credentials, undefined);
}

export function getFoodItems(credentials: string) {
  const fullUrl = djangoBaseUrl + djangoFoodItemUri + "/";
  return api.get(fullUrl, credentials, undefined);
}

export function getFoodItemImage(uri: string) {
  const fullUrl = djangoBaseUrl + uri;
  return RNFetchBlob.config({
    fileCache: true,
    path: RNFetchBlob.fs.dirs.DocumentDir + "/" + uri
  }).fetch("GET", fullUrl);
}

export function getMealItems(credentials: string) {
  const fullUrl = djangoBaseUrl + djangoTrackingUri + "/getMealItems/";
  return api.get(fullUrl, credentials, undefined);
}

export function getTrackingData(credentials: string) {
  const fullUrl = djangoBaseUrl + djangoTrackingUri + "/getTrackingDataPoints/";
  return api.get(fullUrl, credentials, undefined);
}

export function resendEmailConfirmation(credentials: string) {
  const fullUrl = djangoBaseUrl + djangoAuthUri + "/resendConfirmationEmail/";
  api.post(fullUrl, credentials, undefined);
}

export function getMealImage(credentials: string, imageUri: string) {
  const fullUrl =
    djangoBaseUrl +
    djangoTrackingUri +
    "/downloadMealItemImage/" +
    imageUri +
    "/";

  return RNFetchBlob.config({
    fileCache: true,
    // by adding this option, the temp files will have a file extension
    appendExt: "png",
    path: getMealItemImageFullPath(imageUri)
  }).fetch("GET", fullUrl, {
    Authorization: "basic " + credentials
  });
}

export function exportAccountData(isPersonal: boolean, credentials: string) {
  const fullUrl =
    djangoBaseUrl + djangoTrackingUri + "/requestInteractiveExport/";
  const body = JSON.stringify({ isPersonal: isPersonal });
  return api.post(fullUrl, credentials, body);
}

export function cancelAccountRestoration(credentials: string) {
  const fullUrl = djangoBaseUrl + djangoAuthUri + "/cancelAccountRestoration/";
  return api.post(fullUrl, credentials, undefined);
}

export function getListVersion(credentials: string, uri: string) {
  const fullUrl = djangoBaseUrl + uri + "/getListVersion/";
  return api.get(fullUrl, credentials, undefined);
}

export function didPostRequestSucceed(
  statusCode: number,
  responseData: any
): boolean {
  if (statusCode === 200) {
    const result = responseData["result"];
    const description = responseData["description"];
    if (result !== undefined) {
      if (description !== undefined) {
        console.log(result + " " + description);
      }
      if (result === "success") {
        return true;
      } else {
        const reason = responseData["reason"];
        if (reason !== undefined) {
          console.log("Something wrong happened on the backend " + reason);
        } else {
          console.log("Something wrong happened on the backend ");
        }
        return false;
      }
    }
    return false;
  } else if (statusCode === 403 || statusCode === 401) {
    console.log("Wrong credentials");
    return false;
  } else {
    console.log("Server error");
    return false;
  }
}
