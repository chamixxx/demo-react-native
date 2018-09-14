import { scoreInterpretation, trafficLightColourScale } from "./Constants";
import { IntlMessageContent } from "../Tracking/Utils/TrackingStaticData";
import TrackingData from "../Models/TrackingData";
import {
  TrackingType,
  TrackingTypesEnum
} from "../Tracking/Utils/TrackingUtils";
import { each } from "lodash";

export function interpretationForScore(score: number): IntlMessageContent {
  let level = levelForScore(score);
  return scoreInterpretation[level];
}

export function levelForScore(score: number): number {
  var level = -1;

  if (score < 15) {
    level = 0;
  } else if (15 <= score && score < 35) {
    level = 1;
  } else if (35 <= score && score < 55) {
    level = 2;
  } else if (55 <= score && score < 80) {
    level = 3;
  } else if (score >= 80) {
    level = 4;
  }

  if (level < 0) {
    Error("Level less than 0");
  }
  if (level >= trafficLightColourScale.length) {
    Error("Level greater than number of traffic light colours");
  }
  return level;
}

const multipleBonus = 10.0;
const multipleTolerance = 5.5;

export function aggregateScore(values: number[]): number {
  let maxValue = Math.max(...values);
  let maxOccurences: number;

  if (maxValue >= 10.0) {
    maxOccurences =
      values.filter((value: number) => {
        return value > maxValue - multipleTolerance;
      }).length - 1;
  } else {
    maxOccurences = 0;
  }
  return Math.min(maxValue + multipleBonus * maxOccurences, 100.0);
}

export function aggregateContributions(values: number[]): number[] {
  let maxValue = Math.max(...values);

  if (maxValue >= 10.0) {
    return Array.from(Array(values.length).keys()).filter((element: number) => {
      return values[element] > maxValue - multipleTolerance;
    });
  } else {
    return [];
  }
}

export function computeMoodScore(
  trackingData: TrackingData[]
): number | undefined {
  const values: any = {
    "100": 50.0,
    "75": 25.0,
    "50": 12.5,
    "25": 0.0,
    "0": 0.0
  };
  let b = trackingData.map((trackingPoint: TrackingData) => {
    return values[trackingPoint.value!.toString()];
  });
  if (b.length > 0) {
    return aggregateScore(b);
  } else {
    return undefined;
  }
}

export function computeSimplyScaledScore(
  scalingFactor: number
): ((trackingData: TrackingData[]) => number | undefined) {
  function scaleFunct(trackingData: TrackingData[]): number | undefined {
    let b = trackingData.map((trackingDataPoint: TrackingData) => {
      return scalingFactor * trackingDataPoint.value!;
    });
    if (b.length > 0) {
      return aggregateScore(b);
    } else {
      return undefined;
    }
  }
  return scaleFunct;
}

export function computeDiarrheaScore(
  trackingData: TrackingData[]
): number | undefined {
  const values: any = {
    "0": 0.0,
    "14": 0.0,
    "28": 0.0,
    "42": 0.0,
    "57": 0.0,
    "71": 10.0,
    "85": 20.0,
    "100": 20.0
  };
  const b = trackingData.map((trackingPoint: TrackingData) => {
    return values[trackingPoint.value!.toString()];
  });
  if (b.length > 0) {
    return aggregateScore(b);
  } else {
    return undefined;
  }
}

export function computeConstipationScore(
  trackingData: TrackingData[]
): number | undefined {
  const values: any = {
    "0": 40.0,
    "14": 40.0,
    "28": 20.0,
    "42": 0.0,
    "57": 0.0,
    "71": 0.0,
    "85": 0.0,
    "100": 0.0
  };
  const b = trackingData.map((trackingPoint: TrackingData) => {
    return values[trackingPoint.value!.toString()];
  });
  if (b.length > 0) {
    return aggregateScore(b);
  } else {
    return undefined;
  }
}

export enum ScoreComponent {
  score = "score",
  mood = "mood",
  tummyPain = "pain",
  headache = "headache",
  otherPain = "otherPain",
  bloating = "bloating",
  diarrhea = "diarrhea",
  constipation = "constipation"
}

interface ScoreComponentType {
  scoreComponent: ScoreComponent;
  trackingType: TrackingType;
  function: (trackingData: TrackingData[]) => number | undefined;
}

export const scoreComponents: ScoreComponentType[] = [
  {
    scoreComponent: ScoreComponent.mood,
    trackingType: TrackingTypesEnum.moodType,
    function: computeMoodScore
  },
  {
    scoreComponent: ScoreComponent.tummyPain,
    trackingType: TrackingTypesEnum.tummyPainType,
    function: computeSimplyScaledScore(0.7)
  },

  {
    scoreComponent: ScoreComponent.headache,
    trackingType: TrackingTypesEnum.headacheType,
    function: computeSimplyScaledScore(0.7)
  },
  {
    scoreComponent: ScoreComponent.otherPain,
    trackingType: TrackingTypesEnum.otherPainType,
    function: computeSimplyScaledScore(0.7)
  },
  {
    scoreComponent: ScoreComponent.bloating,
    trackingType: TrackingTypesEnum.bloatingType,
    function: computeSimplyScaledScore(0.5)
  },
  {
    scoreComponent: ScoreComponent.diarrhea,
    trackingType: TrackingTypesEnum.stoolType,
    function: computeDiarrheaScore
  },
  {
    scoreComponent: ScoreComponent.constipation,
    trackingType: TrackingTypesEnum.stoolType,
    function: computeConstipationScore
  }
];

export const scoreComponentsTypes = scoreComponents.map(
  (scoreComponent: any) => {
    return scoreComponent.scoreComponent;
  }
);

export function computeScoreComponents(
  trackingData: TrackingData[]
): { scoreComponent: ScoreComponent; value?: number }[] {
  let subscores = scoreComponents.map((scoreComponent: ScoreComponentType) => {
    return scoreComponent.function(
      trackingData.filter((trackingDataPoint: TrackingData) => {
        return trackingDataPoint.trackingType == scoreComponent.trackingType;
      })
    );
  });
  let nonNullScores = subscores
    .filter(element => {
      return element != undefined;
    })
    .map(element => element!);

  let score =
    nonNullScores.length > 0 ? aggregateScore(nonNullScores) : undefined;
  var ret: { scoreComponent: ScoreComponent; value?: number }[] = [
    { scoreComponent: ScoreComponent.score, value: score }
  ];
  each(scoreComponentsTypes, (component, index) => {
    ret.push({ scoreComponent: component, value: subscores[index] });
  });
  return ret;
}

export function computeTotalScore(
  trackingData: TrackingData[]
): number | undefined {
  const totalScoreComponent = computeScoreComponents(trackingData).filter(
    (element: { scoreComponent: ScoreComponent; value?: number }) => {
      return element.scoreComponent == ScoreComponent.score;
    }
  );
  return totalScoreComponent[0].value;
}

// export function getMaxComponents(
//   trackingData: TrackingData[]
// ): ScoreComponent[] {
//   let subscores = scoreComponents
//     .map(scoreComponent => {
//       return scoreComponent.function(
//         trackingData.filter((trackingDataPoint: TrackingData) => {
//           trackingDataPoint.trackingType == scoreComponent.trackingType;
//         })
//       );
//     })
//     .map(element => {
//       return element != undefined ? element : 0.0;
//     });
//   let aggregateContribs = aggregateContributions(subscores);
//   return aggregateContribs.map(element => {
//     scoreComponentsTypes[element];
//   });
// }
