import 'react-native-gesture-handler';

import React, {createContext, useState} from 'react';
import type {Node} from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';

import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import StackNavigator from './navigation/StackNavigator';
import {NativeBaseProvider} from 'native-base';
import {UserContext} from './app_contexts/UserContext';
import {CartContext} from './app_contexts/CartContext';

const App: () => Node = () => {
    const [isLoggedIn, setLoggedInStatus] = useState(false);
    const [cartItemsCount, setCartItemsCount] = useState(0);
    const [cartItems, setCartItems] = useState([]);

    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    return (
        <NativeBaseProvider>
            <UserContext.Provider value={[isLoggedIn, setLoggedInStatus]}>
                <CartContext.Provider value={[cartItemsCount, setCartItemsCount]}>
                    <StackNavigator/>
                </CartContext.Provider>
            </UserContext.Provider>
        </NativeBaseProvider>
    );
};

const styles = StyleSheet.create({});

export default App;
