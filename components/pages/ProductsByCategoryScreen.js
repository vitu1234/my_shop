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
import { getAllProducts, getAllProductsByCategory, getAllProductsBySubCategory } from "../config/API";
import { useFocusEffect } from '@react-navigation/native';
import { useRef } from "react";


function ProductsByCategoryScreen(props) {

    const category_id_selected = props.route.params.category_id
    const category_name_selected = props.route.params.category_name

    const db = useSQLiteContext();
    const [cartItemsCount, setCartItemsCount] = useContext(CartContext);
    const [isLoggedIn, setLoggedInStatus] = useContext(AppContext);
    const offsetRef = useRef(0); // for pagination
    const isInitialLoadRef = useRef(true);

    const [limit, setLimit] = useState(20); //for pagination

    const [subCategoryActive, setSubCategoryActive] = useState(-1);
    const [isAppDataFetchLoading, setIsAppDataFetchLoading] = useState(true);
    const [isAppDataFetchError, setIsAppDataFetchError] = useState(false);
    const [appDataFetchMsg, setIsAppDataFetchMsg] = useState("");
    const [subCategories, setSubCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);  // To manage loading state
    const [hasMoreProducts, setHasMoreProducts] = useState(true);




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


    const btnSubCategoryAction = (sub_category_id) => {
        console.log(sub_category_id, "SUB CATEGORY SELECTED")
        setSubCategoryActive(sub_category_id);
        isInitialLoadRef.current = true;
        offsetRef.current = 0; // Reset offset for new fetch
        setLoading(true); // Set loading to true
        setProducts([]); // Clear old products
        setHasMoreProducts(true); // Reset hasMore for new fetch
        setIsAppDataFetchLoading(true); // Set loading to true
        console.log(products.length, "PRODUCTS LENGTH")
        // fetchData(); // Fetch new data
    };


    const productCardAction = (product) => {
        props.navigation.navigate("ProductDetails", { product_id: product.product_id });
    };


    const fetchData = useCallback(async () => {
        console.log("Fetching Products data... OFFSET:", offsetRef.current);
        if (!loading || !hasMoreProducts) return;
        // if (isInitialLoadRef.current) {
        //     setProducts([]); // Explicitly reset to empty if it's a fresh load
        // }
        if(subCategoryActive !== -1) {
            console.log("Fetching Products by subcategory...");
            await getAllProductsBySubCategory({ productsScreenLoading, category_id: category_id_selected, sub_category_id: subCategoryActive, limit: limit, offset: offsetRef.current });
        }else{
            console.log("Fetching Products by category...");
            await getAllProductsByCategory({ productsScreenLoading, category_id: category_id_selected, limit: limit, offset: offsetRef.current });
            
        }
        offsetRef.current += limit; // Increment offset for next batch
    }, [offsetRef, isAppDataFetchLoading, hasMoreProducts, loading, limit]);

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [fetchData]),
    );

    const productsScreenLoading = async (isFetchingDataError, message, fetchedProducts) => {
        console.log("Loading products screen results...");
        console.log("returned Productssss: " + fetchedProducts);
        console.log( fetchedProducts);
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
                if (subCategories.length === 0) {
                    const subCategoriesFetch = await db.getAllAsync(
                        `SELECT * FROM sub_category WHERE category_id = ${category_id_selected} LIMIT 20`
                    );
                    setSubCategories(subCategoriesFetch);
                }

               
                if (fetchedProducts.length === 0) {
                    if (isInitialLoadRef.current) {
                        setProducts([]); // Explicitly reset to empty if it's a fresh load
                    }
                    setHasMoreProducts(false);
                } else {
                    if (isInitialLoadRef.current) {
                        setProducts(fetchedProducts); // Replace on initial load
                        isInitialLoadRef.current = false;
                    } else {
                        setProducts(prev => [...prev, ...fetchedProducts]); // Append on scroll
                    }
                    offsetRef.current += fetchedProducts.length;
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
            <ActivityIndicator size="small" color="#000" />
        </View>
    );

    const renderSubCategoryList = ({ item }) => (
        <View>

            <TouchableOpacity
                key={item.sub_category_id}
                style={[
                    styles.categoryButton,
                    item.sub_category_id === subCategoryActive && styles.activeCategory
                ]}
                onPress={() => btnSubCategoryAction(item.sub_category_id)}
                disabled={item.sub_category_id === subCategoryActive} // ✅ disable if active
            >
                <Text
                    style={[
                        styles.categoryText,
                        item.sub_category_id === subCategoryActive && styles.activeCategoryText
                    ]}
                >
                    {item.sub_category_name}
                </Text>
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
                        <Text style={styles.headerText}>You are navigating in {category_name_selected}</Text>
                    </View>
                    <FlatList
                        ListHeaderComponent={
                            <TouchableOpacity
                                key={-1}
                                style={[
                                    styles.categoryButton,
                                    -1 === subCategoryActive && styles.activeCategory
                                ]}
                                onPress={() => btnSubCategoryAction(-1)}
                                disabled={-1 === subCategoryActive} // ✅ disable if active
                            >
                                <Text
                                    style={[
                                        styles.categoryText,
                                        -1 === subCategoryActive && styles.activeCategoryText
                                    ]}
                                >
                                    All
                                </Text>
                            </TouchableOpacity>

                        }
                        data={subCategories}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.horizontalListContainer}
                        renderItem={renderSubCategoryList}
                        keyExtractor={item => item.sub_category_id.toString() + Math.random()}
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

export default ProductsByCategoryScreen;