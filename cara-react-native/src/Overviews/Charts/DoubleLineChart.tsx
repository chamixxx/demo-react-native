import React from "react";
import { LineChart } from "react-native-svg-charts";
import * as shape from "d3-shape";
import { View, Dimensions, Text } from "react-native";
import Svg, { Circle, Line, G, Text as TextSVG, Rect } from "react-native-svg";
import { blueColourFromScheme, darkGreyColour } from "../../Utils/Constants";
import { InjectedIntlProps, injectIntl } from "react-intl";
import {
  labelFromTrackingType,
  TrackingTypesEnum
} from "../../Tracking/Utils/TrackingUtils";
import { OverviewsEnum } from "../TrackingOverviews";
import Moment from "moment";
import { connect } from "react-redux";
import { getBeginningOfMonthFromSelectedDay } from "../MonthlyOverview";

interface OwnProps {
  dataConstipation: {
    value: number;
    date: number;
  }[];
  dataDiarrhea: {
    value: number;
    date: number;
  }[];
  overviewType: OverviewsEnum;
}

interface StateProps {
  selectedMonth: Date;
}

interface DispatchProps {}

type Props = StateProps & DispatchProps & OwnProps & InjectedIntlProps;

class DoubleLineChart extends React.PureComponent<Props> {
  render() {
    let xAxisData = [-0.5, 0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5];
    let xMax = 6.5;
    const yAxisData = [-12.5, 12.5, 37.5, 62.5, 87.5, 112.5];

    if (this.props.overviewType == OverviewsEnum.monthly) {
      xMax = 30.5;
      xAxisData = [];
      for (let index = 0.5; index < 30; index++) {
        xAxisData.push(index);
      }
    }

    const Decorator = ({ x, y, data }: any) => {
      switch (this.props.overviewType) {
        case OverviewsEnum.weekly:
          return data.map((item: any) => (
            <Circle
              key={item.date + Math.random()}
              cx={x(item.date)}
              cy={y(item.value)}
              r={5}
              stroke={blueColourFromScheme}
              strokeWidth={3}
              fill={"white"}
            />
          ));
        case OverviewsEnum.monthly:
          return <View />;
        default:
          return <View />;
      }
    };

    const DecoratorDashed = ({ x, y, data }: any) => {
      switch (this.props.overviewType) {
        case OverviewsEnum.weekly:
          return data.map((item: any) => (
            <Circle
              key={item.date + Math.random()}
              cx={x(item.date)}
              cy={y(item.value)}
              r={5}
              stroke={blueColourFromScheme}
              strokeWidth={2}
              fill={"white"}
              strokeDasharray={[5, 2]}
            />
          ));
        case OverviewsEnum.monthly:
          return <View />;
        default:
          return <View />;
      }
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
                stroke={"rgba(190,190,190,1)"}
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
              stroke={"rgba(190,190,190,0.5)"}
              strokeDasharray={[3, 2]}
              strokeWidth={1}
            />
          );
        })}
        {// Vertical grid
        xAxisData.map((elem: any) => {
          let strokeColor = "rgba(190,190,190,0.3)";
          if (
            (elem + 0.5) % 5 == 0 &&
            this.props.overviewType == OverviewsEnum.monthly
          ) {
            strokeColor = "rgba(190,190,190,1)";
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
          if (this.props.overviewType == OverviewsEnum.monthly) {
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
                  fill={"rgba(190,190,190,0.2)"}
                  strokeWidth={0}
                />
              );
            }
          }
        })}
      </G>
    );
    const sideMargin = 12;
    const graphWidth = Dimensions.get("window").width - sideMargin * 2;
    const graphHeight = graphWidth * 0.4;
    const contentInset = graphHeight / 10 + 0.5;
    const topViewHeight: number = (graphHeight / 5) * 2;
    let dataDiarrhea = this.props.dataDiarrhea;
    if (dataDiarrhea.length == 0) {
      dataDiarrhea = [{ value: 1000, date: 0 }];
    }

    return (
      <View
        style={{
          margin: sideMargin,
          marginTop: 0,
          marginBottom: 0,
          elevation: 40,
          flex: 1
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            height: topViewHeight,
            justifyContent: "center"
          }}
        >
          <Svg height="100%" width="100%">
            <TextSVG
              fontSize="12"
              fontWeight="normal"
              x={12}
              y={topViewHeight / 3 + 4}
              fill={darkGreyColour}
            >
              DIARRHEA
            </TextSVG>
            <Line
              x1={80}
              y1={topViewHeight / 3}
              x2={130}
              y2={topViewHeight / 3}
              stroke={blueColourFromScheme}
              strokeWidth="3"
            />
            <TextSVG
              fontSize="12"
              fontWeight="normal"
              x={12}
              y={(2 * topViewHeight) / 3 + 4}
              fill={darkGreyColour}
            >
              CONSTIPATION
            </TextSVG>
            <Line
              x1={100}
              y1={(2 * topViewHeight) / 3}
              x2={150}
              y2={(2 * topViewHeight) / 3}
              stroke={blueColourFromScheme}
              strokeWidth="2"
              strokeDasharray={[3, 2]}
            />
          </Svg>
          <View
            style={{
              position: "absolute",
              bottom: 0,
              right: 6,
              backgroundColor: "rgba(190,190,190,1)",
              borderTopRightRadius: 4,
              borderTopLeftRadius: 4
            }}
          >
            <Text style={{ fontSize: 10, color: "white", margin: 3 }}>
              STRONG
            </Text>
          </View>
        </View>
        <View style={{ height: graphHeight, flexDirection: "row" }}>
          <LineChart
            style={{ flex: 1, backgroundColor: "#ffffff" }}
            data={dataDiarrhea}
            yAccessor={({ item }) => item.value}
            xAccessor={({ item }) => item.date}
            svg={{
              strokeWidth: 3,
              stroke: blueColourFromScheme
            }}
            contentInset={{ top: contentInset, bottom: contentInset }}
            curve={shape.curveCatmullRom}
            //@ts-ignore
            xMin={-0.5}
            xMax={xMax}
            yMin={0}
            yMax={100}
          >
            <CustomGrid belowChart={true} />
            <Decorator />
          </LineChart>
        </View>
        <View
          style={{
            height: graphHeight,
            flexDirection: "row",
            position: "absolute",
            width: graphWidth,
            marginTop: topViewHeight
          }}
        >
          <LineChart
            style={{ flex: 1, backgroundColor: "#ffffff00" }}
            data={this.props.dataConstipation}
            yAccessor={({ item }) => item.value}
            xAccessor={({ item }) => item.date}
            svg={{
              strokeWidth: 2,
              stroke: blueColourFromScheme,
              strokeDasharray: [3, 2]
            }}
            contentInset={{ top: contentInset, bottom: contentInset }}
            curve={shape.curveCatmullRom}
            //@ts-ignore
            xMin={-0.5}
            xMax={xMax}
            yMin={0}
            yMax={100}
          >
            <DecoratorDashed />
          </LineChart>
        </View>
        <View>
          <View
            style={{
              position: "absolute",
              top: 0,
              right: 6,
              backgroundColor: "rgba(190,190,190,1)",
              borderBottomRightRadius: 4,
              borderBottomLeftRadius: 4
            }}
          >
            <Text style={{ fontSize: 10, color: "white", margin: 3 }}>
              {this.props.intl.formatMessage({
                id: "overview.chart.label.noSymptom",
                defaultMessage: "NO SYMPTOM"
              })}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
const mapStateToProps = (state: any): StateProps => {
  return {
    selectedMonth: getBeginningOfMonthFromSelectedDay(
      state.overviews.selectedDay
    )
  };
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
  return {};
};

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(DoubleLineChart));
