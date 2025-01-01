import React, {useContext} from "react";
import Icon from "react-native-vector-icons/AntDesign";
import {StyleSheet, TouchableHighlight, TouchableOpacity, View} from "react-native";
import {AppContext, CartContext} from "@/app_contexts/AppContext";
import {navibar_profile_styles} from "@/styles/AllStyles";
import ToastComponent from "../pages/components/ToastComponent";
import {Image} from "@/components/ui/image";
import {Text} from "@/components/ui/text";
import {useToast} from "@/components/ui/toast";
import { Home, LogIn, Search, ShoppingCart } from "lucide-react-native";
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";

function StackNavigationHeader(props) {
    const toast = useToast();
    const [cartItemsCount] = useContext(CartContext);
    const [isLoggedIn, setLoggedInStatus] = useContext(AppContext);
    const navigator = props.data.navigation;

    const goToCart = () => {
        if (navigator.getState().routes[1].name !== "Cart") {
            navigator.navigate("Cart");
        }
    };

    const goToHome = () => {
        if (navigator.getState().routes[1].name !== "Drawer") {
            navigator.navigate("Drawer");
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


  return (

    <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
      {/*remove search icon from nav bar*/}
      
          <TouchableOpacity onPress={goToSearch} style={{ margin: 12, marginEnd: 1 }}>
          
            <Search color={"#000"} size={26}/>
          </TouchableOpacity> 

          <TouchableOpacity onPress={goToHome} style={{ margin: 12, marginEnd: 10 }}>
         
            <Home color={"#000"} size={26}/>
          </TouchableOpacity>
      


      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <TouchableOpacity onPress={goToCart}>
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        
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

      
      </View>
  );



}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
    },
    iconWrapper: {},
    iconContainer: {
        flex: 1,
        alignItems: "center",
        // justifyContent: "center",

    },
    cartBadge: {
        position: "absolute",
        backgroundColor: "blue",
        width: 16,
        height: 16,
        borderRadius: 8,
        right: -8,
        top: 5,
        // alignItems: "center",
        // justifyContent: "center",
    },
    badgeText: {
        color: "#FFFFFF",
        fontSize: 8,
        textAlign: "center",
    },
    logoutIconWrapper: {
        marginTop: 17,
        marginRight: 16,
    },
    loginIconWrapper: {
        // margin: 16,
    },
});

export default StackNavigationHeader;
