import React, {useContext} from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
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
import {Button} from "react-native";
import SearchBar from "@/components/pages/components/search/SearchBarInput";

const Stack = createNativeStackNavigator();

function StackNavigator(props) {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={'AuthLoadingScreen'}>
                <Stack.Screen name="AuthLoadingScreen" component={AuthLoadingScreen} options={{
                    headerShown: false,
                }}/>
                <Stack.Screen
                    name="Drawer"
                    component={DrawerNavigator}
                    options={{headerShown: false}}
                />
                <Stack.Screen name="Search" component={SearchScreen} options={({navigation}) => ({

                    headerShown: false,

                })}/>
                <Stack.Screen name="Feed" component={SettingsScreen}/>
                <Stack.Screen name="Login" component={LoginScreen} options={{
                    headerShown: false,
                }}/>
                <Stack.Screen name="SignUp" component={SignUpScreen} options={{
                    headerShown: false,
                    title: "Back",
                }}/>

                <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} options={{
                    headerShown: true,
                    title: "Back",
                }}/>
                <Stack.Screen name="SignUpVerifyAccount" component={SignUpVerifyAccount} options={{
                    headerShown: true,
                    title: "Back",
                }}/>
                <Stack.Screen name="Cart" component={CartScreen}
                              options={({navigation}) => ({
                                  headerRight: () => (
                                      <StackNavigationHeader data={{navigation: navigation}}/>
                                  ),
                                  headerBackTitle: 'Back',
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
                              options={({navigation}) => ({
                                  headerRight: () => (
                                      <StackNavigationHeader data={{navigation: navigation}}/>
                                  ),
                                  headerBackTitle: 'Back',
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
                              options={({navigation}) => ({
                                  headerRight: () => (
                                      <StackNavigationHeader data={{navigation: navigation}}/>
                                  ),
                              })}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default StackNavigator;
