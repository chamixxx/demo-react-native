import React from "react";
import {
  View,
  Dimensions,
  FlatList,
  Image,
  TouchableHighlight,
  StyleSheet
} from "react-native";
import { TrackingType } from "../../Tracking/Utils/TrackingUtils";
import {
  iconOverviewPickerActiveFromTrackingType,
  iconOverviewPickerInactiveFromTrackingType
} from "../../Tracking/Utils/TrackingStaticData";
import { OverviewsEnum } from "../TrackingOverviews";
import { updateSelectedTrackingTypeActionCreator } from "../OverviewsActions";
import { connect } from "react-redux";

interface OwnProps {
  pickerDataSource: TrackingType[];
  overviewType: OverviewsEnum;
  selectedTrackingType: TrackingType;
}

interface StateProps {}

interface DispatchProps {
  selectTrackingType: (
    trackingType: TrackingType,
    overviewType: OverviewsEnum
  ) => void;
}

type Props = StateProps & DispatchProps & OwnProps;

interface State {
  selectedTrackingTypeIndex: number;
  previousSelectedTrackingTypeIndex: number;
}

class TrackingTypePicker extends React.Component<Props, State> {
  private categoryPickerFlatList!: FlatList<TrackingType>;

  constructor(props: any) {
    super(props);
    this.state = {
      previousSelectedTrackingTypeIndex: this.props.pickerDataSource.indexOf(
        this.props.selectedTrackingType
      ),
      selectedTrackingTypeIndex: this.props.pickerDataSource.indexOf(
        this.props.selectedTrackingType
      )
    };
  }
  pickerRatio = 105;

  renderPickerItem = (item: TrackingType, index: number): JSX.Element => {
    let iconSource = iconOverviewPickerInactiveFromTrackingType(item);
    if (index == this.state.selectedTrackingTypeIndex) {
      iconSource = iconOverviewPickerActiveFromTrackingType(item);
    }

    return (
      <View style={styles.listItem}>
        <TouchableHighlight
          onPress={() => this.handleTrackingPickerClick(index)}
          underlayColor="#ffffff00"
        >
          <Image
            source={iconSource}
            style={{
              width:
                (Dimensions.get("window").width * 16) / this.pickerRatio - 15,
              height:
                (Dimensions.get("window").width * 16) / this.pickerRatio - 15
            }}
          />
        </TouchableHighlight>
      </View>
    );
  };

  handleTrackingPickerClick = (index: number) => {
    this.setState({
      previousSelectedTrackingTypeIndex: this.state.selectedTrackingTypeIndex
    });
    this.setState({ selectedTrackingTypeIndex: index });
    this.props.selectTrackingType(
      this.props.pickerDataSource[index],
      this.props.overviewType
    );
    this.categoryPickerFlatList.scrollToIndex({
      animated: true,
      index: index,
      viewPosition: 0.5
    });
  };
  render() {
    return (
      <View
        style={{
          height:
            ((Dimensions.get("window").width * 16) / this.pickerRatio) * 0.8,
          backgroundColor: "#FFFFFF00"
        }}
      >
        <FlatList
          data={this.props.pickerDataSource}
          renderItem={({ item, index }) => this.renderPickerItem(item, index)}
          horizontal={true}
          style={styles.pickerView}
          contentContainerStyle={{ backgroundColor: "#FFFFFF00" }}
          keyExtractor={(item: TrackingType, index: number) => item}
          extraData={{
            selectedTrackingIndex: this.state.selectedTrackingTypeIndex
          }}
          ref={ref => {
            this.categoryPickerFlatList = ref as any;
          }}
        />
      </View>
    );
  }
}

const mapStateToProps = (state: any): StateProps => {
  return {};
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
  return {
    selectTrackingType: (
      trackingType: TrackingType,
      overviewType: OverviewsEnum
    ) => {
      dispatch(
        updateSelectedTrackingTypeActionCreator(trackingType, overviewType)
      );
    }
  };
};

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(TrackingTypePicker);

const styles = StyleSheet.create({
  pickerView: {
    height: (Dimensions.get("window").width * 16) / 100,
    backgroundColor: "#FFFFFF00"
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
    backgroundColor: "#FFFFFF00"
  }
});
