import React from "react";
import TrackingData from "../Models/TrackingData";
import { View, StyleSheet, FlatList } from "react-native";
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
//@ts-ignore
import DailyOverviewCell from "./DailyOverviewCell";
import { trackingDataFromDate } from "../Tracking/Utils/TrackingDataManager";

// Interfaces and types

interface OwnProps {
  startTracking: (trackingDataToEdit: TrackingData) => void;
}

interface StateProps {
  shouldReloadOverviews: boolean;
  selectedDay: Date;
}

interface DispatchProps {
  onOverviewReload: () => void;
}

type Props = StateProps & DispatchProps & OwnProps & InjectedIntlProps;

interface State {
  //selectedDay: Date;
}

// Component class

class DailyOverview extends React.Component<Props, State> {
  private trackingFlatListView!: FlatList<TrackingData>;
  private trackingDataArray!: Realm.Results<TrackingData>;
  constructor(props: Props) {
    super(props);
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.shouldReloadOverviews === true) {
      this.props.onOverviewReload();
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (nextProps.selectedDay !== this.props.selectedDay) {
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

  getTrackingDataToDisplay = () => {
    let trackingData = trackingDataFromDate(this.props.selectedDay);
    this.trackingDataArray = trackingData;
  };

  renderOverviewItem = (item: TrackingData, index: number): JSX.Element => {
    return (
      <DailyOverviewCell
        trackingData={item}
        index={index}
        startTracking={this.props.startTracking}
      />
    );
  };

  render() {
    this.getTrackingDataToDisplay();
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={this.trackingDataArray}
          renderItem={({ item, index }) => this.renderOverviewItem(item, index)}
          horizontal={false}
          style={styles.collectionView}
          keyExtractor={(item: TrackingData, index: number) =>
            item.realmIdString
          }
          extraData={{
            shouldReloadOverview: this.props.shouldReloadOverviews,
            trackingDataArray: this.props.selectedDay
          }}
          ref={ref => {
            this.trackingFlatListView = ref as any;
          }}
        />
      </View>
    );
  }
}

const mapStateToProps = (state: any): StateProps => {
  return {
    shouldReloadOverviews: state.tracking.shouldReloadOverviews,
    selectedDay: state.overviews.selectedDay
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
)(injectIntl(DailyOverview));

const styles = StyleSheet.create({
  parentView: {
    flex: 1
  },
  collectionView: {
    flex: 1,
    marginTop: 12
  }
});
