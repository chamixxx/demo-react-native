import React from "react";
import { LineChart } from "react-native-svg-charts";
import { View, Dimensions, Text } from "react-native";
import { Circle, Line, G, Text as TextSvg, Rect } from "react-native-svg";
import {
  ultraLightGreyColour,
  trafficLightColourScale
} from "../../Utils/Constants";
import Moment from "moment";
import { injectIntl, InjectedIntlProps } from "react-intl";
import { connect } from "react-redux";
import { trackingDataFromDate } from "../../Tracking/Utils/TrackingDataManager";
import { computeTotalScore, levelForScore } from "../../Utils/ScoreHelper";
import { weeklySymptomScoreComputedActionCreator } from "../../Tracking/TrackingActions";
import { getBeginningOfMonthFromSelectedDay } from "../MonthlyOverview";

interface OwnProps {}

interface State {}

interface StateProps {
  shouldComputeWeeklySymptomScore: boolean;
  selectedMonth: Date;
}

interface DispatchProps {
  onSymptomScoreComputed: () => void;
}

type Props = StateProps & DispatchProps & OwnProps & InjectedIntlProps;

function getDataToDisplay(selectedMonth: Date) {
  let symptomScoreDataToDisplay: {
    value: number;
    date: number;
  }[] = [];

  const firstDay = selectedMonth;
  let numberOfDays = Moment(selectedMonth).daysInMonth();
  for (var i = 0; i < numberOfDays; i++) {
    const date = Moment(firstDay)
      .days(firstDay.getDay() + i)
      .toDate();

    const trackingDataForSymptomScore = trackingDataFromDate(date);
    const symptomScoreOptional = computeTotalScore(
      Array.from(trackingDataForSymptomScore)
    );

    if (symptomScoreOptional != undefined) {
      let symptomLevel = levelForScore(symptomScoreOptional);
      symptomScoreDataToDisplay.push({
        value: symptomLevel,
        date: i
      });
    }
  }
  return symptomScoreDataToDisplay;
}

