import React, { useContext, useEffect, useState } from "react";
import Icon from "react-native-vector-icons/AntDesign";
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";
import { Dimensions, StyleSheet, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { ProductFilterModalContext, CartContext, AppContext } from "@/app_contexts/AppContext";
import { useRoute } from "@react-navigation/native";
import { navibar_profile_styles } from "@/styles/AllStyles";
//import { deleteAllUserData } from "../config/sqlite_db_service";
import ToastComponent from "../pages/components/ToastComponent";

import {  ListFilter} from "lucide-react-native";

import { Text } from "@/components/ui/text"
import { useToast, Toast } from "@/components/ui/toast"
import { Image } from "@/components/ui/image"
import { LogIn, Search, ShoppingCart } from "lucide-react-native";
import { Animated } from "react-native";
import { useRef } from "react";

function DrawerNavigationHeader(props) {
  // const toast = useToast();
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
    // toast.show({
    //   render: () => {
    //     return <ToastComponent {...ToastDetails} />;
    //   },
    // });
  };

  const sortFilterAction = () => {
    // setIsModalVisibleProducts(true)
    // console.log("Clicker sort clicke")
    navigator.navigate("FilterScreen");
  }

  //login status checker
  if (isLoggedIn) {
    // console.log(getLoggedInUser())
    console.log('HAHAHAdH LOGIN IN header')
  } else {

  }

  useEffect(() => {

  }, [isLoggedIn]);

  const bounceAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (cartItemsCount > 0) {
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [cartItemsCount]);


  return (

    <View style={styles.headerContainer}>
    {route.name !== "Products" ? (
      <TouchableOpacity onPress={gotToSearch} style={styles.iconTouchable}>
        <Search color="#000" size={26} />
      </TouchableOpacity>
    ) : (
      <View style={styles.row}>
        <TouchableOpacity onPress={gotToSearch} style={styles.iconTouchable}>
          <Search color="#000" size={26} />
        </TouchableOpacity>
        <TouchableOpacity onPress={sortFilterAction} style={styles.iconTouchable}>
          <ListFilter color="#000" size={26} />
        </TouchableOpacity>
      </View>
    )}
  
    <TouchableOpacity onPress={gotToCart} style={styles.iconTouchable}>
      <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
        <ShoppingCart color="#000" size={26} />
        {cartItemsCount > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.badgeText}>{cartItemsCount}</Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  
    {isLoggedIn ? (
      <View style={styles.row}>
        <TouchableHighlight
          style={styles.profileImgContainer}
          onPress={gotToLogin}
          underlayColor="transparent"
        >
          <Image
            alt="Profile"
            source={require("@/assets/app_rs/my_shop_logo.png")}
            style={styles.profileImg}
          />
        </TouchableHighlight>
        <TouchableOpacity style={styles.logoutIcon} onPress={gotToLogout}>
          <Icon name="logout" color="#000" size={20} />
        </TouchableOpacity>
      </View>
    ) : (
      <TouchableOpacity style={styles.iconTouchable} onPress={gotToLogin}>
        <LogIn color="#000" size={26} />
      </TouchableOpacity>
    )}
  </View>
  
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconTouchable: {
    marginHorizontal: 6,
    padding: 4,
  },
  cartBadge: {
    position: "absolute",
    backgroundColor: "dodgerblue",
    width: 16,
    height: 16,
    borderRadius: 8,
    right: -6,
    top: -4,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
  },
  profileImgContainer: {
    marginHorizontal: 6,
    height: 36,
    width: 36,
    borderRadius: 18,
    overflow: "hidden",
  },
  profileImg: {
    height: "100%",
    width: "100%",
    borderRadius: 18,
  },
  logoutIcon: {
    marginHorizontal: 6,
    padding: 4,
    marginTop: 2,
  },
});

export default DrawerNavigationHeader;
