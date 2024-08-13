import React, {useCallback, useContext, useEffect, useState} from "react";
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
import {AppContext, CartContext} from "@/app_contexts/AppContext";
import ProductCard from "./components/ProductCard";

import ContentLoader from "react-native-easy-content-loader";

const {width} = Dimensions.get("window");
import {connectToDatabase, db} from "../config/sqlite_db_service";
import {Text} from "@/components/ui/text"
import {useToast, Toast} from "@/components/ui/toast"
import {Heading} from "@/components/ui/heading"
import SearchFilterScreen from "@/components/pages/components/SearchFilterScreen";


function Products(props) {

    const [cartItemsCount, setCartItemsCount] = useContext(CartContext);
    const [isLoggedIn, setLoggedInStatus] = useContext(AppContext);

    const [categoryActive, setCategoryActive] = useState(-1);
    const [isAppDataFetchLoading, setIsAppDataFetchLoading] = useState(true);
    const [isAppDataFetchError, setIsAppDataFetchError] = useState(false);
    const [appDataFetchMsg, setIsAppDataFetchMsg] = useState("");
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [db, setDb] = useState(null);
    const [page, setPage] = useState(1);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);


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

    const btnCategoryAction = (category_id) => {
        console.log("GOES TO " + category_id + " CATEGORY");
        // setIsAppDataFetchLoading(true);
        // setIsAppDataFetchError(false);
        setCategoryActive(category_id);
        // getProductsScreen({productsScreenLoading, category_id});
    };

    const productCardAction = (product) => {
        // console.log(product);
        props.navigation.navigate("ProductDetails", {data: product});
    };

    const fetchProducts = async (pageNumber) => {
        setIsFetchingMore(true);
        try {
            const fetchedProducts = await db.getAllAsync(`SELECT * FROM product INNER JOIN product_attributes ON product.product_id = product_attributes.product_id WHERE product_attributes.product_attributes_default = 1 ORDER BY RANDOM() LIMIT 20 OFFSET ${pageNumber * 20}`);
            if (fetchedProducts.length === 0) {
                setHasMore(false);
            }
            setProducts(prevProducts => [...prevProducts, ...fetchedProducts]);
        } catch (error) {
            console.error("Error fetching products:", error);
            setHasMore(false);
        } finally {
            setIsFetchingMore(false);
        }
    };

    const fetchData = useCallback(async () => {
        if (db) {
            setLoggedInStatus(isLoggedIn);
            productsScreenLoading(false, "Fetched data")
        }
    }, [db]);

    useEffect(() => {
        if (db) {
            fetchData();
            fetchProducts(page - 1); // Load initial products
        }
    }, [db, page]);

    useEffect(() => {
        const initialize = async () => {
            if (!db) {
                try {
                    const database = await connectToDatabase();
                    setDb(database);
                } catch (error) {
                    console.error("Error during initialization:", error);
                }
            }
        };
        initialize();
    }, [db]);


    const productsScreenLoading = async (isFetchingDataError, message) => {
        setIsAppDataFetchLoading(false);
        if (isFetchingDataError) {
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
                const categoriesFetch = await db.getAllAsync("SELECT * FROM sub_category ORDER BY RANDOM() LIMIT 10");
                setCategories(categoriesFetch);

                const productsFetch = await db.getAllAsync("SELECT * FROM product INNER JOIN product_attributes ON product.product_id = product_attributes.product_id WHERE product_attributes.product_attributes_default = 1 ORDER BY RANDOM() LIMIT 20");
                setProducts(productsFetch);


                setIsAppDataFetchError(false);
                setIsAppDataFetchMsg(message);
            } else {
                setIsAppDataFetchError(true);
                setIsAppDataFetchMsg("Local Database error...");
            }
        }
    };

    const loadMoreProducts = () => {
        console.log("loading more function")
        if (!isFetchingMore && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const renderCategoryList = ({item}) => (
        <View>
            <TouchableOpacity
                key={item.sub_category_id}
                style={[styles.categoryButton, item.sub_category_id === categoryActive && styles.activeCategory]}
                onPress={() => btnCategoryAction(item.sub_category_id)}
            >
                <Text
                    style={[styles.categoryText, item.sub_category_id === categoryActive && styles.activeCategoryText]}>{item.sub_category_name}</Text>
            </TouchableOpacity>
        </View>
    )

    const renderProductList = ({item}) => (
        <View key={item.product_id} style={styles.productCardContainer}>
            <ProductCard data={{
                database: db,
                product: item,
                action: productCardAction,
            }}/>
        </View>
    );

    const renderFooter = () => {
        if (!isFetchingMore) return null;
        return (
            <View style={styles.footer}>
                <ActivityIndicator size="large" color="#000"/>
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
                data={[{type: 'header'}, {type: 'categories', data: categories}, {
                    type: 'products',
                    data: products
                }]}
                renderItem={({item}) => {
                    if (item.type === 'header') {
                        return (
                            <View style={styles.headerContainer}>

                                <Text style={styles.headerText}>Let's help you find what you want!</Text>

                            </View>
                        );
                    } else if (item.type === 'categories') {
                        return (
                            <FlatList
                                ListHeaderComponent={
                                    <TouchableOpacity
                                        key={-1}
                                        style={[styles.categoryButton, -1 === categoryActive && styles.activeCategory]}
                                        onPress={() => btnCategoryAction(-1)}
                                    >
                                        <Text
                                            style={[styles.categoryText, -1 === categoryActive && styles.activeCategoryText]}>All</Text>
                                    </TouchableOpacity>
                                }
                                style={styles.container}
                                data={item.data}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.horizontalListContainer}
                                renderItem={renderCategoryList}
                                keyExtractor={item => item.sub_category_id.toString()}
                            />
                        );

                    } else if (item.type === 'products') {
                        return (
                            <View style={styles.flashProductsContainer}>

                                <FlatList
                                    style={styles.container}
                                    data={item.data}
                                    numColumns={2}
                                    columnWrapperStyle={styles.columnWrapperStyle}
                                    contentContainerStyle={styles.flashProductsListContainer}
                                    renderItem={renderProductList}
                                    keyExtractor={item => item.product_id.toString()}
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

export default Products;
