import RNFetchBlob from "react-native-fetch-blob";
import { encode } from "base-64";
import AccountInfo from "../../Models/AccountInfo";
import realm from "../../RealmDB/RealmInit";
import {
  postMealItemImage,
  didPostRequestSucceed
} from "../../Backend/DjangoBackend";
import { syncMealItemData } from "../../RealmDB/RealmUtils";
import { Alert, Platform } from "react-native";

const imageDirName: string = "mealItemImages";

export function createMealItemImageDirectoryIfDoesntExist() {
  RNFetchBlob.fs.isDir(getImageDirectoryPath()).then(isDir => {
    console.log(`file is ${isDir ? "" : "not"} a directory`);
    if (!isDir) {
      RNFetchBlob.fs.mkdir(getImageDirectoryPath());
    }
  });
}

function getImageDirectoryPath(): string {
  const path = RNFetchBlob.fs.dirs.DocumentDir + "/" + imageDirName + "/";
  return path;
}

export function getMealItemImageFullPath(uri: string): string {
  const imagePath = getImageDirectoryPath() + uri + ".jpg";
  return imagePath;
}

export function getMealItemImageFullPathForReading(uri: string): string {
  const imagePath =
    (Platform.OS == "ios" ? "" : "file://") +
    getImageDirectoryPath() +
    uri +
    ".jpg";
  return imagePath;
}

export function copyRecipeImageToMealItemImageFolder(
  uriSource: string,
  uriDestination: string
) {
  const path = getMealItemImageFullPath(uriDestination);
  return RNFetchBlob.fs.cp(uriSource, path);
}

export function saveMealItemImage(uriSource: string, uriDestination: string) {
  const path = getMealItemImageFullPath(uriDestination);
  console.log(path);
  console.log(uriSource);
  RNFetchBlob.fs
    .mv(uriSource.replace("file:///", "/"), path)
    .then(() => {
      console.log("FILE copied");
      console.log(path);
    })
    .catch(err => {
      console.log(err.message);
    });
}

export function sendMealItemImageToBackend(uri: string) {
  const imageFullPath = getMealItemImageFullPath(uri);
  const ai: AccountInfo = realm.objects<AccountInfo>("AccountInfo")[0];
  const credentials = encode(ai.username + ":" + ai.password);
  postMealItemImage(credentials, imageFullPath, uri)
    .then(({ statusCode, jsonData }) => {
      if (didPostRequestSucceed(statusCode, jsonData)) {
        syncMealItemData(jsonData);
      }
      console.log(jsonData);
    })
    .catch(err => {
      console.log(err);
    });
}
