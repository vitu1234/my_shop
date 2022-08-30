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
import {AppContext, ProductFilterModalContext, CartContext} from './app_contexts/AppContext';

const App: () => Node = () => {


    const [isLoggedIn, setLoggedInStatus] = useState(false);
    const [isModalVisibleProducts, setIsModalVisibleProducts] = useState(false);
    const [cartItemsCount, setCartItemsCount] = useState(0);
    const [cartItems, setCartItems] = useState([]);


    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    return (
        <NativeBaseProvider>
            <AppContext.Provider value={[isLoggedIn, setLoggedInStatus]}>
                <CartContext.Provider value={[cartItemsCount, setCartItemsCount]}>
                    <ProductFilterModalContext.Provider value={[isModalVisibleProducts, setIsModalVisibleProducts]}>
                        <StackNavigator/>
                    </ProductFilterModalContext.Provider>
                </CartContext.Provider>
            </AppContext.Provider>
        </NativeBaseProvider>
    );
};

const styles = StyleSheet.create({});

export default App;
