import React from "react";
import { LineChart, YAxis } from "react-native-svg-charts";
import * as shape from "d3-shape";

import { View, Dimensions, Text } from "react-native";
import { Circle, Line, G, Rect, Text as TextSvg } from "react-native-svg";
import { blueColourFromScheme, darkGreyColour } from "../../Utils/Constants";
import TrackingData, {
  mapRealmTrackingDataToTrackingData
} from "../../Models/TrackingData";
import {
  TrackingType,
  labelFromTrackingType
} from "../../Tracking/Utils/TrackingUtils";
import { InjectedIntl, injectIntl, InjectedIntlProps } from "react-intl";
import {
  topLabelForChartFromTrackingType,
  bottomLabelForChartFromTrackingType
} from "../OverviewsUtils";

interface OwnProps {
  barData: {
    value: number;
    date: number;
  }[][];
  lineData: {
    value: number;
    date: number;
  }[];
  trackingType: TrackingType;
}

class CombinedLineBarChart extends React.PureComponent<
  OwnProps & InjectedIntlProps
> {
  render() {
    const xAxisData = [-0.5, 0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5];
    const yAxisData = [-12.5, 12.5, 37.5, 62.5, 87.5, 112.5];

    const Decorator = ({ x, y, data }: any) => {
      return data.map((item: any) => (
        <Circle
          key={item.date}
          cx={x(item.date)}
          cy={y(item.value)}
          r={5}
          stroke={blueColourFromScheme}
          strokeWidth={3}
          fill={"white"}
        />
      ));
    };

    const CustomGrid = ({ x, y, data, ticks }: any) => (
      <G>
        {// Horizontal grid
        yAxisData.map((tick: any) => {
          if (tick == -12.5 || tick == 112.5) {
            return (
              <Line
                key={tick}
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
              key={tick}
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
          return (
            <Line
              key={elem}
              y1={y(-12.5)}
              y2={y(112.5)}
              x1={x(elem)}
              x2={x(elem)}
              stroke={"rgba(190,190,190,0.5)"}
              strokeDasharray={[3, 2]}
              strokeWidth={1}
            />
          );
        })}
      </G>
    );

    const BarDataView = ({ x, y, data, ticks }: any) => (
      <G>
        {this.props.barData.map((elem: any[], index: number) => {
          const numberOfPoint = elem.length;
          return elem.map((trackingPoint: any, index: number) => {
            const coefSpacing = 0.05;
            const xComputedValue =
              trackingPoint.date -
              coefSpacing * (numberOfPoint - 1) +
              index * coefSpacing * 2;
            return (
              <Line
                key={index}
                y1={y(-12.5)}
                y2={y(trackingPoint.value)}
                x1={x(xComputedValue)}
                x2={x(xComputedValue)}
                stroke={"rgba(27, 88, 237, 0.4)"}
                strokeWidth={3}
              />
            );
          });
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

        <View
          style={{
            height: graphHeight,
            flexDirection: "row",
            overflow: "visible"
          }}
        >
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
            xMax={6.5}
            yMin={0}
            yMax={100}
          >
            <CustomGrid belowChart={true} />
            <BarDataView belowChart={true} />
            <Decorator />
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
export default injectIntl(CombinedLineBarChart);
