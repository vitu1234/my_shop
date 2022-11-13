import React, { useContext } from "react";
import { HStack, View, Text, Image, useToast } from "native-base";
import Icon from "react-native-vector-icons/AntDesign";
import { Dimensions, StyleSheet, TouchableHighlight, TouchableOpacity } from "react-native";
import { AppContext, CartContext } from "../app_contexts/AppContext";
import { navibar_profile_styles } from "../styles/AllStyles";
import { deleteAllUserData } from "../config/sqlite_db_service";
import ToastComponent from "../pages/components/ToastComponent";


// import {CartContext} from '../app_contexts/CartContext';


function StackNavigationHeader(props) {
  const toast = useToast();
  const [cartItemsCount, setCartItemsCount] = useContext(CartContext);
  const [isLoggedIn, setLoggedInStatus] = useContext(AppContext);
  const navigator = props.data.navigation;

  // console.log(navigator.getState().routes[1].name);
  const gotToCart = () => {
    if (navigator.getState().routes[1].name !== "Cart") {
      navigator.navigate("Cart");
    }
  };

  const gotToLogin = () => {
    if (navigator.getState().routes[1].name !== "Login") {
      navigator.navigate("Login");
    }
  };

  const gotToLogout = () => {
    setLoggedInStatus(false);
    deleteAllUserData();
    const ToastDetails = {
      id: 14,
      title: "Success",
      variant: "left-accent",
      description: "Logout successful",
      isClosable: false,
      status: "success",
      duration: 1000,
    };
    toast.show({
      render: () => {
        return <ToastComponent {...ToastDetails} />;
      },
    });
  };

  return (

    <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
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
      {
        (isLoggedIn) ?
          [
            <TouchableHighlight key={1} style={navibar_profile_styles.profileImgContainer}
                                onPress={gotToLogin}>
              <Image
                alt={"Profile"}
                source={require("../assets/app_rs/my_shop_logo.png")}
                // source={{uri: "https://www.t-nation.com/system/publishing/articles/10005529/original/6-Reasons-You-Should-Never-Open-a-Gym.png"}}
                style={navibar_profile_styles.profileImg} />
            </TouchableHighlight>,
            <TouchableOpacity key={2} style={{ marginTop: 17, marginRight: 16 }} onPress={gotToLogout}>
              <Icon
                name="logout"
                color={"#000"}
                size={23}
                containerStyle={{ marginHorizontal: 15, position: "relative" }}
              />
            </TouchableOpacity>,
          ]
          :
          <TouchableOpacity style={{ margin: 16 }} onPress={gotToLogin}>
            <Icon
              name="login"
              color={"#000"}
              size={23}
              containerStyle={{ marginHorizontal: 15, position: "relative" }}
            />
          </TouchableOpacity>
      }
    </View>
  );
}

export default StackNavigationHeader;
