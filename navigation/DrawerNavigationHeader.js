import React, { useContext } from "react";
import { HStack, View, Text } from "native-base";
import Icon from "react-native-vector-icons/AntDesign";
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";
import { Dimensions, StyleSheet, TouchableHighlight, TouchableOpacity } from "react-native";
import { ProductFilterModalContext, CartContext } from "../app_contexts/AppContext";
import { useRoute } from "@react-navigation/native";


function DrawerNavigationHeader(props) {
  const [cartItemsCount, setCartItemsCount] = useContext(CartContext);
  const [isModalVisibleProducts, setIsModalVisibleProducts] = useContext(ProductFilterModalContext);

  const route = useRoute();
  // console.log(route.name);


  const navigator = props.data.navigator;
  // console.log(navigator.getState())
  const gotToCart = () => {
    // if (navigator.getState().routes[1].name !== 'Cart') {
    //    console.log('djdjdjdjjdjd')
    // }
    navigator.navigate("Cart");
  };

  const gotToLogin = () => {
    navigator.navigate("Login");
  };
  const gotToProducts = () => {
    // if (navigator.getState().routes[1].name !== 'Cart') {
    //    console.log('djdjdjdjjdjd')
    // }
    navigator.navigate("Products");
  };

  return (

    <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
      {/*remove search icon from nav bar*/}
      {
        (route.name !== "Products") ?
          <TouchableOpacity onPress={gotToProducts} style={{ margin: 16 }}>
            <Icon
              name="search1"
              color={"#000"}
              size={23}
              containerStyle={{ marginHorizontal: 15, position: "relative" }}
            />
          </TouchableOpacity> :

          <TouchableOpacity onPress={() => setIsModalVisibleProducts(true)} style={{ margin: 16 }}>
            <Icon2
              name="sort"
              color={"#000"}
              size={23}
              containerStyle={{ marginHorizontal: 15, position: "relative" }}
            />
          </TouchableOpacity>
      }


      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <TouchableOpacity onPress={gotToCart}>
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Icon
              name="shoppingcart"
              color={"#000"}
              size={26}
              containerStyle={{ marginHorizontal: 15, position: "relative" }}
            />
            {cartItemsCount > 0 ? (
              <View
                style={{
                  position: "absolute",
                  backgroundColor: "blue",
                  width: 16,
                  height: 16,
                  borderRadius: 15 / 2,
                  right: -8,
                  top: 5,
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <Text
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    fontSize: 8,
                  }}>
                  {cartItemsCount}
                </Text>
              </View>
            ) : null}
            <View>

            </View>
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={{ margin: 16 }} onPress={gotToLogin}>
        <Icon
          name="login"
          color={"#000"}
          size={23}
          containerStyle={{ marginHorizontal: 15, position: "relative" }}
        />
      </TouchableOpacity>
    </View>
  );
}

export default DrawerNavigationHeader;
