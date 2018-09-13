import { IntlMessageContent } from "../Tracking/Utils/TrackingStaticData";

export const emptyStatePurpleColor = "#B87DFF";
export const blueColourFromScheme = "#221E92";
export const ultraLightGreyColour = "rgba(247, 247 ,  247 , 1)";
export const mediumGreyColour = "#AEAEAE";
export const darkGreyColour = "#595959";
export const greyColour = "#898989";
export const mainSeaColour = "#00B4A7";
export const kaleGreenColour = "#1E8080";
export const aquaMarineColour = "#50E3C2";
export const sunFlowerYellowColour = "#FFD13E";
export const carrotRedColour = "#FA5544";
export const raspberryRedColour = "#DD206A";
export const trafficLightColourScale = [
  kaleGreenColour,
  aquaMarineColour,
  sunFlowerYellowColour,
  carrotRedColour,
  raspberryRedColour
];
export const whiteBackgroundColor = "#FFFFFF";

const djangoHost = "backend.gohidoc.com";
const djangoProtocol = "https";
const djangoPort = "443";
export const djangoBaseUrl =
  djangoProtocol + "://" + djangoHost + ":" + djangoPort + "/";
export const djangoAuthUri = "auth";
export const djangoTrackingUri = "v3/tracking";
export const djangoRecipesUri = "recipes";
export const djangoFoodItemUri = "v3/foodItem";

export const trafficLightColourScaleStool = [
  mediumGreyColour,
  raspberryRedColour,
  raspberryRedColour,
  sunFlowerYellowColour,
  kaleGreenColour,
  kaleGreenColour,
  sunFlowerYellowColour,
  raspberryRedColour,
  raspberryRedColour
];

export const scoreInterpretation: IntlMessageContent[] = [
  {
    id: "dashboard.scoreDetailsView.easy",
    defaultMessage: "Easy"
  },
  {
    id: "dashboard.scoreDetailsView.mild",
    defaultMessage: "Mild"
  },
  {
    id: "dashboard.scoreDetailsView.moderate",
    defaultMessage: "Moderate"
  },
  {
    id: "dashboard.scoreDetailsView.severe",
    defaultMessage: "Severe"
  },
  {
    id: "dashboard.scoreDetailsView.awful",
    defaultMessage: "Awful"
  }
];

export const supportEmail = "hello@cara-app.com";

// Mixpanel
export const mixpanelToken = "66b849f20ff344bd94fe312bb20bae7d";

export const appSessionDuration = "APP: App Session Duration";
export const appFirstLaunched = "APP: App First Launched";

export const trackingAddViewSaved = "TRACKING: Add View saved";

export const asyncStorageError = "ASYNC STORAGE: Error";

export const userRequestsInteractiveExport =
  "USER: Requests interactive export";
export const userRequestsRestore = "USER: Requests account restoration";
export const userRestorationSuccess = "USER: Account Restoration Success";
export const userRestorationError = "USER: Account Restoration Error";

// Async storage
export const firstTimeAppLaunchedString = "firstTimeAppLaunched";
export const inAccountRestorationMode = "inAccountRestorationMode";

// Food Item high priority
export const highPriorityFoodItemIds: number[] = [
  3097,
  3093,
  3039,
  3005,
  3140,
  3096,
  3272,
  3186,
  3739,
  3275,
  3722,
  3046,
  3206,
  2997,
  3137,
  5504,
  3044,
  3132,
  3222,
  3705,
  3006,
  3176,
  3013,
  3008,
  3155,
  3003,
  3102,
  3196,
  3144,
  3018,
  5575,
  3202,
  3730,
  5542,
  3012,
  2992,
  3083,
  3041,
  3208,
  3080,
  3133,
  3078,
  3147,
  3094,
  3135,
  3091,
  3052,
  3590,
  3588,
  3027,
  3082
];
export const dbCacheVersion = 3;
export const dbLocalVersionKey = "dbLocalVersionKey";
