import React, { useContext } from "react";
import Icon from "react-native-vector-icons/AntDesign";
import { StyleSheet, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { AppContext, CartContext } from "@/app_contexts/AppContext";
import { navibar_profile_styles } from "@/styles/AllStyles";
import ToastComponent from "../pages/components/ToastComponent";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { useToast } from "@/components/ui/toast";
import { Home, ListFilter, LogIn, Search, ShoppingCart } from "lucide-react-native";
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";

import { Animated } from "react-native";
import { useEffect, useRef } from "react";

import { useRoute } from "@react-navigation/native";

function StackNavigationHeader(props) {
  const toast = useToast();
  const route = useRoute();
  const [cartItemsCount] = useContext(CartContext);
  const [isLoggedIn, setLoggedInStatus] = useContext(AppContext);
  const navigator = props.data.navigation;

  const bounceAnim = useRef(new Animated.Value(1)).current;


  const goToCart = () => {
    if (navigator.getState().routes[1].name !== "Cart") {
      navigator.navigate("Cart");
    }
  };

  const goToHome = () => {
    if (navigator.getState().routes[1].name !== "Home") {
      navigator.navigate("Home");
    }
  };

  const goToSearch = () => {
    if (navigator.getState().routes[1].name !== "Search") {
      navigator.navigate("Search");
    }
  };

  const goToLogin = () => {
    if (navigator.getState().routes[1].name !== "Login") {
      navigator.navigate("Login");
    }
  };

  const goToLogout = () => {
    setLoggedInStatus(false);
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
      render: () => <ToastComponent {...ToastDetails} />,
    });
  };

  const sortFilterAction = () => {
    // setIsModalVisibleProducts(true)
    // console.log("Clicker sort clicke")
    // navigator.navigate("FilterScreen");
    navigator.navigate("FilterScreen", {
      category_id: route.params?.category_id, // forward the param
      screenName: route.name,
      // onApplyFilters: (selectedFilters) => {
      //   // Handle filters here (e.g., update state or refetch products)
      //   // console.log("Selected Filters:", selectedFilters);
      // },
    });
  }


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
    {route.name !== "ProductsByCategoryScreen" ? (
      <TouchableOpacity onPress={goToSearch} style={styles.iconTouchable}>
        <Search color="#000" size={26} />
      </TouchableOpacity>
    ) : (
      <View style={styles.row}>
        <TouchableOpacity onPress={goToSearch} style={styles.iconTouchable}>
          <Search color="#000" size={26} />
        </TouchableOpacity>
        <TouchableOpacity onPress={ sortFilterAction} style={styles.iconTouchable}>
          <ListFilter color="#000" size={26} />
        </TouchableOpacity>
      </View>
    )}
  
    <TouchableOpacity onPress={goToHome} style={styles.iconTouchable}>
      <Home color="#000" size={26} />
    </TouchableOpacity>
  
    <TouchableOpacity onPress={goToCart} style={styles.iconTouchable}>
      <View style={styles.iconContainer}>
        <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
          <ShoppingCart color="#000" size={26} />
          {cartItemsCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.badgeText}>{cartItemsCount}</Text>
            </View>
          )}
        </Animated.View>
      </View>
    </TouchableOpacity>
  </View>
  
  );



}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    // paddingHorizontal: ,
    paddingVertical: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconTouchable: {
    marginHorizontal: 4,
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
});


export default StackNavigationHeader;
