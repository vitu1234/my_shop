import React, { useContext } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../pages/HomeScreen";
import ProfileScreen from "../pages/ProfileScreen";
import DrawerNavigationHeader from "./DrawerNavigationHeader";
import CartScreen from "../pages/CartScreen";
import FlashProducts from "../pages/FlashProducts";
import Products from "../pages/Products";
import { House, ShoppingBag, CircleUser, AlignJustify, KeyRound, LogOut, LogIn, ShoppingCart, TextSearch, Search, Info, Bell } from 'lucide-react-native';
import { CartContext } from "@/app_contexts/AppContext";
import { View, Text } from "react-native";
import SearchScreen from "../pages/SearchScreen";


const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function DrawerNavigator(props) {

  const [cartItemsCount] = useContext(CartContext);
  console.log("VIIIIIIIIIIIII")
  console.log(props.navigation)
  const navigationData = props.navigation;

  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={HomeScreen}
        options={
          {
            headerRight: (props) => <DrawerNavigationHeader data={{
              navigator: navigationData,
            }} />,
            drawerIcon: ({ focused, size }) => (
              // <Ionicons
              //   name="md-home"
              //   size={size}
              //   color={focused ? "#2780e3" : "#ccc"}
              // />
              <House size={size} color={focused ? "#2780e3" : "#ccc"} />
            ),
          }
        }
      />


      <Drawer.Screen name="Search" component={SearchScreen} options={
        {
          headerRight: (props) => <DrawerNavigationHeader data={{
            navigator: navigationData,
          }} />,
          drawerIcon: ({ focused, size }) => (
            <Search size={size} color={focused ? "#2780e3" : "#ccc"} />
          ),
        }
      } />

      <Drawer.Screen name="Cart" component={CartScreen}
        options={
          {

            drawerIcon: ({ focused, size }) => (
              <View style={{ position: "relative", alignItems: "center", justifyContent: "center" }}>
                <ShoppingCart size={size} color={focused ? "#2780e3" : "#ccc"} />
                {cartItemsCount > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      right: -5,
                      top: -5,
                      backgroundColor: "dodgerblue",
                      borderRadius: 10,
                      paddingHorizontal: 5,
                      minWidth: 18,
                      height: 18,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>
                      {cartItemsCount}
                    </Text>
                  </View>
                )}
              </View>
            ),
          }
        }
      />


      <Drawer.Screen name="Categories" component={Products} options={
        {
          headerRight: (props) => <DrawerNavigationHeader data={{
            navigator: navigationData,
          }} />,
          drawerIcon: ({ focused, size }) => (
            <TextSearch size={size} color={focused ? "#2780e3" : "#ccc"} />
          ),
        }
      } />
      <Drawer.Screen name="Products" component={Products} options={
        {
          headerRight: (props) => <DrawerNavigationHeader data={{
            navigator: navigationData,
          }} />,
          drawerIcon: ({ focused, size }) => (
            <ShoppingBag size={size} color={focused ? "#2780e3" : "#ccc"} />
          ),
        }
      } />

      <Drawer.Screen options={
        {

          drawerIcon: ({ focused, size }) => (
            <CircleUser size={size} color={focused ? "#2780e3" : "#ccc"} />
          ),
        }
      }
        name="Profile" component={ProfileScreen} />

      <Drawer.Screen name="Notifications" component={Products} options={
        {
          headerRight: (props) => <DrawerNavigationHeader data={{
            navigator: navigationData,
          }} />,
          drawerIcon: ({ focused, size }) => (
            <Bell size={size} color={focused ? "#2780e3" : "#ccc"} />

          ),
        }
      } />

      <Drawer.Screen name="Login" component={Products} options={
        {
          headerRight: (props) => <DrawerNavigationHeader data={{
            navigator: navigationData,
          }} />,
          drawerIcon: ({ focused, size }) => (
            <LogIn size={size} color={focused ? "#2780e3" : "#ccc"} />

          ),
        }
      } />

      <Drawer.Screen name="Logout" component={Products} options={
        {
          headerRight: (props) => <DrawerNavigationHeader data={{
            navigator: navigationData,
          }} />,
          drawerIcon: ({ focused, size }) => (
            <LogOut size={size} color={focused ? "#2780e3" : "#ccc"} />

          ),
        }
      } />

      <Drawer.Screen name="About" component={Products} options={
        {
          headerRight: (props) => <DrawerNavigationHeader data={{
            navigator: navigationData,
          }} />,
          drawerIcon: ({ focused, size }) => (
            <Info size={size} color={focused ? "#2780e3" : "#ccc"} />
          ),
        }
      } />

    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
