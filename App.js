import {StatusBar} from 'expo-status-bar';
// import "global.css";
import {GluestackUIProvider} from "@/components/ui/gluestack-ui-provider";
import {AppContext, ProductFilterModalContext, CartContext} from "./app_contexts/AppContext";
import StackNavigator from "components/navigation/StackNavigator";
import {
    AppRegistry,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from "react-native";
import React, {createContext, useCallback, useEffect, useState} from "react";
import {Colors} from "react-native/Libraries/NewAppScreen";
import {
    connectToDatabase,
    createTables,
} from "@/components/config/sqlite_db_service";


Colors.darker = undefined;
export default function App() {
    const loadData =   async (db) => {
        try {
            const db = await connectToDatabase()
            await createTables(db)
        } catch (error) {
            console.error("HERE", error)
        }
    }

    useEffect(() => {
        loadData().catch(error => console.error("Load Data Error:", error));
    }, []);


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
        <View style={styles.container}>
        <GluestackUIProvider >
            <StatusBar barStyle="dark-content" backgroundColor={backgroundStyle.backgroundColor} />
            <AppContext.Provider value={[isLoggedIn, setLoggedInStatus]}>
                <CartContext.Provider value={[cartItemsCount, setCartItemsCount]}>
                    <ProductFilterModalContext.Provider value={[isModalVisibleProducts, setIsModalVisibleProducts]}>
                        <StackNavigator/>
                    </ProductFilterModalContext.Provider>
                </CartContext.Provider>
            </AppContext.Provider>

        </GluestackUIProvider>
        </View>
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
