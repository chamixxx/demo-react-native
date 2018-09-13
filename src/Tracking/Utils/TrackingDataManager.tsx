import { TrackingTypesEnum, getChangeOverTimeForDate } from "./TrackingUtils";
import realm from "../../RealmDB/RealmInit";
import TrackingData from "../../Models/TrackingData";

export function trackingDataFromDate(
  date: Date,
  trackingType?: TrackingTypesEnum
) {
  let fromDate = getChangeOverTimeForDate(date);
  let toDate = new Date(
    getChangeOverTimeForDate(fromDate).setHours(
      getChangeOverTimeForDate(fromDate).getHours() + 24
    )
  );
  let trackingData;
  if (trackingType != undefined) {
    trackingData = realm
      .objects<TrackingData>("TrackingData")
      .filtered("deleted == false")
      .filtered(
        "timestamptracking <= $0 AND timestamptracking >= $1 AND trackingType==$2",
        toDate,
        fromDate,
        trackingType
      )
      .sorted("timestamptracking", true);
  } else {
    trackingData = realm
      .objects<TrackingData>("TrackingData")
      .filtered("deleted == false")
      .filtered(
        "timestamptracking <= $0 AND timestamptracking >= $1",
        toDate,
        fromDate
      )
      .sorted("timestamptracking", true);
  }
  return trackingData;
}
