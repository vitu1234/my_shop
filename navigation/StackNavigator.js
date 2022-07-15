import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DrawerNavigator from './DrawerNavigator';
import SettingsScreen from '../pages/SettingsScreen';
import NavigationContainer from '@react-navigation/native/src/NavigationContainer';
import ProductDetails from '../pages/ProductDetails';

const Stack = createNativeStackNavigator();

function StackNavigator(props) {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Drawer"
                    component={DrawerNavigator}
                    options={{headerShown: false}}
                />
                <Stack.Screen name="Feed" component={SettingsScreen}/>
                <Stack.Screen name="ProductDetails" component={ProductDetails} options={{
                    title: 'Product Details', headerStyle: {
                        // backgroundColor: '#f4511e',

                    },
                }}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default StackNavigator;
