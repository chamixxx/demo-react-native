import React from "react";
import { getChangeOverTimeForDate } from "../Tracking/Utils/TrackingUtils";
import TrackingData from "../Models/TrackingData";
import Moment from "moment";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Platform,
  TouchableHighlight
} from "react-native";
import { injectIntl, InjectedIntlProps } from "react-intl";
import { mainSeaColour } from "../Utils/Constants";
import { showShareYourDataAlert, showResultAlert } from "../Profile/DataExport";
import { connect } from "react-redux";
import { RequestError } from "../Utils/Store";
import {
  requestExportLinkActionCreator,
  postMetadataActionCreator
} from "../Auth/AuthActions";
//@ts-ignore
import DatePicker from "react-native-datepicker";
import { updateSelectedDayActionCreator } from "./OverviewsActions";
import DailyOverview from "./DailyOverview";
import WeeklyOverview from "./WeeklyOverview";
import {
  TrackingCategoryElement,
  trackingCategoryElementListFull
} from "../Tracking/Utils/TrackingCategoriesManager";
//@ts-ignore
import SegmentedControlTab from "react-native-segmented-control-tab";
import MonthlyOverview from "./MonthlyOverview";

// Interfaces and types

export enum OverviewsEnum {
  daily = "daily",
  weekly = "weekly",
  monthly = "monthly"
}

interface OwnProps {
  startTracking: (trackingDataToEdit: TrackingData) => void;
}

interface StateProps {
  isFetchingExportToken: boolean;
  exportTokenError: RequestError;
  selectedDay: Date;
}

interface DispatchProps {
  requestToken: (isPersonal: boolean) => void;
  postMetadata: () => void;
  updateSelectedDay: (selectedDay: Date) => void;
}

type Props = StateProps & DispatchProps & OwnProps & InjectedIntlProps;

interface State {
  selectedOverviews: OverviewsEnum;
  selectedSegmentedIndex: number;
}

// Component class

