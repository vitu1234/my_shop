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

function ProductsByCategoryScreen(props) {
    const category_id_selected = props.route.params.category_id
    const category_name_selected = props.route.params.category_name
    const db = useSQLiteContext();
    const [cartItemsCount, setCartItemsCount] = useContext(CartContext);
    const [isLoggedIn, setLoggedInStatus] = useContext(AppContext);

    const [subCategoryActive, setSubCategoryActive] = useState(-1);
    const [isAppDataFetchLoading, setIsAppDataFetchLoading] = useState(true);
    const [isAppDataFetchError, setIsAppDataFetchError] = useState(false);
    const [appDataFetchMsg, setIsAppDataFetchMsg] = useState("");
    const [subCategories, setSubCategories] = useState([]);
    const [products, setProducts] = useState([]);
    // const [db, setDb] = useState(null);
    const [page, setPage] = useState(1);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [productsLoading, setProductsLoading] = useState(true); // for when a subcategory is selected


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
        console.log(sub_category_id, "SU CATEGORY SELECTED")
        setSubCategoryActive(sub_category_id);
        setProducts([]);         // Clear old products
        setPage(1);              // Reset page for pagination
        setHasMore(true);        // Reset hasMore for new fetch
    };


    const productCardAction = (product) => {
        props.navigation.navigate("ProductDetails", { product_id: product.product_id });
    };

    const fetchProducts = async (pageNumber) => {
        if (!db || isFetchingMore || !hasMore) return;

        setIsFetchingMore(false); // for full loading of the screen
        setProductsLoading(true); // for when a subcategory is selected

        try {
            const baseQuery = `
                SELECT product.*, product_attributes.product_attributes_price, product_sub_category.category_name
                FROM product_sub_category 
                INNER JOIN product 
                    ON product_sub_category.product_id = product.product_id 
                INNER JOIN product_attributes 
                    ON product.product_id = product_attributes.product_id
                WHERE product_attributes.product_attributes_default = 1 
                  AND product_sub_category.category_id = ${category_id_selected}
                  ${subCategoryActive !== -1 ? `AND product_sub_category.sub_category_id = ${subCategoryActive}` : ''}
                GROUP BY product_sub_category.product_id
                ORDER BY RANDOM()
                LIMIT 20 OFFSET ${pageNumber * 20}
            `;
            console.log("SQL Query:", baseQuery);


            const fetchedProducts = await db.getAllAsync(baseQuery);

            if (fetchedProducts.length === 0) {
                setHasMore(false);
            } else {
                setProducts(prev => [...prev, ...fetchedProducts]);
            }

        } catch (error) {
            console.error("Error fetching products:", error);
            setHasMore(false);
        } finally {
            setIsFetchingMore(false);
            setProductsLoading(false);
        }
    };


    const fetchData = useCallback(async () => {
        if (db) {
            setLoggedInStatus(isLoggedIn);
            productsScreenLoading(false, "Fetched data")
        }
    }, [db]);

    useEffect(() => {
        console.log("Triggered useEffect with:", { page, subCategoryActive });
        if (page === 1) {
            setProducts([]);
        }
    
        setProductsLoading(true);
    
        fetchData();
        fetchProducts(page - 1);
    }, [page, subCategoryActive]);


    const productsScreenLoading = async (isFetchingDataError, message) => {
        setIsAppDataFetchLoading(false);

        if (isFetchingDataError) {
            setIsAppDataFetchError(true);
            setIsAppDataFetchMsg(message);
            Toast.show({ text1: 'Error', text2: message, position: 'bottom', bottomOffset: 50 });
            return;
        }

        if (db) {
            try {
                const subCategoriesFetch = await db.getAllAsync(
                    `SELECT * FROM sub_category WHERE category_id = ${category_id_selected} LIMIT 20`
                );
                setSubCategories(subCategoriesFetch);
            } catch (err) {
                setIsAppDataFetchError(true);
                setIsAppDataFetchMsg("Error fetching sub_categories");
            }
        } else {
            setIsAppDataFetchError(true);
            setIsAppDataFetchMsg("Local Database error...");
        }
    };


    const loadMoreProducts = () => {
        console.log("loading more function")
        if (!isFetchingMore && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const renderCategoryList = ({ item }) => (
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
        if (!isFetchingMore) return null;
        return (
            <View style={styles.footer}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    };

    if (isAppDataFetchLoading) {
        return (
            <View style={styles.container}>
                <ContentLoader
                    active={true}
                    loading={true}
                    pRows={5}
                    pHeight={[70, 100, 50, 70, 160, 77]}
                    pWidth={[100, 300, 70, 200, 300, 300]}
                />
            </View>
        );
    } else if (isAppDataFetchError) {
        return (
            <View style={styles.container}>
                <Heading style={styles.errorText} size="sm" fontWeight="bold">
                    <Text>{appDataFetchMsg}</Text>
                </Heading>
            </View>
        );
    } else {
        return (
            <FlatList
                style={styles.container}
                data={[{ type: 'header' }, { type: 'sub_categories', data: subCategories }, {
                    type: 'products',
                    data: products
                }]}
                renderItem={({ item }) => {
                    if (item.type === 'header') {
                        return (
                            <View style={styles.headerContainer}>

                                <Text style={styles.headerText}>Navigating in {category_name_selected}</Text>

                            </View>
                        );

                    } else if (item.type === 'sub_categories') {

                        return (
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
                                style={styles.container}
                                data={item.data}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.horizontalListContainer}
                                renderItem={renderCategoryList}
                                keyExtractor={(item, index) => index.toString()} // Ensure each item has a unique key
                            />
                        );

                    } else if (item.type === 'products') {

                        if (productsLoading) {
                            return (
                                <View style={styles.container}>
                                    <ActivityIndicator size="small" color="#000" />
                                </View>
                            );
                        }
                    
                        if (products.length === 0) {
                            return (
                                <View style={styles.container}>
                                    <Heading style={styles.errorText} size="md" fontWeight="bold">
                                        <Text>No products in the selected subcategory</Text>
                                    </Heading>
                                </View>
                            );
                        }
                        return (
                            <View style={styles.flashProductsContainer}>

                                <FlatList
                                    style={styles.container}
                                    data={item.data}
                                    numColumns={2}
                                    columnWrapperStyle={styles.columnWrapperStyle}
                                    contentContainerStyle={styles.flashProductsListContainer}
                                    renderItem={renderProductList}
                                    keyExtractor={(item, index) => index.toString()} // Ensure each item has a unique key
                                />
                            </View>
                        );
                    }
                }}
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={renderFooter}
                onEndReached={loadMoreProducts}
                onEndReachedThreshold={0.5}
            />
        );
    }
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
        fontWeight: 'bold',
    },
    productCardContainer: {
        width: (width - 30) / 2 - 15,
        marginHorizontal: 5,
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
        justifyContent: 'space-between',
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
