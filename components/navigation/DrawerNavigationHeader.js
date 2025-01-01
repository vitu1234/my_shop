import React, { useContext, useEffect, useState } from "react";
import Icon from "react-native-vector-icons/AntDesign";
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";
import { Dimensions, StyleSheet, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { ProductFilterModalContext, CartContext, AppContext } from "@/app_contexts/AppContext";
import { useRoute } from "@react-navigation/native";
import { navibar_profile_styles } from "@/styles/AllStyles";
//import { deleteAllUserData } from "../config/sqlite_db_service";
import ToastComponent from "../pages/components/ToastComponent";


import { Text } from "@/components/ui/text"
import { useToast, Toast } from "@/components/ui/toast"
import { Image } from "@/components/ui/image"
import { LogIn, Search, ShoppingCart } from "lucide-react-native";



function DrawerNavigationHeader(props) {
  const toast = useToast();
  const [cartItemsCount, setCartItemsCount] = useContext(CartContext);
  const [isModalVisibleProducts, setIsModalVisibleProducts] = useContext(ProductFilterModalContext);
  const [isLoggedIn, setLoggedInStatus] = useContext(AppContext);
  const [user, setLoggedInUser] = useState([]);

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

  const gotToSearch = () => {
    // if (navigator.getState().routes[1].name !== 'Cart') {
    //    console.log('djdjdjdjjdjd')
    // }
    navigator.navigate("Search");
  };

  const gotToLogout = () => {
    setLoggedInStatus(false);
    // deleteAllUserData();
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

  //login status checker
  if (isLoggedIn) {
    // console.log(getLoggedInUser())
    console.log('HAHAHAdH LOGIN IN header')
  } else {

  }

  useEffect(() => {

  }, [isLoggedIn]);

  return (

    <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
      {/*remove search icon from nav bar*/}
      {
        (route.name !== "Products") ?
          <TouchableOpacity onPress={gotToSearch} style={{ margin: 12 }}>
            {/* <Icon
              name="search1"
              color={"#000"}
              size={20}
              containerStyle={{ marginHorizontal: 15, position: "relative" }}
            /> */}
            <Search color={"#000"} size={26}/>
          </TouchableOpacity> :

          <TouchableOpacity onPress={() => setIsModalVisibleProducts(true)} style={{ margin: 12 }}>
            <Icon2
              name="sort"
              color={"#000"}
              size={20}
              containerStyle={{ marginHorizontal: 15, position: "relative" }}
            />
          </TouchableOpacity>
      }


      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <TouchableOpacity onPress={gotToCart}>
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            {/* <Icon
              name="shoppingcart"
              color={"#000"}
              size={20}
              containerStyle={{ marginHorizontal: 15, position: "relative" }}
            /> */}
            <ShoppingCart name="shoppingcart" color={"#000"} size={26}/>
            {cartItemsCount > 0 ? (
              <View
                style={{

                  position: "absolute",
                  backgroundColor: "dodgerblue",
                  width: 20,
                  height: 20,
                  borderRadius: 20 / 2,
                  right: -8,
                  top: 5,
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <Text
                  style={{
                    color: "white",
                    alignItems: "center",
                    justifyContent: "center",
                    // color: "#FFFFFF",
                    fontSize: 12,
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

      <View style={{ alignItems: "center", justifyContent: "center" }}>
        {
          (isLoggedIn) ?
            [
              <TouchableHighlight key={1} style={navibar_profile_styles.profileImgContainer}
                onPress={gotToLogin}>
                <Image
                  alt={"Profile"}
                  source={require("@/assets/app_rs/my_shop_logo.png")}
                  // source={{uri: "https://www.t-nation.com/system/publishing/articles/10005529/original/6-Reasons-You-Should-Never-Open-a-Gym.png"}}
                  style={navibar_profile_styles.profileImg} />
              </TouchableHighlight>,
              <TouchableOpacity key={2} style={{ marginTop: 17, marginRight: 16 }} onPress={gotToLogout}>
                <Icon
                  name="logout"
                  color={"#000"}
                  size={20}
                  containerStyle={{ marginHorizontal: 15, position: "relative" }}
                />
              </TouchableOpacity>,
            ]
            :
            <TouchableOpacity style={{ marginEnd: 16, marginStart: 16 }} onPress={gotToLogin}>
              {/* <Icon
                name="login"
                color={"#000"}
                size={20}
                containerStyle={{ marginHorizontal: 15, position: "relative" }}
              /> */}
              <LogIn color="#000" size={26} />
            </TouchableOpacity>
        }
      </View></View>
  );
}

const styles = StyleSheet.create({
  profileImgContainer: {
    marginLeft: 8,
    height: 80,
    width: 80,
    borderRadius: 40,
  },
  profileImg: {
    height: 80,
    width: 80,
    borderRadius: 40,
  },
});
export default DrawerNavigationHeader;
