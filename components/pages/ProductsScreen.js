import React, { useCallback, useContext, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    ScrollView,
    StyleSheet,
    ToastAndroid,
    TouchableOpacity,
    View
} from "react-native";
import { AppContext, CartContext } from "@/app_contexts/AppContext";
import ProductCard from "./components/product/ProductCard";

import ContentLoader from "react-native-easy-content-loader";

const { width } = Dimensions.get("window");
import { connectToDatabase, db } from "../config/sqlite_db_service";
import { Text } from "@/components/ui/text"
import { useToast, Toast } from "@/components/ui/toast"
import { Heading } from "@/components/ui/heading"
import SearchFilterScreen from "@/components/pages/components/search/SearchFilterScreen";
import { useSQLiteContext } from 'expo-sqlite';
import { getAllProducts } from "../config/API";
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { useRef } from "react";


function ProductsScreen(props) {
    const db = useSQLiteContext();
    const [cartItemsCount, setCartItemsCount] = useContext(CartContext);
    const [isLoggedIn, setLoggedInStatus] = useContext(AppContext);
    const offsetRef = useRef(0); // for pagination

    const [limit, setLimit] = useState(20); //for pagination

    const [categoryActive, setCategoryActive] = useState(-1);
    const [isAppDataFetchLoading, setIsAppDataFetchLoading] = useState(true);
    const [isAppDataFetchError, setIsAppDataFetchError] = useState(false);
    const [appDataFetchMsg, setIsAppDataFetchMsg] = useState("");
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);  // To manage loading state
    const [hasMoreProducts, setHasMoreProducts] = useState(true);

    const route = useRoute();
    // const [selectedFilters, setSelectedFilters] = useState([]);
    // useFocusEffect(

    //     useCallback(() => {
    //         if (route.params?.selectedFilters) {
    //             setSelectedFilters(route.params.selectedFilters);
    //             // Optionally clear the params if you don’t want it to persist
    //             navigation.setParams({ selectedFilters: undefined });
    //         }
    //     }, [route.params?.selectedFilters])
    // );

    // console.log(selectedFilters)

    console.log("Received selectedFilters in Products screen:", route.params?.selectedFilters);

    const initialSearchFilters = {
        price_asc: false,
        price_desc: false,
        newest_first: false,
        oldest_first: false,
        name_asc: false,
        name_desc: false,
    };

    const setFilters1 = (filters) => {
        setSearchFilters(filters);
        console.log(filters);
        console.log("filter products here");
    };
    const [searchFilters, setSearchFilters] = useState(initialSearchFilters);

    const btnCategoryAction = (category) => {
        console.log("GOES TO " + category + " CATEGORY");
        // setIsAppDataFetchLoading(true);
        // setIsAppDataFetchError(false);
        setCategoryActive(category.category_id);
        // getProductsScreen({productsScreenLoading, category_id});
        console.log(category.category_id)
        props.navigation.navigate("ProductsByCategoryScreen", { category_id: category.category_id, category_name: category.category_name });
        setCategoryActive(-1); // Reset active category after navigation
    };

    const productCardAction = (product) => {
        props.navigation.navigate("ProductDetails", { product_id: product.product_id });
    };


    const fetchData = useCallback(async () => {
        console.log("Fetching Products data... OFFSET:", offsetRef.current);
        if (!loading || !hasMoreProducts) return;
        await getAllProducts({ productsScreenLoading, limit: limit, offset: offsetRef.current });
        offsetRef.current += limit; // Increment offset for next batch
    }, [offsetRef, isAppDataFetchLoading, hasMoreProducts, loading, limit]);



    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [fetchData]),
    );

    useEffect(() => {
        if (route.params?.selectedFilters) {
            console.log("Triggered by selectedFilters:", route.params.selectedFilters);

            // Reset screen data
            offsetRef.current = 0;
            setProducts([]);
            setHasMoreProducts(true);
            setLoading(true);

            // Optionally store filters locally
            // setSearchFilters(route.params.selectedFilters);

            // Trigger fetch with filters
            fetchDataWithFilters(route.params.selectedFilters);

            // Optionally clear params to prevent re-triggering
            props.navigation.setParams({ selectedFilters: undefined });
        }
    }, [route.params?.selectedFilters]);

    const fetchDataWithFilters = useCallback(async (filters) => {
        console.log("Fetching with filters:", filters);
        await getAllProducts({
            productsScreenLoading,
            limit: limit,
            offset: offsetRef.current,
            filters: filters
        });
        offsetRef.current += limit;
    }, [limit]);



    const productsScreenLoading = async (isFetchingDataError, message, fetchedProducts) => {
        console.log("Loading products screen results...");
        console.log("returned Productssss: " + fetchedProducts);
        setLoading(false);
        setIsAppDataFetchLoading(false);  // Stop loading
        if (isFetchingDataError) {
            setLoading(false);  // Stop loading
            setIsAppDataFetchError(true);
            setIsAppDataFetchMsg(message);
            Toast.show({
                text1: 'Error',
                text2: message,
                position: 'bottom',
                bottomOffset: 50,
            });
        } else {
            if (db) {
                if (categories.length === 0) {
                    const categoriesFetch = await db.getAllAsync("SELECT * FROM category ORDER BY RANDOM() LIMIT 20");
                    setCategories(categoriesFetch);
                }


                // setProducts(prev => [...prev, ...fetchedProducts]); // Append new products

                if (fetchedProducts.length === 0) {
                    setHasMoreProducts(false); // No more products
                } else {
                    setProducts(prev => [...prev, ...fetchedProducts]);
                    setOffset(prev => prev + fetchedProducts.length);
                }

                setIsAppDataFetchError(false);
                setIsAppDataFetchMsg(message);
            } else {
                setIsAppDataFetchError(true);
                setIsAppDataFetchMsg("Local Database error...");
            }
        }
    };

    const renderLoader = () => (
        <View style={styles.footer}>
            <ActivityIndicator size="large" color="#000" />
        </View>
    );

    const renderCategoryList = ({ item }) => (
        <View>
            <TouchableOpacity
                key={item.category_id}
                style={[styles.categoryButton, item.category_id === categoryActive && styles.activeCategory]}
                onPress={() => btnCategoryAction(item)}
            >
                <Text
                    style={[styles.categoryText, item.category_id === categoryActive && styles.activeCategoryText]}>{item.category_name}</Text>
            </TouchableOpacity>
        </View>
    )

    const renderProductList = ({ item }) => (
        <View key={item.product_id} style={styles.productCardContainer}>
            <ProductCard data={{
                database: db,
                product: item,
                action: productCardAction,
            }} />
        </View>
    );

    const renderFooter = () => {
        if (!loading) return null;
        return (
            <View style={styles.footer}>
                <ActivityIndicator size="small" color="#000" />
            </View>
        );
    };

    return (
        <FlatList
            style={styles.container}
            data={products}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.product_id.toString() + Math.random()}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapperStyle}
            contentContainerStyle={styles.flashProductsListContainer}
            renderItem={renderProductList}
            ListHeaderComponent={
                <View>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>Let's help you find what you want!</Text>
                    </View>
                    <FlatList
                        data={categories}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.horizontalListContainer}
                        renderItem={renderCategoryList}
                        keyExtractor={item => item.category_id.toString() + Math.random()}
                    />
                </View>
            }
            // ListFooterComponent={renderFooter}
            onEndReachedThreshold={0.3}
            onRefresh={() => {
                offsetRef.current = 0;
                setProducts([]);
                setLoading(true);
                fetchData();
                setHasMoreProducts(true);
            }}
            onEndReached={() => {
                if (loading || !hasMoreProducts) return;
                setLoading(true);
                fetchData();
            }}
            refreshing={loading}
            ListEmptyComponent={loading ? "" : <Text style={{ textAlign: "center", fontSize: 16 }}>No products found.</Text>}
        />
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    headerContainer: {
        padding: 16,
        margin: 7
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    categoryButton: {
        marginBottom: 18,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#e0e0e0',
        borderRadius: 20,
        marginHorizontal: 5,
    },
    activeCategory: {
        backgroundColor: '#2780e3'
    },
    activeCategoryText: {
        color: '#fff'
    },
    categoryText: {
        color: '#000',
        // fontWeight: 'bold',
    },
    productCardContainer: {
        flex: 1,
        margin: 5,
        maxWidth: (width / 2) - 15,
    },
    flashProductsContainer: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: 'rgba(250,249,249,0.83)',
    },
    flashProductsHeader: {
        // marginBottom: 10,
        // alignItems: 'center',
        // justifyContent: 'space-between',
        flexDirection: 'row',
        margin: 10
    },
    viewAllButton: {

        // marginLeft: 'auto',
        borderColor: '#2780e3',

        // borderWidth: 1,
        padding: 5
    },
    flashProductBox: {
        marginVertical: 5,
        width: (width - 10) / 2 - 15,
    },
    columnWrapperStyle: {
        flexWrap: 'wrap',
        marginStart: 5
    },
    flashProductsListContainer: {
        paddingBottom: 80,
    },
    footer: {
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        alignItems: 'center',
    },
    errorText: {
        color: "#b60303",
        alignSelf: "center",
    },
    horizontalListContainer: {
        paddingHorizontal: 16,
    },
});

export default ProductsScreen;
