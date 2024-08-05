import {StatusBar} from 'expo-status-bar';
import "global.css";
import {GluestackUIProvider} from "@/components/ui/gluestack-ui-provider";
import { AppContext, ProductFilterModalContext, CartContext } from "./app_contexts/AppContext";
import StackNavigator from "components/navigation/StackNavigator";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from "react-native";
import React, { createContext, useState } from "react";
import {Colors} from "react-native/Libraries/NewAppScreen";


Colors.darker = undefined;
export default function App() {



    const [isLoggedIn, setLoggedInStatus] = useState(false);
    const [isModalVisibleProducts, setIsModalVisibleProducts] = useState(false);
    const [IsAppDataFetchLoading, setIsAppDataFetchLoading] = useState(true);
    const [cartItemsCount, setCartItemsCount] = useState(0);
    const [cartItems, setCartItems] = useState([]);


    const isDarkMode = useColorScheme() === "dark";

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    return (
        <GluestackUIProvider mode="light"><View style={styles.container}>
            <AppContext.Provider value={[isLoggedIn, setLoggedInStatus]}>
                <CartContext.Provider value={[cartItemsCount, setCartItemsCount]}>
                    <ProductFilterModalContext.Provider value={[isModalVisibleProducts, setIsModalVisibleProducts]}>
                        <StackNavigator />
                    </ProductFilterModalContext.Provider>
                </CartContext.Provider>
            </AppContext.Provider>
        </View></GluestackUIProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
