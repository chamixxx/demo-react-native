import React from "react";
import {
  TouchableWithoutFeedback,
  Image,
  View,
  StyleSheet
} from "react-native";
import { mainSeaColour } from "../../Utils/Constants";
//@ts-ignore
import DatePicker from "react-native-datepicker";

interface OwnProps {
  style?: any;
  updateTrackingTimeStamp: (timestamp: Date) => void;
  startDate?: Date;
}

interface LState {
  expanded: boolean;
  timestamp: Date;
}

class DatePickerComponent extends React.Component<OwnProps, LState> {
  private datePicker: DatePicker;

  constructor(props: OwnProps) {
    super(props);

    this.state = {
      expanded: false,
      timestamp:
        this.props.startDate === undefined ? new Date() : this.props.startDate
    };
  }

  onPress = () => {
    this.setState({ expanded: true });
    this.datePicker.onPressDate();
  };

  onDateChange = (date: Date, dateTime: Date) => {
    this.setState({ timestamp: dateTime });
    this.props.updateTrackingTimeStamp(this.state.timestamp);
    this.setState({ expanded: false });
  };

  render() {
    const clockBackgroundColor = this.state.expanded
      ? "#F5FCFF"
      : mainSeaColour;
    const clockTintColor = this.state.expanded ? mainSeaColour : "#F5FCFF";
    return (
      <View style={styles.containerStyle}>
        <DatePicker
          style={styles.clockImageBackground}
          date={this.state.timestamp}
          mode="datetime"
          androidMode="spinner"
          placeholder="select date"
          format="YYYY-MM-DD"
          iconComponent={
            <TouchableWithoutFeedback onPress={this.onPress}>
              <View
                style={[
                  styles.clockImageBackground,
                  {
                    borderRadius: 15,
                    overflow: "hidden",
                    backgroundColor: clockBackgroundColor
                  }
                ]}
              >
                <Image
                  source={require("../Images/Common/iCNClockWhite.png")}
                  style={[
                    styles.clockImage,
                    {
                      tintColor: clockTintColor
                    }
                  ]}
                />
              </View>
            </TouchableWithoutFeedback>
          }
          maxDate={new Date()}
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          onCloseModal={() => {
            this.setState({ expanded: false });
          }}
          hideText={true}
          ref={(picker: DatePicker) => {
            this.datePicker = picker;
          }}
          onDateChange={this.onDateChange}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    position: "absolute",
    top: 48,
    paddingHorizontal: 9,
    width: "100%"
  },
  datePickerMenu: {
    backgroundColor: "#F5FCFF",
    position: "absolute",
    top: 11,
    alignSelf: "center",
    width: "100%",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.7,
    shadowRadius: 4.5,
    elevation: 6
  },
  clockImage: {
    resizeMode: "contain",
    height: 22,
    width: 22,
    alignSelf: "center"
  },
  clockImageBackground: {
    height: 30,
    width: 30,
    alignSelf: "center",
    justifyContent: "center"
  },
  buttonsView: {
    flexDirection: "row"
  }
});

export default DatePickerComponent;
