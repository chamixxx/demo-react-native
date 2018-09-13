import React from "react";
import {
  View,
  StyleSheet,
  Keyboard,
  SectionList,
  FlatList,
  KeyboardAvoidingView,
  Image,
  TouchableHighlight,
  ScrollView,
  Dimensions
} from "react-native";
import FoodItem from "../../Models/FoodItem";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { Text, Button } from "native-base";
import { connect } from "react-redux";
import {
  darkGreyColour,
  mainSeaColour,
  ultraLightGreyColour,
  mediumGreyColour
} from "../../Utils/Constants";
import { SearchBar } from "react-native-elements";
import _ from "lodash";
import TrackingFoodSearchListItemView from "./TrackingFoodSearchListItemView";
import { getMealItem } from "../TrackingReducer";
import { IntlMessageContent } from "../Utils/TrackingStaticData";
const uuid = require("react-native-uuid");

interface OwnProps {
  dismiss: () => void;
  onSaveFromSearchView: (foodItems: FoodItem[]) => void;
  foodItemArray: FoodItem[];
}

interface StateProps {
  foodItems: FoodItem[];
}

interface DispatchProps {}

interface State {
  searchQuery: string;
  foodItemDataSource: {
    title: IntlMessageContent;
    data: FoodItem[];
  }[];
}

type Props = StateProps & DispatchProps & OwnProps & InjectedIntlProps;

class TrackingFoodSearchView extends React.Component<Props, State> {
  private foodItemSectionList!: FlatList<FoodItem>;

  constructor(props: Props) {
    super(props);
    this.state = {
      searchQuery: "",
      foodItemDataSource: [
        {
          title: {
            id: "addtracking.food.selectedIngredients",
            defaultMessage: "Selected ingredients"
          },
          data: [...this.props.foodItems]
        },
        {
          title: {
            id: "addtracking.food.searchResults",
            defaultMessage: "Search results"
          },
          data: this.props.foodItemArray.sort((item1, item2) => {
            if (
              item1.getLocalName().toLowerCase() <
              item2.getLocalName().toLowerCase()
            ) {
              return -1;
            }
            return 1;
          })
        }
      ]
    };
  }

  componentWillUnmount() {}

  componentDidMount() {}

  handleTouchItemSectionResult = (item: FoodItem) => {
    const index = this.state.foodItemDataSource[0].data.indexOf(item);
    if (index == -1) {
      this.setState({
        searchQuery: "",
        foodItemDataSource: [
          {
            ...this.state.foodItemDataSource[0],
            data: [...this.state.foodItemDataSource[0].data, item]
          },
          {
            title: {
              id: "addtracking.food.searchResults",
              defaultMessage: "Search results"
            },
            data: this.props.foodItemArray
          }
        ]
      });
      Keyboard.dismiss();
    } else {
      this.handleTouchItemSectionSelected(index);
    }
  };

  handleTouchItemSectionSelected = (index: number) => {
    const array = this.state.foodItemDataSource[0].data.slice(0);
    array.splice(index, 1);
    this.setState({
      foodItemDataSource: [
        {
          title: {
            id: "addtracking.food.selectedIngredients",
            defaultMessage: "Selected ingredients"
          },
          data: array
        },
        this.state.foodItemDataSource[1]
      ]
    });
  };

  compareFoodItemForSorting = (item1: FoodItem, item2: FoodItem): number => {
    let prio1 = item1.matchingPriority(this.state.searchQuery.toUpperCase());
    let prio2 = item2.matchingPriority(this.state.searchQuery.toUpperCase());
    if (prio1 == prio2) {
      if (
        item1.getLocalName().toLowerCase() < item2.getLocalName().toLowerCase()
      ) {
        return -1;
      }
    } else {
      return prio1! - prio2!;
    }
    return 1;
  };

  handleSearchQuery = (searchQuery: string) => {
    const formatedQuery = searchQuery.toUpperCase();
    let filteredData = _.filter(this.props.foodItemArray, foodItem => {
      if (foodItem.matchingSynonym(formatedQuery) != undefined) {
        return true;
      }
      return false;
    });

    filteredData.sort(this.compareFoodItemForSorting);

    this.setState({
      searchQuery: searchQuery,
      foodItemDataSource: [
        this.state.foodItemDataSource[0],
        {
          title: {
            id: "addtracking.food.searchResults",
            defaultMessage: "Search results"
          },
          data: filteredData
        }
      ]
    });
    if (this.state.foodItemDataSource[1].data.length > 0) {
      this.foodItemSectionList.scrollToIndex({ animated: false, index: 0 });
    }
  };

  renderItemFlatList = (item: FoodItem, index: number): JSX.Element => {
    return (
      <TrackingFoodSearchListItemView
        item={item}
        handleTouchItemSectionResult={this.handleTouchItemSectionResult}
        index={index}
        isSelected={this.state.foodItemDataSource[0].data.indexOf(item) != -1}
      />
    );
  };

