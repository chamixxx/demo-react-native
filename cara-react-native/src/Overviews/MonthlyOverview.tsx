import React from "react";
import Moment from "moment";
import {
  TrackingTypesEnum,
  TrackingType
} from "../Tracking/Utils/TrackingUtils";
import TrackingData, {
  mapRealmTrackingDataToTrackingData
} from "../Models/TrackingData";
import { View, StyleSheet } from "react-native";
import { injectIntl, InjectedIntlProps } from "react-intl";
import {
  darkGreyColour,
  trafficLightColourScaleStool,
  blueColourFromScheme,
  trafficLightColourScale
} from "../Utils/Constants";
import { connect } from "react-redux";
import {
  requestExportLinkActionCreator,
  postMetadataActionCreator
} from "../Auth/AuthActions";
import { overviewsReloadedActionCreator } from "../Tracking/TrackingActions";
import { trackingDataFromDate } from "../Tracking/Utils/TrackingDataManager";
import DoubleLineChart from "./Charts/DoubleLineChart";
import CombinedLineBarChart from "./Charts/CombinedLineBarChart";
import { each } from "lodash";
import SymptomScoreChart from "./Charts/SymptomScoreChart";
import TrackingTypePicker from "./Components/TrackingTypePicker";
import { trackingTypesActiveOrdered } from "../Tracking/Utils/TrackingCategoriesManager";
import { OverviewsEnum } from "./TrackingOverviews";
import { graphTypeFromTrackingType, GraphTypeEnum } from "./OverviewsUtils";
import SimpleBarChart from "./Charts/SimpleBarChart";
import { getSliderValue } from "../Tracking/TrackingReducer";
import {
  computeScoreComponents,
  computeTotalScore,
  levelForScore
} from "../Utils/ScoreHelper";
import SymptomScoreChartMonthly from "./Charts/SymptomScoreChartMonthly";
import SimpleLineMonthlyChart from "./Charts/SimpleLineMonthlyChart";

// Selectors

export function getBeginningOfMonthFromSelectedDay(selectedDay: Date): Date {
  console.log(
    Moment(selectedDay)
      .startOf("month")
      .hours(4)
      .toDate()
  );
  return Moment(selectedDay)
    .startOf("month")
    .hours(4)
    .toDate();
}

// Interfaces and types

interface OwnProps {}

interface StateProps {
  shouldReloadOverviews: boolean;
  selectedTrackingType: TrackingType;
  selectedMonth: Date;
}

interface DispatchProps {
  onOverviewReload: () => void;
}

type Props = StateProps & DispatchProps & OwnProps & InjectedIntlProps;

interface State {}

enum StoolValueType {
  diarrhea,
  constipation
}

// Component class

class MonthlyOverview extends React.Component<Props, State> {
  private barData: {
    value: number;
    date: number;
  }[][] = [];
  private barData2: {
    value: number;
    date: number;
  }[][] = [];
  private lineData: {
    value: number;
    date: number;
  }[] = [];
  private lineData2: {
    value: number;
    date: number;
  }[] = [];
  private yMax: number = 100;

  constructor(props: Props) {
    super(props);
  }

  minValueConstipation: number = 0;
  minValueDiarrhea: number = 0;

  componentDidMount() {
    this.getTrackingDataToDisplay(this.props.selectedTrackingType);
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.shouldReloadOverviews === true) {
      this.props.onOverviewReload();
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (nextProps.selectedMonth !== this.props.selectedMonth) {
      return true;
    }
    if (
      this.props.shouldReloadOverviews === true &&
      nextProps.shouldReloadOverviews === false
    ) {
      return false;
    }
    return true;
  }

  mapStoolValue = (
    value: number
  ): { value: number; type: StoolValueType | undefined } => {
    switch (value) {
      case 0:
        return { value: 99, type: StoolValueType.constipation };
      case 14:
        return { value: 66, type: StoolValueType.constipation };
      case 28:
        return { value: 33, type: StoolValueType.constipation };
      case 42:
        return { value: 0, type: undefined };
      case 57:
        return { value: 0, type: undefined };
      case 71:
        return { value: 33, type: StoolValueType.diarrhea };
      case 85:
        return { value: 66, type: StoolValueType.diarrhea };
      case 100:
        return { value: 99, type: StoolValueType.diarrhea };
      default:
        Error("Unsupported stool value for mapping");
        return { value: -1, type: undefined };
    }
  };

