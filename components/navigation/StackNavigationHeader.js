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
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={goToCart} style={styles.iconWrapper}>
                <View style={[styles.iconContainer, {marginEnd: 16}]}>
                    <Search color={"#000"} size={26}/>
                    {cartItemsCount > 0 && (
                        <View style={styles.cartBadge}>
                            <Text style={styles.badgeText}>{cartItemsCount}</Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={goToCart} style={styles.iconWrapper}>
                <View style={[styles.iconContainer, ]}>
                    <Home color={"#000"} size={26}/>
                    {cartItemsCount > 0 && (
                        <View style={styles.cartBadge}>
                            <Text style={styles.badgeText}>{cartItemsCount}</Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
            {isLoggedIn ? (
                <>
                    <TouchableHighlight key={1} style={navibar_profile_styles.profileImgContainer} onPress={goToLogin}>
                        <View style={styles.iconContainer}>
                            <Image
                                alt={"Profile"}
                                source={require("@/assets/app_rs/my_shop_logo.png")}
                                style={navibar_profile_styles.profileImg}
                            />
                        </View>
                    </TouchableHighlight>
                    <TouchableOpacity key={2} style={styles.logoutIconWrapper} onPress={goToLogout}>
                        <View style={styles.iconContainer}>
                            <Icon name="logout" color={"#000"} size={23}/>
                        </View>
                    </TouchableOpacity>
                </>
            ) : (
                <TouchableOpacity  onPress={goToLogin}>
                    {/* <View style={styles.iconContainer}>
                        <LogIn color="#000" name='login'  />
                    </View> */}
                </TouchableOpacity>
            )}
            <TouchableOpacity onPress={goToCart} style={styles.iconWrapper}>
                <View style={[styles.iconContainer, {marginStart: 16}]}>
                {/* <ShoppingCart color="#ab0d0d" strokeWidth={0.5} /> */}
                    <ShoppingCart name="shoppingcart" color={"#000"} size={26}/>
                    {cartItemsCount > 0 && (
                        <View style={styles.cartBadge}>
                            <Text style={styles.badgeText}>{cartItemsCount}</Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
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
