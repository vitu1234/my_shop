import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../pages/HomeScreen';
import ProfileScreen from '../pages/ProfileScreen';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function DrawerNavigator(props) {
    return (
        <Drawer.Navigator>
            <Drawer.Screen name="Home" component={HomeScreen}/>
            <Drawer.Screen name="Profile" component={ProfileScreen}/>
            {/*<Stack.Screen name="Settings" component={Settings} />*/}
        </Drawer.Navigator>
    );
}

export default DrawerNavigator;
