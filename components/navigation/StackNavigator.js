import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrawerNavigator from "./DrawerNavigator";
import SettingsScreen from "../pages/SettingsScreen";
import NavigationContainer from "@react-navigation/native/src/NavigationContainer";
import ProductDetails from "../pages/ProductDetails";
import StackNavigationHeader from "./StackNavigationHeader";
import CartScreen from "../pages/CartScreen";
import FlashProducts from "../pages/FlashProducts";
import LoginScreen from "../pages/auth/LoginScreen";
import SignUpScreen from "../pages/auth/SignUpScreen";
import ForgetPasswordScreen from "../pages/auth/ForgetPasswordScreen";
import SignUpVerifyAccount from "../pages/auth/SignUpVerifyAccount";
import AuthLoadingScreen from "../pages/auth/AuthLoadingScreen";
import SearchScreen from "@/components/pages/SearchScreen";
import { Button, TouchableHighlight, TouchableOpacity } from "react-native";
import SearchBar from "@/components/pages/components/search/SearchBarInput";
import ProductsByCategoryScreen from "../pages/ProductsByCategoryScreen";
import FilterScreen from "../pages/FilterScreen";
import { X } from "lucide-react-native";
import { View, Text } from "react-native";
// import { useNavigation } from '@react-navigation/native';

const Stack = createNativeStackNavigator();



function StackNavigator(props) {
    // const navigation = useNavigation();
    const goBack = () => {
        console.log("JKLSDHFKJDHDJKF")
        console.log(props)
        console.log("PASSS")
    }

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={'AuthLoadingScreen'}>
                <Stack.Screen name="AuthLoadingScreen" component={AuthLoadingScreen} options={{
                    headerShown: false,
                }} />
                <Stack.Screen
                    name="Drawer"
                    component={DrawerNavigator}
                    options={{ headerShown: false }}
                />
                <Stack.Screen name="Search" component={SearchScreen} options={({ navigation }) => ({

                    headerShown: false,

                })} />
                <Stack.Screen name="Feed" component={SettingsScreen} />
                <Stack.Screen name="Login" component={LoginScreen} options={{
                    headerShown: false,
                }} />
                <Stack.Screen name="SignUp" component={SignUpScreen} options={{
                    headerShown: false,
                    title: "Back",
                }} />

                <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} options={{
                    headerShown: true,
                    title: "Back",
                }} />
                <Stack.Screen
                    name="ProductsByCategoryScreen"
                    component={ProductsByCategoryScreen}
                    options={({ navigation }) => ({
                        headerRight: () => (
                            <StackNavigationHeader data={{ navigation }} />
                        ),
                        headerShown: true,
                        headerBackTitle: 'Back',
                        headerTitle: '',
                        headerTitleStyle: {
                            fontSize: 13,
                        },
                    })}
                />

                <Stack.Screen
                    name="FilterScreen"
                    component={FilterScreen}
                    options={{
                        headerShown: false,
                        headerBackVisible: false,
                        headerLeft: () => null,
                        headerRight: () => <TouchableOpacity onPress={goBack()}><X strokeWidth={2.9} /></TouchableOpacity>,
                        headerTitle: () => (
                            <View style={{ flex: 1, alignItems: 'flex-start', paddingLeft: 0 }}>
                                <Text style={{ fontSize: 19, fontWeight: '900' }}>Filters</Text>
                            </View>
                        ),
                        // headerTitleAlign doesn't matter when using custom headerTitle
                    }}
                />

                <Stack.Screen name="SignUpVerifyAccount" component={SignUpVerifyAccount} options={{
                    headerShown: true,
                    title: "Back",
                }} />
                <Stack.Screen name="Cart" component={CartScreen}
                    options={({ navigation }) => ({
                        headerRight: () => (
                            <StackNavigationHeader data={{ navigation: navigation }} />
                        ),
                        headerBackTitle: 'Back',
                        headerTitle: '',
                    })}
                />
                <Stack.Screen name="ProductDetails" component={ProductDetails}
                    // options={{
                    //     title: 'Product Details', headerStyle: {
                    //         // backgroundColor: '#f4511e',
                    //     },
                    //
                    //
                    //     headerRight: (props) => <StackNavigationHeader data={{
                    //         // navigator: navigationData,
                    //     }}/>,
                    // }}
                    options={({ navigation }) => ({
                        headerRight: () => (
                            <StackNavigationHeader data={{ navigation: navigation }} />
                        ),
                        headerBackTitle: 'Back',
                        headerTitle: ''
                    })}
                />


                <Stack.Screen name="FlashProducts" component={FlashProducts}
                    // options={{
                    //     title: 'Product Details', headerStyle: {
                    //         // backgroundColor: '#f4511e',
                    //     },
                    //
                    //
                    //     headerRight: (props) => <StackNavigationHeader data={{
                    //         // navigator: navigationData,
                    //     }}/>,
                    // }}
                    options={({ navigation }) => ({
                        headerRight: () => (
                            <StackNavigationHeader data={{ navigation: navigation }} />
                        ),
                    })}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default StackNavigator;
