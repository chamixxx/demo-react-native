import {
  TrackingType,
  TrackingTypesEnum
} from "../Tracking/Utils/TrackingUtils";
import { OverviewsEnum } from "./TrackingOverviews";
import { IntlMessageContent } from "../Tracking/Utils/TrackingStaticData";

export enum GraphTypeEnum {
  simpleLine = "simpleLine",
  doubleLine = "doubleLine",
  combinedLineBar = "combinedLineBar",
  simpleBar = "simpleBar",
  custom = "custom"
}

export function graphTypeFromTrackingType(
  trackingType: TrackingType
): GraphTypeEnum {
  switch (trackingType) {
    case TrackingTypesEnum.additionalSymptomsType:
      return GraphTypeEnum.custom;
    case TrackingTypesEnum.bloatingType:
      return GraphTypeEnum.combinedLineBar;
    case TrackingTypesEnum.foodType:
      return GraphTypeEnum.custom;
    case TrackingTypesEnum.headacheType:
      return GraphTypeEnum.combinedLineBar;
    case TrackingTypesEnum.medicationsType:
      return GraphTypeEnum.custom;
    case TrackingTypesEnum.medicationsType2:
      return GraphTypeEnum.custom;
    case TrackingTypesEnum.moodType:
      return GraphTypeEnum.combinedLineBar;
    case TrackingTypesEnum.notesType:
      return GraphTypeEnum.custom;
    case TrackingTypesEnum.otherPainType:
      return GraphTypeEnum.combinedLineBar;
    case TrackingTypesEnum.periodType:
      return GraphTypeEnum.combinedLineBar;
    case TrackingTypesEnum.skinType:
      return GraphTypeEnum.custom;
    case TrackingTypesEnum.sleepType:
      return GraphTypeEnum.simpleLine;
    case TrackingTypesEnum.stoolType:
      return GraphTypeEnum.doubleLine;
    case TrackingTypesEnum.stressType:
      return GraphTypeEnum.combinedLineBar;
    case TrackingTypesEnum.tummyPainType:
      return GraphTypeEnum.combinedLineBar;
    case TrackingTypesEnum.waterType:
      return GraphTypeEnum.simpleBar;
    case TrackingTypesEnum.workoutType:
      return GraphTypeEnum.simpleBar;
  }
}

export function topLabelForChartFromTrackingType(
  trackingType: TrackingTypesEnum
): IntlMessageContent | undefined {
  switch (trackingType) {
    case TrackingTypesEnum.additionalSymptomsType:
      return undefined;
    case TrackingTypesEnum.bloatingType:
      return { id: "overview.chart.label.high", defaultMessage: "HIGH" };
    case TrackingTypesEnum.foodType:
      return undefined;
    case TrackingTypesEnum.headacheType:
      return { id: "overview.chart.label.high", defaultMessage: "HIGH" };
    case TrackingTypesEnum.medicationsType:
      return undefined;
    case TrackingTypesEnum.medicationsType2:
      return undefined;
    case TrackingTypesEnum.moodType:
      return { id: "overview.chart.label.good", defaultMessage: "GOOD" };
    case TrackingTypesEnum.notesType:
      return undefined;
    case TrackingTypesEnum.otherPainType:
      return { id: "overview.chart.label.high", defaultMessage: "HIGH" };
    case TrackingTypesEnum.periodType:
      return { id: "overview.chart.label.heavy", defaultMessage: "HEAVY" };
    case TrackingTypesEnum.skinType:
      return undefined;
    case TrackingTypesEnum.sleepType:
      return { id: "overview.chart.label.long", defaultMessage: "LONG" };
    case TrackingTypesEnum.stoolType:
      return undefined;
    case TrackingTypesEnum.stressType:
      return { id: "overview.chart.label.high", defaultMessage: "HIGH" };
    case TrackingTypesEnum.tummyPainType:
      return { id: "overview.chart.label.high", defaultMessage: "HIGH" };
    case TrackingTypesEnum.waterType:
      return { id: "overview.chart.label.1000", defaultMessage: "1000" };
    case TrackingTypesEnum.workoutType:
      return { id: "overview.chart.label.hard", defaultMessage: "HARD" };
  }
}

export function bottomLabelForChartFromTrackingType(
  trackingType: TrackingTypesEnum
): IntlMessageContent | undefined {
  switch (trackingType) {
    case TrackingTypesEnum.additionalSymptomsType:
      return undefined;
    case TrackingTypesEnum.bloatingType:
      return {
        id: "overview.chart.label.noBloating",
        defaultMessage: "NO BLOATING"
      };
    case TrackingTypesEnum.foodType:
      return undefined;
    case TrackingTypesEnum.headacheType:
      return {
        id: "overview.chart.label.noHeadache",
        defaultMessage: "NO HEADACHE"
      };
    case TrackingTypesEnum.medicationsType:
      return undefined;
    case TrackingTypesEnum.medicationsType2:
      return undefined;
    case TrackingTypesEnum.moodType:
      return { id: "overview.chart.label.bad", defaultMessage: "BAD" };
    case TrackingTypesEnum.notesType:
      return undefined;
    case TrackingTypesEnum.otherPainType:
      return { id: "overview.chart.label.noPain", defaultMessage: "NO PAIN" };
    case TrackingTypesEnum.periodType:
      return {
        id: "overview.chart.label.noPeriod",
        defaultMessage: "NO PERIOD"
      };
    case TrackingTypesEnum.skinType:
      return undefined;
    case TrackingTypesEnum.sleepType:
      return { id: "overview.chart.label.short", defaultMessage: "SHORT" };
    case TrackingTypesEnum.stoolType:
      return undefined;
    case TrackingTypesEnum.stressType:
      return {
        id: "overview.chart.label.noStress",
        defaultMessage: "NO STRESS"
      };
    case TrackingTypesEnum.tummyPainType:
      return { id: "overview.chart.label.noPain", defaultMessage: "NO PAIN" };
    case TrackingTypesEnum.waterType:
      return { id: "overview.chart.label.0", defaultMessage: "0" };
    case TrackingTypesEnum.workoutType:
      return { id: "overview.chart.label.easy", defaultMessage: "EASY" };
  }
}
