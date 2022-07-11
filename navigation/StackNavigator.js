import React, {useContext} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DrawerNavigator from './DrawerNavigator';
import SettingsScreen from '../pages/SettingsScreen';
import NavigationContainer from '@react-navigation/native/src/NavigationContainer';
import ProductDetails from '../pages/ProductDetails';
import StackNavigationHeader from './StackNavigationHeader';
import {UserContext} from '../app_contexts/UserContext';
import {CartContext} from '../app_contexts/CartContext';
import CartScreen from '../pages/CartScreen';

const Stack = createNativeStackNavigator();

function StackNavigator(props) {
    const [isLoggedIn, setLoggedInStatus] = useContext(UserContext);
    const [cartItemsCount, setCartItemsCount] = useContext(CartContext);
    console.log(props)
    const navigationData = props.navigation;

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Drawer"
                    component={DrawerNavigator}
                    options={{headerShown: false}}
                />
                <Stack.Screen name="Feed" component={SettingsScreen}/>
                <Stack.Screen name="Cart" component={CartScreen}/>
                <Stack.Screen name="ProductDetails" component={ProductDetails} options={{
                    title: 'Product Details', headerStyle: {
                        // backgroundColor: '#f4511e',

                    },
                    headerRight: (props) => <StackNavigationHeader data={{
                        // navigator: navigationData,
                    }}/>,
                }}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default StackNavigator;
