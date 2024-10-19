import '@/components/pages/components/sheets/sheets';
import { StatusBar } from 'expo-status-bar';

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { AppContext, ProductFilterModalContext, CartContext } from "./app_contexts/AppContext";
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
import React, { createContext, useCallback, useEffect, useState } from "react";
import { Colors } from "react-native/Libraries/NewAppScreen";
import {
    connectToDatabase,
    createTables,
} from "@/components/config/sqlite_db_service";
import { SheetProvider } from "react-native-actions-sheet";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SQLiteProvider, useSQLiteContext, SQLiteDatabase } from 'expo-sqlite';


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
        <>
            <SafeAreaProvider>
                <GestureHandlerRootView
                    style={{
                        flex: 1,
                    }}>
                    <SheetProvider context="global">
                        <View style={styles.container}>
                            <GluestackUIProvider>
                                <StatusBar barStyle="dark-content" backgroundColor={backgroundStyle.backgroundColor} />
                                <SQLiteProvider databaseName="test2.db" onInit={migrateDbIfNeeded}>

                                    <AppContext.Provider value={[isLoggedIn, setLoggedInStatus]}>
                                        <CartContext.Provider value={[cartItemsCount, setCartItemsCount]}>
                                        <SearchInputTextContext.Provider value={[searchText, setSearchText]}>
                                            <ProductFilterModalContext.Provider
                                                value={[isModalVisibleProducts, setIsModalVisibleProducts]}>
                                                <StackNavigator />
                                            </ProductFilterModalContext.Provider>
                                        </SearchInputTextContext.Provider>
                                        </CartContext.Provider>
                                    </AppContext.Provider>
                                </SQLiteProvider>

                            </GluestackUIProvider>
                        </View>
                    </SheetProvider>
                </GestureHandlerRootView>
            </SafeAreaProvider>
        </>
    );
}

async function migrateDbIfNeeded(db) {
    createTables(db)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
