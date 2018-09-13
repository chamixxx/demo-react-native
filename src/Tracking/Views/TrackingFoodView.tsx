import React from "react";
import { InjectedIntlProps, injectIntl } from "react-intl";
import {
  TrackingCategoryType,
  TrackingTypesEnum,
  labelFromTrackingCategoryType
} from "../Utils/TrackingUtils";
import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  Image,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Keyboard,
  Modal,
  FlatList
} from "react-native";
import { connect } from "react-redux";
import { RNCamera } from "react-native-camera";
import { getMealItem } from "../TrackingReducer";
import { updateTrackingDataFoodActionCreator } from "../TrackingActions";
import { TrackingSliderTextArray } from "../Utils/TrackingStaticData";
import {
  darkGreyColour,
  mediumGreyColour,
  mainSeaColour,
  ultraLightGreyColour
} from "../../Utils/Constants";
import TrackingFoodSearchView from "./TrackingFoodSearchView";
import FoodItem, { mapRealmFoodItemToFoodItem } from "../../Models/FoodItem";
import realm from "../../RealmDB/RealmInit";

enum CameraStateEnum {
  previewOff,
  previewOn,
  pictureTaken,
  pictureValidated
}

interface OwnProps {
  trackingCategoryType: TrackingCategoryType;
  style: any;
}

interface StateProps {
  text?: string;
  imagePath?: string;
  foodItems: FoodItem[];
}

interface DispatchProps {
  updateFoodTrackingData: (
    foodItems: FoodItem[],
    text?: string,
    imagePathTemp?: string
  ) => void;
}

interface LState {
  cameraState: CameraStateEnum;
  didPressReturnKey: boolean;
  modalVisibleSearchScreen: boolean;
}

type Props = OwnProps & StateProps & DispatchProps & InjectedIntlProps;

class TrackingFoodView extends React.Component<Props, LState> {
  private trackingType = TrackingTypesEnum.foodType;
  private camera!: RNCamera;
  private foodItemArray: FoodItem[] = realm
    .objects<FoodItem>("FoodItem")
    .filtered("deleted == false")
    .sorted("name", false)
    .map((foodItem: any) => {
      return mapRealmFoodItemToFoodItem(foodItem);
    });

  constructor(props: Props) {
    super(props);
    this.state = {
      cameraState:
        this.props.imagePath === undefined
          ? CameraStateEnum.previewOff
          : CameraStateEnum.pictureValidated,
      didPressReturnKey: false,
      modalVisibleSearchScreen: false
    };
  }

  setModalVisibleSearchScreen(visible: boolean) {
    this.setState({ modalVisibleSearchScreen: visible });
  }

  onSaveFromSearchView(foodItems: FoodItem[]) {
    this.props.updateFoodTrackingData(
      foodItems,
      this.props.text,
      this.props.imagePath
    );
  }

  takePicture = async () => {
    if (this.camera) {
      const options = {
        quality: 0.6,
        base64: true,
        cropToPreview: true,
        fixOrientation: true
      };
      const data = await this.camera.takePictureAsync(options);
      this.props.updateFoodTrackingData(
        this.props.foodItems,
        this.props.text,
        data.uri
      );
      this.setState({ cameraState: CameraStateEnum.pictureTaken });
    }
  };

  validatePicture = () => {
    this.setState({ cameraState: CameraStateEnum.pictureValidated });
  };

  onTouchCameraIcon = () => {
    if (this.state.cameraState == CameraStateEnum.pictureValidated) {
      this.setState({ cameraState: CameraStateEnum.pictureTaken });
    } else {
      this.setState({ cameraState: CameraStateEnum.previewOn });
    }
    Keyboard.dismiss();
  };

  onTouchCloseIcon = () => {
    if (this.state.cameraState == CameraStateEnum.pictureTaken) {
      this.setState({ cameraState: CameraStateEnum.previewOn });
      this.props.updateFoodTrackingData(
        this.props.foodItems,
        this.props.text,
        undefined
      );
    } else {
      this.setState({ cameraState: CameraStateEnum.previewOff });
    }
  };