class SymptomScoreChartMonthly extends React.Component<Props, State> {
  shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (
      nextProps.selectedMonth.getTime() == this.props.selectedMonth.getTime() &&
      nextProps.shouldComputeWeeklySymptomScore == false
    ) {
      return false;
    }
    return true;
  }

  render() {
    let xAxisData: number[] = [];
    for (let index = -0.5; index < 30; index++) {
      xAxisData.push(index);
    }
    const xAxisLabel = [
      {
        value: 5,
        index: 4
      },
      {
        value: 10,
        index: 9
      },
      {
        value: 15,
        index: 14
      },
      {
        value: 20,
        index: 19
      },
      {
        value: 25,
        index: 24
      },
      {
        value: 30,
        index: 29
      }
    ];
    const yAxisData = [-12.5, 12.5, 37.5, 62.5, 87.5, 112.5];

    const Decorator = ({ x, y, data }: any) => {
      return data.map((item: any) => (
        <Circle
          key={item.date + Math.random()}
          cx={x(item.date)}
          cy={y(item.value * 25)}
          r={3}
          stroke={ultraLightGreyColour}
          strokeWidth={2.5}
          fill={trafficLightColourScale[item.value]}
        />
      ));
    };

    const DecoratorLabel = ({ x, y, data }: any) => {
      return data.map((item: any) => (
        <TextSvg
          key={item.index + Math.random()}
          x={x(item.index - 0.2)}
          y={y(0.7)}
          fill="white"
          fontSize="12"
          fontWeight="normal"
          textAnchor="middle"
        >
          {item.value}
        </TextSvg>
      ));
    };

    const CustomGrid = ({ x, y, data, ticks }: any) => (
      <G>
        {// Horizontal grid
        yAxisData.map((tick: any) => {
          if (tick == -12.5 || tick == 112.5) {
            return (
              <Line
                key={tick + Math.random()}
                x1={"0%"}
                x2={"100%"}
                y1={y(tick)}
                y2={y(tick)}
                stroke={"rgba(255,255,255,1)"}
                strokeWidth={1}
              />
            );
          }
          return (
            <Line
              key={tick + Math.random()}
              x1={"0%"}
              x2={"100%"}
              y1={y(tick)}
              y2={y(tick)}
              stroke={"rgba(255,255,255,0.5)"}
              strokeDasharray={[3, 2]}
              strokeWidth={1}
            />
          );
        })}
        {// Vertical grid
        xAxisData.map((elem: any) => {
          let strokeColor = "rgba(255,255,255,0.5)";
          if ((elem + 0.5) % 5 == 0) {
            strokeColor = "rgba(255,255,255,1)";
          }
          return (
            <Line
              key={elem + Math.random()}
              y1={y(-12.5)}
              y2={y(112.5)}
              x1={x(elem)}
              x2={x(elem)}
              stroke={strokeColor}
              strokeDasharray={[3, 2]}
              strokeWidth={1}
            />
          );
        })}
        {xAxisData.map((elem: any) => {
          if (
            Moment(this.props.selectedMonth)
              .add(elem + 0.5, "days")
              .isoWeekday() == 7 ||
            Moment(this.props.selectedMonth)
              .add(elem + 0.5, "days")
              .isoWeekday() == 6
          ) {
            return (
              <Rect
                key={elem + Math.random()}
                height={y(-12.5)}
                y={y(112.5)}
                x={x(elem)}
                width={x(0.5)}
                fill={"rgba(255,255,255,0.2)"}
                strokeWidth={0}
              />
            );
          }
        })}
      </G>
    );

    const CustomGridLabel = ({ x, y, data, ticks }: any) => (
      <G>
        {
          // Horizontal grid
        }
        {// Vertical grid
        xAxisLabel.map((elem: any) => {
          return (
            <Line
              key={elem + Math.random()}
              y1={y(-12.5)}
              y2={y(112.5)}
              x1={x(elem.value - 0.5)}
              x2={x(elem.value - 0.5)}
              stroke={"rgba(255,255,255,1)"}
              strokeDasharray={[3, 2]}
              strokeWidth={1}
            />
          );
        })}
      </G>
    );

    const sideMargin = 12;
    const graphWidth = Dimensions.get("window").width - sideMargin * 2;
    const graphHeight = graphWidth * 0.35;
    const contentInset = graphHeight / 10 + 0.5;
    const bottomViewHeight: number = (graphHeight / 5) * 2;
    let data = getDataToDisplay(
      getBeginningOfMonthFromSelectedDay(this.props.selectedMonth)
    );
    if (data.length == 0) {
      data = [
        {
          value: -10,
          date: 0
        }
      ];
    }

    this.props.onSymptomScoreComputed();

    return (
      <View
        style={{
          margin: sideMargin,
          marginBottom: 0
        }}
      >
        <Text style={{ color: "white" }}>SYMPTOM SCORE</Text>
        <View style={{ height: graphHeight, flexDirection: "row" }}>
          <LineChart
            style={{ flex: 1 }}
            yAccessor={({ item }) => item.value}
            xAccessor={({ item }) => item.date}
            data={data}
            svg={{
              strokeWidth: 3,
              stroke: "transparent"
            }}
            contentInset={{ top: contentInset, bottom: contentInset }}
            //@ts-ignore
            xMin={-0.5}
            xMax={30.5}
            yMin={0}
            yMax={100}
          >
            <CustomGrid belowChart={true} />
            <Decorator />
          </LineChart>
        </View>
        <View style={{ height: bottomViewHeight, flexDirection: "row" }}>
          <LineChart
            style={{ flex: 1 }}
            data={xAxisLabel}
            yAccessor={({ item }) => 1}
            xAccessor={({ item }) => item.index}
            svg={{
              strokeWidth: 3,
              stroke: "transparent"
            }}
            //@ts-ignore
            xMin={-0.5}
            xMax={30.5}
            yMin={0}
            yMax={2}
          >
            <CustomGridLabel belowChart={true} />
            <DecoratorLabel />
          </LineChart>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state: any): StateProps => {
  return {
    shouldComputeWeeklySymptomScore:
      state.tracking.shouldComputeWeeklySymptomScore,
    selectedMonth: getBeginningOfMonthFromSelectedDay(
      state.overviews.selectedDay
    )
  };
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
  return {
    onSymptomScoreComputed: () => {
      dispatch(weeklySymptomScoreComputedActionCreator());
    }
  };
};

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(SymptomScoreChartMonthly));
