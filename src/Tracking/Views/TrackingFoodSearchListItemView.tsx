import React from "react";
import { Image } from "react-native";
import {
  ListItem,
  Left,
  Thumbnail,
  Body,
  Text,
  Button,
  Right
} from "native-base";
import RNFetchBlob from "react-native-fetch-blob";
import FoodItem from "../../Models/FoodItem";
import {
  darkGreyColour,
  ultraLightGreyColour,
  carrotRedColour
} from "../../Utils/Constants";

interface OwnProps {
  item: FoodItem;
  handleTouchItemSectionResult: (item: FoodItem) => void;
  index: number;
  isSelected: boolean;
}

export default class TrackingFoodSearchListItemView extends React.PureComponent<
  OwnProps,
  any
> {
  private cellHeight: number = 50;

  render() {
    let item;
    let textColor = darkGreyColour;
    let image = require("./../Images/Common/icnAddIngredient.png");
    if (this.props.isSelected) {
      textColor = carrotRedColour;
      image = require("./../Images/Common/icnRemoveIngredient.png");
    }
    item = (
      <ListItem
        avatar
        style={{ height: this.cellHeight }}
        onPress={() => this.props.handleTouchItemSectionResult(this.props.item)}
      >
        <Left>
          <Thumbnail
            source={{
              uri:
                "file://" +
                RNFetchBlob.fs.dirs.DocumentDir +
                "/" +
                this.props.item.imageUrl
            }}
            style={{
              height: this.cellHeight - 12,
              width: this.cellHeight - 12
            }}
          />
        </Left>
        <Body>
          <Text style={{ color: textColor }}>
            {this.props.item.getLocalName()}
          </Text>
        </Body>
        <Right
          style={{
            height: 48,
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "center"
          }}
        >
          <Image
            source={image}
            style={{
              height: 16,
              width: 16
            }}
          />
        </Right>
      </ListItem>
    );
    return item;
  }
}
