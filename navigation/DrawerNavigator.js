import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../pages/HomeScreen';
import ProfileScreen from '../pages/ProfileScreen';
import DrawerNavigationHeader from './DrawerNavigationHeader';
import CartScreen from '../pages/CartScreen';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function DrawerNavigator(props) {

    // console.log(props.navigation)
    const navigationData = props.navigation;

    return (
        <Drawer.Navigator>
            <Drawer.Screen name="Home" component={HomeScreen}
                           options={
                               {
                                   headerRight: (props) => <DrawerNavigationHeader data={{
                                       navigator: navigationData,
                                   }}/>,
                               }
                           }
            />
            <Drawer.Screen name="Profile" component={ProfileScreen}/>
            <Drawer.Screen name="Cart" component={CartScreen}/>
            {/*<Stack.Screen name="Settings" component={Settings} />*/}
        </Drawer.Navigator>
    );
}

export default DrawerNavigator;
