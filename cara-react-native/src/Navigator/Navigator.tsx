import React from "react";
import {
  createStackNavigator,
  createSwitchNavigator,
  createBottomTabNavigator
} from "react-navigation";
import TrackingScreen from "../Tracking/TrackingScreen";
import EmailEntryScreen from "../Onboarding/EmailEntryScreen";
import HomeScreen from "../Home/HomeScreen";
import MainScreen from "../MainScreen";
import { Image, View } from "react-native";
import {
  mainSeaColour,
  darkGreyColour,
  mediumGreyColour
} from "../Utils/Constants";
import store from "../Utils/Store";
import { initTrackingActionCreator } from "../Tracking/TrackingActions";
import { getUnsavedTrackingDefaultValue } from "../Tracking/TrackingReducer";

// Dumb screen to put in place of screen for tracking in tab controller.
// This screen will never be shown, but the function createBottomTabNavigator
// expects a screen per tab button
class DumbScreen extends React.Component {
  render() {
    return <View />;
  }
}

const HomeStack = createStackNavigator(
  {
    Home: { screen: HomeScreen }
  },
  {
    initialRouteName: "Home",
    headerMode: "none"
  }
);

const BottomTab = createBottomTabNavigator(
  {
    Home: HomeStack,

    Tracking: {
      screen: DumbScreen,
      navigationOptions: {
        tabBarOnPress: ({ navigation, defaultHandler }: any) => {
          store.dispatch(
            initTrackingActionCreator(getUnsavedTrackingDefaultValue(), false)
          );
          navigation.navigate("TrackingModal");
        }
      }
    },
    Recipe: {
      screen: DumbScreen,
      navigationOptions: {
        tabBarOnPress: ({ navigation, defaultHandler }: any) => {
          alert("Feature not available in this demo");
        }
      }
    }
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        if (focused === true) {
          tintColor = mainSeaColour;
        } else {
          tintColor = darkGreyColour;
        }
        if (routeName === "Home") {
          return (
            <Image
              source={require("./NavigatorIcons/overviewsBottomIcn.png")}
              style={{
                tintColor: tintColor,
                height: 35,
                width: "100%",
                resizeMode: "contain"
              }}
            />
          );
        } else if (routeName === "Tracking") {
          return (
            <Image
              source={require("./NavigatorIcons/addTrackingBottomIcn.png")}
              style={{
                height: 35,
                width: "100%",
                resizeMode: "contain"
              }}
            />
          );
        } else {
          return (
            <Image
              source={require("./NavigatorIcons/recipesBottomIcn.png")}
              style={{
                tintColor: mediumGreyColour,
                height: 35,
                width: "100%",
                resizeMode: "contain"
              }}
            />
          );
        }
      }
    }),
    tabBarOptions: {
      activeTintColor: "mainSeaColour",
      inactiveTintColor: "gray",
      showLabel: false
    },
    lazy: false
  }
);

//How to be able to present a modal view from a bottom tab controller with react-navigation
//https://stackoverflow.com/questions/42398911/how-do-i-make-a-tabnavigator-button-push-a-modal-screen-with-react-navigation/42907868#42907868
//https://github.com/react-navigation/react-navigation/issues/1576#issuecomment-392918395
const AppStack = createStackNavigator(
  {
    TabNavigator: BottomTab,
    TrackingModal: { screen: TrackingScreen }
  },
  {
    headerMode: "none",
    mode: "modal"
  }
);

const AuthStack = createStackNavigator(
  {
    EmailEntry: { screen: EmailEntryScreen }
  },
  {
    initialRouteName: "EmailEntry",
    headerMode: "none"
  }
);

export const AppNavigator = createSwitchNavigator(
  {
    App: AppStack,
    Auth: AuthStack,
    Main: MainScreen
  },
  {
    initialRouteName: "Main"
  }
);