class TrackingOverviews extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedOverviews: OverviewsEnum.daily,
      selectedSegmentedIndex: 0
    };
    this.props.updateSelectedDay(getChangeOverTimeForDate(new Date()));
  }

  componentDidMount() {}

  componentWillReceiveProps(newProps: Props) {
    if (
      this.props.isFetchingExportToken === true &&
      newProps.isFetchingExportToken === false
    ) {
      showResultAlert(this.props.intl, this.props.exportTokenError);
      this.props.postMetadata();
    }
  }

  onTouchShareButton = () => {
    showShareYourDataAlert(this.props.intl, this.props.requestToken);
  };

  onTouchOverviewTitle = (index: number) => {
    switch (index) {
      case 0:
        this.setState({
          selectedOverviews: OverviewsEnum.daily,
          selectedSegmentedIndex: index
        });
        break;
      case 1:
        this.setState({
          selectedOverviews: OverviewsEnum.weekly,
          selectedSegmentedIndex: index
        });
        break;
      case 2:
        this.setState({
          selectedOverviews: OverviewsEnum.monthly,
          selectedSegmentedIndex: index
        });
        break;

      default:
        break;
    }
  };

  onDateChange = (date: Date, dateTime: Date) => {
    this.props.updateSelectedDay(getChangeOverTimeForDate(dateTime));
  };

  onTouchNextButton = () => {
    let dayFactor = 1;
    switch (this.state.selectedOverviews) {
      case OverviewsEnum.daily:
        break;
      case OverviewsEnum.weekly:
        dayFactor = 7;
        break;
      case OverviewsEnum.monthly:
        dayFactor = Moment(this.props.selectedDay).daysInMonth();
        break;
      default:
        break;
    }
    if (this.isNextButtonEnabled()) {
      this.props.updateSelectedDay(
        new Date(
          getChangeOverTimeForDate(this.props.selectedDay).setHours(
            dayFactor * 24
          )
        )
      );
    }
  };

  onTouchPreviousButton = () => {
    let dayFactor = 1;
    switch (this.state.selectedOverviews) {
      case OverviewsEnum.daily:
        break;
      case OverviewsEnum.weekly:
        dayFactor = 7;
        break;
      case OverviewsEnum.monthly:
        dayFactor = Moment(this.props.selectedDay)
          .subtract(1, "months")
          .daysInMonth();
        break;
      default:
        break;
    }
    this.props.updateSelectedDay(
      new Date(
        getChangeOverTimeForDate(this.props.selectedDay).setHours(
          getChangeOverTimeForDate(this.props.selectedDay).getHours() -
            dayFactor * 24
        )
      )
    );
  };

  isNextButtonEnabled = (): boolean => {
    const dayAfter = getChangeOverTimeForDate(this.props.selectedDay).setHours(
      getChangeOverTimeForDate(this.props.selectedDay).getHours() + 24
    );
    const today = getChangeOverTimeForDate(new Date()).getTime();
    const timeDifference = today - dayAfter;
    if (timeDifference >= 0) {
      return true;
    }
    return false;
  };

  getOverviewToDisplay = (): JSX.Element => {
    switch (this.state.selectedOverviews) {
      case OverviewsEnum.daily:
        return <DailyOverview startTracking={this.props.startTracking} />;
      case OverviewsEnum.weekly:
        return <WeeklyOverview />;
      case OverviewsEnum.monthly:
        return <MonthlyOverview />;
      default:
        return <View />;
    }
  };

  getTitleToDisplay = (): JSX.Element => {
    const weeklyTitle = this.props.intl.formatMessage({
      id: "overview.week",
      defaultMessage: "Week"
    });

    const dailyTitle = this.props.intl.formatMessage({
      id: "overview.day",
      defaultMessage: "Day"
    });

    const MonthlyTitle = this.props.intl.formatMessage({
      id: "overview.month",
      defaultMessage: "Month"
    });

    return (
      <View style={{ flexDirection: "column" }}>
        <Text style={styles.title}>
          {this.props.intl.formatMessage({
            id: "overview.overviewTitle",
            defaultMessage: "Overviews"
          })}
        </Text>
        <SegmentedControlTab
          tabsContainerStyle={{
            height: 26,
            width: 250,
            alignSelf: "center"
          }}
          tabStyle={{ borderColor: "white", borderWidth: 2 }}
          activeTabStyle={{ backgroundColor: mainSeaColour }}
          tabTextStyle={{ color: mainSeaColour, fontWeight: "bold" }}
          values={[dailyTitle, weeklyTitle, MonthlyTitle]}
          selectedIndex={this.state.selectedSegmentedIndex}
          onTabPress={this.onTouchOverviewTitle}
        />
      </View>
    );
  };

  getDateToDisplay = (): JSX.Element => {
    let dateToDisplay = this.props.selectedDay;
    switch (this.state.selectedOverviews) {
      case OverviewsEnum.daily:
        return (
          <Text style={styles.dateDaily}>
            {Moment(dateToDisplay).format("LL")}
          </Text>
        );
      case OverviewsEnum.weekly:
        dateToDisplay = Moment(dateToDisplay)
          .startOf("isoWeek")
          .toDate();
        return (
          <Text style={styles.dateWeekly}>
            {Moment(dateToDisplay).format("LL")} -{" "}
            {Moment(
              new Date(dateToDisplay).setHours(
                dateToDisplay.getHours() + 24 * 6
              )
            ).format("LL")}
          </Text>
        );
      case OverviewsEnum.monthly:
        dateToDisplay = Moment(dateToDisplay)
          .startOf("month")
          .toDate();
        return (
          <Text style={styles.dateWeekly}>
            {Moment(dateToDisplay).format("L")} -{" "}
            {Moment(dateToDisplay)
              .endOf("month")
              .format("L")}
          </Text>
        );
      default:
        return <View />;
    }
  };

  render() {
    let nextButtonEnabled = this.isNextButtonEnabled();
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <Image
          style={styles.backGroundImage}
          source={require("../Tracking/Images/Common/bodyGradient.png")}
        />
        <View style={styles.header}>
          <View style={styles.topBar}>
            <View
              style={{
                width: 36,
                aspectRatio: 1,
                marginLeft: 9
              }}
            />
            {this.getTitleToDisplay()}
            <TouchableHighlight
              onPress={() => this.onTouchShareButton()}
              underlayColor="#ffffff00"
            >
              <Image
                source={require("./Images/icnShare.png")}
                style={{
                  width: 36,
                  aspectRatio: 1,
                  marginRight: 9
                }}
              />
            </TouchableHighlight>
          </View>
          <View style={styles.pickerContainer}>
            <TouchableHighlight
              onPress={() => this.onTouchPreviousButton()}
              underlayColor="#ffffff00"
            >
              <Image
                source={require("./Images/arrowPreviousDatePicker.png")}
                style={styles.arrowButton}
              />
            </TouchableHighlight>
            <DatePicker
              style={{
                flex: 1,
                alignSelf: "center",
                marginTop: -5
              }}
              date={this.props.selectedDay}
              mode="date"
              androidMode="calendar"
              placeholder="select date"
              format="YYYY-MM-DD"
              maxDate={new Date()}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              hideText={true}
              iconComponent={this.getDateToDisplay()}
              onDateChange={this.onDateChange}
            />
            <TouchableHighlight
              onPress={() => this.onTouchNextButton()}
              underlayColor="#ffffff00"
            >
              <Image
                source={require("./Images/arrowNextDatePicker.png")}
                style={[
                  styles.arrowButton,
                  {
                    tintColor:
                      nextButtonEnabled === true ? "#ffffff" : "#ffffff80"
                  }
                ]}
              />
            </TouchableHighlight>
          </View>
        </View>
        <View style={{ flex: 1, marginTop: 8 }}>
          {this.getOverviewToDisplay()}
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state: any): StateProps => {
  return {
    isFetchingExportToken: state.auth.isFetchingExportToken,
    exportTokenError: state.auth.exportTokenError,
    selectedDay: state.overviews.selectedDay
  };
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
  return {
    requestToken: (isPersonal: boolean) => {
      dispatch(requestExportLinkActionCreator(isPersonal));
    },
    postMetadata: () => {
      dispatch(postMetadataActionCreator());
    },
    updateSelectedDay: (selectedDay: Date) => {
      dispatch(updateSelectedDayActionCreator(selectedDay));
    }
  };
};

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(TrackingOverviews));

const styles = StyleSheet.create({
  parentView: {
    flex: 1
  },
  backGroundImage: {
    width: "100%",
    height: 358,
    position: "absolute",
    top: 0
  },
  arrowButton: {
    width: 44,
    resizeMode: "contain",
    aspectRatio: 1,
    marginRight: 18,
    marginLeft: 18,
    marginTop: 3
  },
  header: {
    height: 90,
    flexDirection: "column"
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10
  },
  topBar: {
    width: "100%",
    marginTop: Platform.OS === "ios" ? 28 : 18,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  title: {
    alignSelf: "center",
    color: "white",
    fontSize: 17.5,
    fontWeight: "bold",
    marginBottom: 4
  },
  dateDaily: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  },
  dateWeekly: {
    color: "white",
    fontSize: 14.5,
    fontWeight: "bold"
  }
});