  renderTagLisItem = (item: FoodItem, index: number): JSX.Element => {
    return (
      <TouchableHighlight
        key={uuid.v1()}
        onPress={() => this.handleTouchItemSectionSelected(index)}
        underlayColor="#ffffff00"
      >
        <View
          style={{
            backgroundColor: ultraLightGreyColour,
            borderRadius: 20,
            margin: 6,
            flexDirection: "row",
            alignItems: "center",
            height: 24
          }}
        >
          <Text
            style={{
              color: darkGreyColour,
              fontSize: 11,
              marginLeft: 8,
              marginRight: 8
            }}
          >
            {item.getLocalName()}
          </Text>
          <Image
            source={require("../Images/Common/xSmall.png")}
            style={{
              height: 10,
              aspectRatio: 1,
              margin: 8,
              resizeMode: "contain"
            }}
          />
        </View>
      </TouchableHighlight>
    );
  };

  saveFoodItems = () => {
    Keyboard.dismiss();
    this.props.onSaveFromSearchView(this.state.foodItemDataSource[0].data);
    this.props.dismiss();
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "column", width: "100%" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <Button
              style={styles.topButton}
              transparent
              onPress={this.props.dismiss}
              color="#ffffff"
            >
              <Text style={{ color: mainSeaColour }}>
                {this.props.intl.formatMessage({ id: "_common.cancel" })}
              </Text>
            </Button>
            <Button
              style={styles.topButton}
              transparent
              onPress={this.saveFoodItems}
              color="#ffffff"
            >
              <Text style={{ color: mainSeaColour }}>
                {this.props.intl.formatMessage({ id: "_common.save" })}
              </Text>
            </Button>
          </View>
          <View style={{ backgroundColor: "white" }}>
            <SearchBar
              placeholder={this.props.intl.formatMessage({
                id: "addtracking.food.ingredientsInYourDish",
                defaultMessage: "Ingredients in your dish"
              })}
              round
              lightTheme
              containerStyle={{ backgroundColor: "white" }}
              inputStyle={{ backgroundColor: ultraLightGreyColour }}
              value={this.state.searchQuery}
              onChangeText={searchQuery => this.handleSearchQuery(searchQuery)}
              //@ts-ignore
              platform="default"
            />
          </View>
        </View>

        <View
          style={{
            backgroundColor: ultraLightGreyColour,
            height: 36,
            marginBottom: 0
          }}
        >
          <Text
            style={{
              fontWeight: "400",
              marginLeft: 12,
              color: darkGreyColour,
              backgroundColor: ultraLightGreyColour,
              height: 36,
              textAlignVertical: "center"
            }}
          >
            {this.props.intl.formatMessage(
              this.state.foodItemDataSource[0].title
            )}
          </Text>
        </View>
        <View style={{ height: Dimensions.get("window").height / 7 }}>
          <ScrollView>
            <View
              style={{
                alignSelf: "flex-start",
                flexDirection: "row",
                flexWrap: "wrap",
                margin: 5,
                marginTop: -2
              }}
            >
              {this.state.foodItemDataSource[0].data.map((item, index) =>
                this.renderTagLisItem(item, index)
              )}
            </View>
          </ScrollView>
        </View>
        <View
          style={{
            backgroundColor: ultraLightGreyColour,
            height: 36,
            marginBottom: 0
          }}
        >
          <Text
            style={{
              fontWeight: "400",
              marginLeft: 12,
              color: darkGreyColour,
              backgroundColor: ultraLightGreyColour,
              height: 36,
              textAlignVertical: "center"
            }}
          >
            {this.props.intl.formatMessage(
              this.state.foodItemDataSource[1].title
            )}
          </Text>
        </View>
        <FlatList
          initialNumToRender={40}
          keyboardShouldPersistTaps="handled"
          data={this.state.foodItemDataSource[1].data}
          renderItem={({ item, index }) => this.renderItemFlatList(item, index)}
          horizontal={false}
          style={{ flex: 1 }}
          keyExtractor={(item: any, index: number) =>
            item.key + index.toString()
          }
          ref={ref => {
            this.foodItemSectionList = ref as any;
          }}
          removeClippedSubviews={true}
          onScrollBeginDrag={() => Keyboard.dismiss()}
        />
      </View>
    );
  }
}

function mapStateToProps(state: any): StateProps {
  return {
    foodItems: getMealItem(state.tracking.unsavedTracking).foodItems
  };
}

function mapDispatchToProps(dispatch: any): DispatchProps {
  return {};
}
export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(TrackingFoodSearchView));

const styles = StyleSheet.create({
  topButton: {
    margin: 0
  }
});
