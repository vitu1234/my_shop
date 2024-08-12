import React, { useContext, useEffect, useState, useCallback } from "react";
import { View,  StyleSheet,ScrollView, FlatList, Dimensions, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import ButtonCategory from "./components/ButtonCategory";
import ProductCard from "./components/ProductCard";
import { AppContext, CartContext } from "@/app_contexts/AppContext";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import ContentLoader from "react-native-easy-content-loader";
import { Divider } from "@/components/ui/divider";
import Toast from "react-native-toast-message";
import { connectToDatabase } from "@/components/config/sqlite_db_service";
import { getHomeScreen } from "../config/API";
import {Heading} from "lucide-react-native";

const { width } = Dimensions.get("window");

function HomeScreen(props) {
    const [cartItemsCount, setCartItemsCount] = useContext(CartContext);
    const [isLoggedIn, setLoggedInStatus] = useContext(AppContext);

    const [categoryActive, setCategoryActive] = useState(-1);
    const [isAppDataFetchLoading, setIsAppDataFetchLoading] = useState(true);
    const [isAppDataFetchError, setIsAppDataFetchError] = useState(false);
    const [appDataFetchMsg, setIsAppDataFetchMsg] = useState("");
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [flashProducts, setFlashProducts] = useState([]);
    const [db, setDb] = useState(null);
    const [page, setPage] = useState(1);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const btnCategoryAction = (categoryId) => {
        setCategoryActive(categoryId);
    };

    const productCardAction = (product) => {
        props.navigation.navigate("ProductDetails", { data: product });
    };

    const fetchProducts = async (pageNumber) => {
        setIsFetchingMore(true);
        try {
            const fetchedProducts = await db.getAllAsync(`SELECT * FROM product ORDER BY RANDOM() LIMIT 20 OFFSET ${pageNumber * 20}`);
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
            await getHomeScreen({ homeScreenLoading });
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
            if (db) {
                const categories = await db.getAllAsync("SELECT * FROM sub_category ORDER BY RANDOM() LIMIT 10");
                setCategories(categories);

                const productsFirstRow = await db.getAllAsync("SELECT * FROM product ORDER BY RANDOM() LIMIT 10");
                setProducts(productsFirstRow);

                const productsHome = await db.getAllAsync("SELECT * FROM product ORDER BY RANDOM() LIMIT 20");
                setFlashProducts(productsHome);

                setIsAppDataFetchError(false);
                setIsAppDataFetchMsg(message);
            } else {
                setIsAppDataFetchError(true);
                setIsAppDataFetchMsg("Local Database error...");
            }
        }
    };

    const loadMoreProducts = () => {
        if (!isFetchingMore && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const renderCategoryList = ({ item }) => (
        <TouchableOpacity
            key={item.sub_category_id}
            style={[styles.categoryButton, item.sub_category_id === categoryActive && styles.activeCategory]}
            onPress={() => btnCategoryAction(item.sub_category_id)}
        >
            <Text style={styles.categoryText}>{item.sub_category_name}</Text>
        </TouchableOpacity>
    );

    const renderProductList = ({ item }) => (
        <View key={item.product_id} style={styles.productCardContainer}>
            <ProductCard data={{
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
                data={[{ type: 'header' }, { type: 'categories', data: categories }, { type: 'productsFirstRow', data: products }, { type: 'flashProducts', data: flashProducts }]}
                renderItem={({ item }) => {
                    if (item.type === 'header') {
                        return (
                            <View style={styles.headerContainer}>
                                <Heading style={styles.headerText} size="md" fontWeight="bold">
                                    <Text>Let's help you find what you want!</Text>
                                </Heading>
                            </View>
                        );
                    } else if (item.type === 'categories') {
                        return (
                            <FlatList
                                data={item.data}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.horizontalListContainer}
                                renderItem={renderCategoryList}
                                keyExtractor={item => item.sub_category_id.toString()}
                            />
                        );
                    } else if (item.type === 'productsFirstRow') {
                        return (
                            <FlatList
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
                                <HStack style={styles.flashProductsHeader}>
                                    <Heading size="md" fontWeight="bold">
                                        <Text>Flash Products</Text>
                                    </Heading>
                                    <Button
                                        onPress={() => console.log("Go to all products")}
                                        variant={"outline"}
                                        size={"sm"}
                                        style={styles.viewAllButton}
                                    >
                                        <Text>View All</Text>
                                    </Button>
                                </HStack>
                                <FlatList
                                    data={item.data}
                                    numColumns={2}
                                    columnWrapperStyle={styles.columnWrapperStyle}
                                    contentContainerStyle={styles.flashProductsListContainer}
                                    renderItem={renderFlashProduct}
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
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    categoryButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#e0e0e0',
        borderRadius: 20,
        marginHorizontal: 5,
    },
    activeCategory: {
        backgroundColor: '#000',
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
        backgroundColor: '#f8f8f8',
    },
    flashProductsHeader: {
        marginBottom: 10,
        justifyContent: 'space-between',
    },
    viewAllButton: {
        marginLeft: 'auto',
        borderColor: '#000',
        borderWidth: 1,
    },
    flashProductBox: {
        marginVertical: 10,
        width: (width - 30) / 2 - 15,
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