  getTrackingDataToDisplay = (trackingType: TrackingTypesEnum) => {
    let barDataToDisplay: {
      value: number;
      date: number;
    }[][] = [];
    let lineDataToDisplay: {
      value: number;
      date: number;
    }[] = [];
    let barDataToDisplay2: {
      value: number;
      date: number;
    }[][] = [];
    let lineDataToDisplay2: {
      value: number;
      date: number;
    }[] = [];

    const firstDay = this.props.selectedMonth;
    let numberOfDays = Moment(this.props.selectedMonth).daysInMonth();
    for (var i = 0; i < numberOfDays; i++) {
      const date = Moment(firstDay)
        .days(firstDay.getDay() + i)
        .toDate();

      const trackingData = trackingDataFromDate(date, trackingType);

      if (trackingData.length != 0) {
        let dataArrayPerDay: {
          value: number;
          date: number;
        }[] = [];

        let valuesArray: number[] = [];
        let valuesArray2: number[] = [];
        each(trackingData, (trackingPoint: TrackingData, index: number) => {
          const trackingPointMapped = mapRealmTrackingDataToTrackingData(
            trackingPoint
          );
          let value: number = 0;
          let value2: number = 0;
          if (trackingType == TrackingTypesEnum.stoolType) {
            const result = this.mapStoolValue(trackingPoint.value!);
            if (result.type != undefined) {
              if (result.type == StoolValueType.diarrhea) {
                valuesArray.push(result.value);
              } else {
                valuesArray2.push(result.value);
              }
            } else {
              valuesArray.push(this.minValueDiarrhea);
              valuesArray2.push(this.minValueConstipation);
            }
          } else {
            if (trackingType == TrackingTypesEnum.moodType) {
              // low mood value is good in the model, so let's invert it for the visualisation
              value = this.yMax - trackingPointMapped.value!;
            } else if (trackingType == TrackingTypesEnum.workoutType) {
              value = this.mapWorkoutValue(trackingPointMapped.value!);
            } else if (trackingType == TrackingTypesEnum.waterType) {
              value = getSliderValue(5, trackingPointMapped.value!)!;
            } else {
              value = trackingPointMapped.value!;
            }
            dataArrayPerDay.push({
              value: value,
              date: i
            });
            valuesArray.push(value);
          }
        });
        barDataToDisplay.push(dataArrayPerDay);
        if (trackingType == TrackingTypesEnum.waterType) {
          lineDataToDisplay.push({
            value: valuesArray.reduce(
              (previousValue, currentValue) => previousValue + currentValue,
              0
            ),
            date: i
          });
        } else if (trackingType == TrackingTypesEnum.sleepType) {
          lineDataToDisplay.push({
            value: Math.min(
              valuesArray.reduce(
                (previousValue, currentValue) => previousValue + currentValue,
                0
              ),
              this.yMax
            ),
            date: i
          });
        } else {
          if (valuesArray.length != 0) {
            lineDataToDisplay.push({
              value:
                valuesArray.reduce(
                  (previousValue, currentValue) => previousValue + currentValue,
                  0
                ) / valuesArray.length,
              date: i
            });
          } else {
            lineDataToDisplay.push({
              value: this.minValueDiarrhea,
              date: i
            });
          }
          if (valuesArray2.length != 0) {
            lineDataToDisplay2.push({
              value:
                valuesArray2.reduce(
                  (previousValue, currentValue) => previousValue + currentValue,
                  0
                ) / valuesArray2.length,
              date: i
            });
          } else {
            lineDataToDisplay2.push({
              value: this.minValueConstipation,
              date: i
            });
          }
        }
      } else {
        if (
          graphTypeFromTrackingType(trackingType) == GraphTypeEnum.simpleBar
        ) {
          lineDataToDisplay.push({
            value: 0,
            date: i
          });
        }
      }
    }
    this.barData = barDataToDisplay;
    this.lineData = lineDataToDisplay;
    this.lineData2 = lineDataToDisplay2;
  };

  mapWorkoutValue = (value: number): number => {
    if (value == 0.0) {
      return 40;
    } else if (value == 50) {
      return 80;
    } else if (value == 100) {
      return 120;
    } else {
      return 0;
    }
  };

  getGraphToDisplay = (): JSX.Element => {
    const graphType = graphTypeFromTrackingType(
      this.props.selectedTrackingType
    );
    switch (graphType) {
      case GraphTypeEnum.simpleBar:
        return (
          <SimpleBarChart
            trackingType={this.props.selectedTrackingType}
            barData={this.lineData}
          />
        );
      case GraphTypeEnum.simpleLine:
        return (
          <SimpleLineMonthlyChart
            trackingType={this.props.selectedTrackingType}
            lineData={this.lineData}
          />
        );
      case GraphTypeEnum.doubleLine:
        return (
          <DoubleLineChart
            dataDiarrhea={this.lineData}
            dataConstipation={this.lineData2}
            overviewType={OverviewsEnum.monthly}
          />
        );
      case GraphTypeEnum.combinedLineBar:
        return (
          <SimpleLineMonthlyChart
            trackingType={this.props.selectedTrackingType}
            lineData={this.lineData}
          />
        );
      default:
        return <View />;
    }
  };

  render() {
    this.getTrackingDataToDisplay(this.props.selectedTrackingType);
    return (
      <View style={{ flex: 1 }}>
        <SymptomScoreChartMonthly />
        {this.getGraphToDisplay()}
        <TrackingTypePicker
          pickerDataSource={trackingTypesActiveOrdered(OverviewsEnum.monthly)}
          overviewType={OverviewsEnum.monthly}
          selectedTrackingType={this.props.selectedTrackingType}
        />
      </View>
    );
  }
}

const mapStateToProps = (state: any): StateProps => {
  return {
    shouldReloadOverviews: state.tracking.shouldReloadOverviews,
    selectedTrackingType: state.overviews.monthlySelectedTrackingType,
    selectedMonth: getBeginningOfMonthFromSelectedDay(
      state.overviews.selectedDay
    )
  };
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
  return {
    onOverviewReload: () => {
      dispatch(overviewsReloadedActionCreator());
    }
  };
};

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(MonthlyOverview));
