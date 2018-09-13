import React from "react";
import { BarChart } from "react-native-svg-charts";
import { View, Text, Dimensions } from "react-native";
import { Line, G } from "react-native-svg";
import { blueColourFromScheme } from "../../Utils/Constants";
import {
  TrackingType,
  labelFromTrackingType,
  TrackingTypesEnum
} from "../../Tracking/Utils/TrackingUtils";
import { InjectedIntlProps, injectIntl } from "react-intl";
import {
  bottomLabelForChartFromTrackingType,
  topLabelForChartFromTrackingType
} from "../OverviewsUtils";

interface OwnProps {
  barData: {
    value: number;
    date: number;
  }[];
  trackingType: TrackingType;
}

class SimpleBarChart extends React.PureComponent<OwnProps & InjectedIntlProps> {
  render() {
    let yMax = 112.5;
    if (this.props.trackingType == TrackingTypesEnum.waterType) {
      yMax = Math.max(
        ...this.props.barData.map(
          (element: { value: number; date: number }) => {
            return element.value;
          }
        )
      );
      if (yMax == 0) {
        yMax = 1;
      }
    }
    const yAxisData = [
      0,
      yMax / 5,
      (2 * yMax) / 5,
      (3 * yMax) / 5,
      (4 * yMax) / 5,
      yMax
    ];

    const CustomGrid = ({ x, y, data, ticks }: any) => (
      <G>
        {// Horizontal grid
        yAxisData.map((tick: any) => {
          if (tick == 0 || tick == yMax) {
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
      </G>
    );
    const sideMargin = 12;
    const graphWidth = Dimensions.get("window").width - sideMargin * 2;
    const graphHeight = graphWidth * 0.4;
    const topViewHeight: number = (graphHeight / 5) * 2;
    let data = this.props.barData;

    let topLabel = yMax.toString();

    if (this.props.trackingType != TrackingTypesEnum.waterType) {
      topLabel = this.props.intl.formatMessage(
        topLabelForChartFromTrackingType(this.props.trackingType)!
      );
    }

    if (data.length == 0) {
      data = [
        {
          value: 0,
          date: 0
        }
      ];
      yMax = 5;
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
              bottom: -2,
              right: 6,
              backgroundColor: "rgba(190,190,190,1)",
              borderTopRightRadius: 4,
              borderTopLeftRadius: 4
            }}
          >
            <Text style={{ fontSize: 10, color: "white", margin: 3 }}>
              {topLabel}
            </Text>
          </View>
        </View>
        <View style={{ height: graphHeight, flexDirection: "row" }}>
          <BarChart
            style={{ flex: 1, backgroundColor: "#ffffff" }}
            data={data}
            yAccessor={({ item }) => item.value}
            xAccessor={({ item }) => item.date}
            svg={{
              fill: blueColourFromScheme
            }}
            contentInset={{ top: 1, bottom: 1, left: 2, right: 2 }}
            spacingInner={0.5}
            //@ts-ignore
            xMin={-0.5}
            xMax={6.5}
            yMin={0}
            yMax={yMax}
          >
            <CustomGrid belowChart={true} />
          </BarChart>
        </View>
        <View>
          <View
            style={{
              position: "absolute",
              top: -0.5,
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
export default injectIntl(SimpleBarChart);
