import React, { useContext, useEffect, useState, useCallback } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    FlatList,
    Dimensions,
    TouchableOpacity,
    Text,
    ActivityIndicator, Pressable
} from "react-native";
import ButtonCategory from "./components/ButtonCategory";
import ProductCard from "./components/product/ProductCard";
import { AppContext, CartContext } from "@/app_contexts/AppContext";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import ContentLoader from "react-native-easy-content-loader";
import { Divider } from "@/components/ui/divider";
import Toast from "react-native-toast-message";
import { getHomeScreen } from "../config/API";
import { Heading } from "lucide-react-native";

import { SQLiteProvider, useSQLiteContext, SQLiteDatabase } from 'expo-sqlite';


const { width } = Dimensions.get("window");

function HomeScreen(props) {
    const [cartItemsCount, setCartItemsCount] = useContext(CartContext);
    const [isLoggedIn, setLoggedInStatus] = useContext(AppContext);
    const db = useSQLiteContext();


    const [categoryActive, setCategoryActive] = useState(-1);
    const [isAppDataFetchLoading, setIsAppDataFetchLoading] = useState(true);
    const [isAppDataFetchError, setIsAppDataFetchError] = useState(false);
    const [appDataFetchMsg, setIsAppDataFetchMsg] = useState("");
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [flashProducts, setFlashProducts] = useState([]);


    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const btnCategoryAction = (categoryId, categoryName) => {
        setCategoryActive(categoryId);
        props.navigation.navigate("ProductsByCategoryScreen", { category_id: categoryId, category_name: categoryName});
        setCategoryActive(-1);
    };

    const productCardAction = (product) => {
        props.navigation.navigate("ProductDetails", { product_id: product.product_id});
    };

    const fetchData = useCallback(async () => {
        setLoggedInStatus(isLoggedIn);
        await getHomeScreen({ homeScreenLoading, db: db });

    });

    useEffect(() => {
        
        fetchData();
    }, []);



    const homeScreenLoading = async (isFetchingDataError, message) => {
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
            const categories = await db.getAllAsync("SELECT * FROM category ORDER BY RANDOM() LIMIT 10");
            const productsFirstRow = await db.getAllAsync("SELECT * FROM product WHERE is_default = 1 ORDER BY RANDOM() ");
            const productsHome = await db.getAllAsync("SELECT * FROM product WHERE is_default = 1 ORDER BY RANDOM() ");

            setCategories(categories);
            setProducts(productsFirstRow);
            setFlashProducts(productsHome);
            setIsAppDataFetchError(false);
            setIsAppDataFetchMsg(message);

        }
    };



    const renderCategoryList = ({ item }) => (
        <View>
            <TouchableOpacity
                key={item.category_id}
                style={[styles.categoryButton, item.category_id === categoryActive && styles.activeCategory]}
                onPress={() => btnCategoryAction(item.category_id, item.category_name)}
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

    const renderFlashProduct = ({ item }) => (
        <Box style={styles.flashProductBox} py="2">
            <ProductCard
                key={item.product_id}
                data={{
                    database: db,
                    product: item,
                    action: productCardAction,
                    cardWidth: (width - 30) / 2 - 15,
                }}
            />
        </Box>
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
                data={[{ type: 'header' }, { type: 'categories', data: categories }, {
                    type: 'productsFirstRow',
                    data: products
                }, { type: 'flashProducts', data: flashProducts }]}
                renderItem={({ item }) => {
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
                                keyExtractor={item => item.category_id.toString()}
                            />
                        );

                    } else if (item.type === 'productsFirstRow') {
                        return (
                            <FlatList
                                style={styles.container}
                                data={item.data}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.horizontalListContainer}
                                renderItem={renderProductList}
                                keyExtractor={item => item.product_id.toString()}
                            />
                        );
                    } else if (item.type === 'flashProducts') {
                        return (
                            <View style={styles.flashProductsContainer}>
                                <View style={[styles.flashProductsHeader, { justifyContent: 'space-between' }]}>
                                    <Text style={styles.headerText}>Flash Products</Text>
                                    <TouchableOpacity
                                        onPress={() => console.log("Go to all products")}

                                    >
                                        <Text style={{ color: '#2780e3', fontWeight: 'bold' }}>View All {">>"}</Text>
                                    </TouchableOpacity>
                                </View>
                                <FlatList
                                    style={styles.container}
                                    data={item.data}
                                    numColumns={2}
                                    columnWrapperStyle={styles.columnWrapperStyle}
                                    contentContainerStyle={styles.flashProductsListContainer}
                                    renderItem={renderFlashProduct}
                                    keyExtractor={item => `${item.product_id}-${item.product_variant_id}${+Math.floor(Math.random() * 1000)}`}

                                    removeClippedSubviews={true}
                                    maxToRenderPerBatch={10}
                                    windowSize={11}
                                    initialNumToRender={10}

                                    ListFooterComponent={renderFooter}
                                    // onEndReached={loadMoreProducts}
                                    onEndReachedThreshold={0.5}
                                />
                            </View>
                        );
                    }
                }}
                keyExtractor={(item, index) => index.toString()}
            // ListFooterComponent={renderFooter}
            // onEndReached={loadMoreProducts}
            // onEndReachedThreshold={0.5}
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

export default HomeScreen;