  getViewFromState = (): JSX.Element => {
    const placeHolderText = this.props.intl.formatMessage(
      TrackingSliderTextArray.trackingQuestionString(this.trackingType)
    );
    const addIngredients = (
      <TouchableHighlight
        onPress={gesture => this.setModalVisibleSearchScreen(true)}
        underlayColor="#ffffff00"
        style={{ flexWrap: "wrap" }}
      >
        <View
          style={{
            backgroundColor: ultraLightGreyColour,
            borderRadius: 20,
            margin: 6,
            flexDirection: "row",
            alignItems: "center",
            height: 28,
            width: 150
          }}
        >
          <Image
            source={require("../Images/Common/addIngredient.png")}
            style={{
              height: 10,
              aspectRatio: 1,
              margin: 8,
              resizeMode: "contain"
            }}
          />
          <Text
            style={{
              color: darkGreyColour,
              fontSize: 12,
              margin: 8,
              flexWrap: "wrap"
            }}
          >
            {this.props.intl.formatMessage({
              id: "addtracking.food.addIngredients",
              defaultMessage: "Add ingredients"
            })}
          </Text>
        </View>
      </TouchableHighlight>
    );
    switch (this.state.cameraState) {
      case CameraStateEnum.previewOff:
        return (
          <View style={{ flex: 1, flexDirection: "column" }}>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={() => this.onTouchCameraIcon()}
                style={{
                  height: 38,
                  width: 38
                }}
              >
                <Image
                  source={require("../Images/Common/icnCamera.png")}
                  style={{
                    resizeMode: "contain",
                    height: 36,
                    width: 36
                  }}
                />
              </TouchableOpacity>
              <TextInput
                style={styles.textInput}
                value={this.props.text}
                editable={true}
                multiline={false}
                returnKeyType="done"
                onFocus={this.onFocus}
                onChangeText={this.onChangeText}
                onKeyPress={this.handleReturnKey}
                onEndEditing={this.onEndEditing}
                underlineColorAndroid="transparent"
                placeholder={placeHolderText}
                placeholderTextColor={mediumGreyColour}
              />
            </View>
            {addIngredients}

            <FlatList
              columnWrapperStyle={{
                flexDirection: "row",
                flexWrap: "wrap"
              }}
              data={this.props.foodItems}
              renderItem={({ item, index }) =>
                this.renderTagLisItem(item, index)
              }
              horizontal={false}
              style={{ flex: 1 }}
              keyExtractor={(item: FoodItem, index: number) =>
                item.id!.toString() + index
              }
              numColumns={6}
              extraData={this.props.foodItems}
              onScrollBeginDrag={() => Keyboard.dismiss()}
            />
          </View>
        );
      case CameraStateEnum.previewOn:
        return (
          <View
            style={{
              flex: 1,
              alignContent: "center",
              alignSelf: "center",
              marginTop: 10,
              bottom: 0
            }}
          >
            <RNCamera
              ref={(ref: RNCamera) => {
                this.camera = ref;
              }}
              style={styles.preview}
              type={RNCamera.Constants.Type.back}
              flashMode={RNCamera.Constants.FlashMode.auto}
              permissionDialogTitle={"Permission to use camera"}
              permissionDialogMessage={
                "We need your permission to use your camera phone"
              }
            >
              <TouchableHighlight
                onPress={() => this.onTouchCloseIcon()}
                underlayColor="#ffffff00"
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10
                }}
              >
                <Image
                  source={require("../Images/Common/icnCloseCameraWindow.png")}
                  style={{
                    resizeMode: "contain",
                    height: 20,
                    width: 20
                  }}
                />
              </TouchableHighlight>
            </RNCamera>
            <View
              style={{
                flex: 0,
                flexDirection: "row",
                justifyContent: "center"
              }}
            >
              <TouchableOpacity
                onPress={this.takePicture.bind(this)}
                style={styles.capture}
              >
                <Image
                  source={require("../Images/Common/snapIcon.png")}
                  style={{
                    tintColor: mainSeaColour,
                    resizeMode: "contain",
                    height: 45,
                    width: 45
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        );

      case CameraStateEnum.pictureTaken:
        return (
          <View
            style={{
              flex: 1,
              alignContent: "center",
              alignSelf: "center",
              marginTop: 10
            }}
          >
            <ImageBackground
              source={{ uri: this.props.imagePath! }}
              style={styles.preview}
            >
              <TouchableHighlight
                onPress={() => this.onTouchCloseIcon()}
                underlayColor="#ffffff00"
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10
                }}
              >
                <Image
                  source={require("../Images/Common/icnCloseCameraWindow.png")}
                  style={{
                    resizeMode: "contain",
                    height: 20,
                    width: 20
                  }}
                />
              </TouchableHighlight>
            </ImageBackground>
            <View
              style={{
                flex: 0,
                flexDirection: "row",
                justifyContent: "center"
              }}
            >
              <TouchableOpacity
                onPress={this.validatePicture.bind(this)}
                style={styles.save}
              >
                {
                  <Image
                    source={require("../Images/Common/btnSavePhoto_en.png")}
                    style={{
                      tintColor: mainSeaColour,
                      resizeMode: "contain",
                      height: 45,
                      width: 80
                    }}
                  />
                }
              </TouchableOpacity>
            </View>
          </View>
        );
      case CameraStateEnum.pictureValidated:
        return (
          <View style={{ flex: 1, flexDirection: "column" }}>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={() => this.onTouchCameraIcon()}
                style={{
                  height: 38,
                  width: 38
                }}
              >
                <Image
                  source={{ uri: this.props.imagePath! }}
                  style={{
                    resizeMode: "cover",
                    height: 36,
                    width: 36,
                    borderRadius: 18
                  }}
                />
              </TouchableOpacity>
              <TextInput
                style={styles.textInput}
                value={this.props.text}
                editable={true}
                multiline={false}
                returnKeyType="done"
                onFocus={this.onFocus}
                onChangeText={this.onChangeText}
                onKeyPress={this.handleReturnKey}
                onEndEditing={this.onEndEditing}
                underlineColorAndroid="transparent"
                placeholder={placeHolderText}
                placeholderTextColor={mediumGreyColour}
              />
            </View>
            {addIngredients}
            <FlatList
              columnWrapperStyle={{
                flexDirection: "row",
                flexWrap: "wrap"
              }}
              data={this.props.foodItems}
              renderItem={({ item, index }) =>
                this.renderTagLisItem(item, index)
              }
              horizontal={false}
              style={{ flex: 1 }}
              keyExtractor={(item: FoodItem, index: number) =>
                item.id!.toString() + index
              }
              numColumns={6}
              extraData={this.props.foodItems}
            />
          </View>
        );
    }
  };

  onFocus = () => {
    if (this.props.text === undefined) {
      this.props.updateFoodTrackingData(
        this.props.foodItems,
        "",
        this.props.imagePath
      );
    }
  };

  onEndEditing = () => {
    if (this.props.text === "") {
      this.props.updateFoodTrackingData(
        this.props.foodItems,
        undefined,
        this.props.imagePath
      );
    }
  };

  onChangeText = (text: string) => {
    if (this.state.didPressReturnKey === false) {
      this.props.updateFoodTrackingData(
        this.props.foodItems,
        text,
        this.props.imagePath
      );
    }
  };

  handleReturnKey = (keyboardEvent: { nativeEvent: { key: string } }) => {
    if (keyboardEvent.nativeEvent.key === "Enter") {
      Keyboard.dismiss();
      this.setState({ didPressReturnKey: true });
    } else {
      this.setState({ didPressReturnKey: false });
    }
  };

  handleTouchTagItem = (index: number) => {
    let selectedFoodItems = this.props.foodItems;
    selectedFoodItems.splice(index, 1);
    this.props.updateFoodTrackingData(
      selectedFoodItems,
      this.props.text,
      this.props.imagePath
    );
  };

  renderTagLisItem = (item: FoodItem, index: number): JSX.Element => {
    return (
      <TouchableHighlight
        onPress={() => this.handleTouchTagItem(index)}
        underlayColor="#ffffff00"
      >
        <View
          style={{
            backgroundColor: ultraLightGreyColour,
            borderRadius: 20,
            margin: 3,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            height: 28
          }}
        >
          <Text
            style={{
              color: darkGreyColour,
              fontSize: 12,
              marginLeft: 8
            }}
          >
            {item.name}
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

  render() {
    const { trackingCategoryType } = this.props;
    const titleLabel = labelFromTrackingCategoryType(trackingCategoryType);
    const containerStyle = {
      ...StyleSheet.flatten(styles.containerView),
      ...this.props.style
    };

    return (
      <View style={containerStyle}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisibleSearchScreen}
          onRequestClose={() => {}}
        >
          <TrackingFoodSearchView
            dismiss={() => {
              this.setModalVisibleSearchScreen(
                !this.state.modalVisibleSearchScreen
              );
            }}
            onSaveFromSearchView={this.onSaveFromSearchView.bind(this)}
            foodItemArray={this.foodItemArray}
          />
        </Modal>

        <Text style={styles.titleLabel}>
          {this.props.intl.formatMessage(titleLabel)}
        </Text>

        {this.getViewFromState()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerView: {
    flex: 1
  },
  titleLabel: {
    textAlign: "center",
    color: darkGreyColour,
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 20
  },
  preview: {
    width: "100%",
    aspectRatio: 16 / 9,
    justifyContent: "flex-end",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden"
  },
  capture: {
    alignSelf: "center",
    height: 45,
    width: 45,
    marginTop: 12
  },
  save: {
    alignSelf: "center",
    height: 45,
    width: 80,
    marginTop: 12
  },
  textInput: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    color: darkGreyColour,
    fontSize: 14,
    borderRadius: 10,
    padding: 12,
    textAlignVertical: "top",
    height: 40
  }
});

function mapStateToProps(state: any): StateProps {
  return {
    text: getMealItem(state.tracking.unsavedTracking).name,
    imagePath: getMealItem(state.tracking.unsavedTracking).imagePathTemp,
    foodItems: getMealItem(state.tracking.unsavedTracking).foodItems
  };
}

function mapDispatchToProps(dispatch: any): DispatchProps {
  return {
    updateFoodTrackingData: (
      foodItems: FoodItem[],
      text?: string,
      imagePathTemp?: string
    ) => {
      dispatch(
        updateTrackingDataFoodActionCreator(foodItems, text, imagePathTemp)
      );
    }
  };
}

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(TrackingFoodView));
