import React from "react";
import { LineChart } from "react-native-svg-charts";
import * as shape from "d3-shape";

import { View, Dimensions, Text } from "react-native";
import { Line, G, Rect, Text as TextSvg } from "react-native-svg";
import { blueColourFromScheme } from "../../Utils/Constants";
import TrackingData, {
  mapRealmTrackingDataToTrackingData
} from "../../Models/TrackingData";
import {
  TrackingType,
  labelFromTrackingType
} from "../../Tracking/Utils/TrackingUtils";
import { injectIntl, InjectedIntlProps } from "react-intl";
import Moment from "moment";
import { getBeginningOfMonthFromSelectedDay } from "../MonthlyOverview";
import { connect } from "react-redux";
import {
  bottomLabelForChartFromTrackingType,
  topLabelForChartFromTrackingType
} from "../OverviewsUtils";

interface OwnProps {
  lineData: {
    value: number;
    date: number;
  }[];
  trackingType: TrackingType;
}

interface StateProps {
  selectedMonth: Date;
}

interface DispatchProps {}

type Props = StateProps & DispatchProps & OwnProps & InjectedIntlProps;

class SimpleLineMonthlyChart extends React.PureComponent<Props, any> {
  render() {
    let xAxisData: number[] = [];
    for (let index = 0.5; index < 30; index++) {
      xAxisData.push(index);
    }
    const yAxisData = [-12.5, 12.5, 37.5, 62.5, 87.5, 112.5];

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
          if ((elem + 0.5) % 5 == 0) {
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
        })}
      </G>
    );

    const sideMargin = 12;
    const graphWidth = Dimensions.get("window").width - sideMargin * 2;
    const graphHeight = graphWidth * 0.4;
    const contentInset = graphHeight / 10 + 0.5;
    const topViewHeight: number = (graphHeight / 5) * 2;
    let data = this.props.lineData;
    if (data.length == 0) {
      data = [{ value: 1000, date: 0 }];
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
          <Text style={{ marginLeft: 8 }}>
            {this.props.intl.formatMessage(
              labelFromTrackingType(this.props.trackingType)
            )}
          </Text>
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
              {this.props.intl.formatMessage(
                topLabelForChartFromTrackingType(this.props.trackingType)!
              )}
            </Text>
          </View>
        </View>
        <View style={{ height: graphHeight, flexDirection: "row" }}>
          <LineChart
            style={{ flex: 1, backgroundColor: "#ffffff" }}
            data={data}
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
            xMax={30.5}
            yMin={0}
            yMax={100}
          >
            <CustomGrid belowChart={true} />
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
              {this.props.intl.formatMessage(
                bottomLabelForChartFromTrackingType(this.props.trackingType)!
              )}
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
)(injectIntl(SimpleLineMonthlyChart));
