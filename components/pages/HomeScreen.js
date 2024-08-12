import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Dimensions } from "react-native";
import ButtonCategory from "./components/ButtonCategory";
import ProductCard from "./components/ProductCard";
import { AppContext, CartContext } from "@/app_contexts/AppContext";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import ContentLoader from "react-native-easy-content-loader";
import { Divider } from "@/components/ui/divider";
import Toast from "react-native-toast-message";
import { connectToDatabase } from "@/components/config/sqlite_db_service";
import { getHomeScreen } from "../config/API";

const { width } = Dimensions.get("window");

function HomeScreen(props) {
    const [cartItemsCount, setCartItemsCount] = useContext(CartContext);
    const [isLoggedIn, setLoggedInStatus] = useContext(AppContext);

    const [categoryActive, setCategoryActive] = useState(-1);
    const [isAppDataFetchLoading, setIsAppDataFetchLoading] = useState(true);
    const [isAppDataFetchError, setIsAppDataFetchError] = useState(false);
    const [appDataFetchMsg, setIsAppDataFetchMsg] = useState("");

    const [categories, setCategories] = useState([]);
    const [productsFirstRow, setProductsFirstRow] = useState([]);
    const [flashProducts, setFlashProducts] = useState([]);
    const [db, setDb] = useState(null);

    const btnCategoryAction = (categoryId) => {
        setCategoryActive(categoryId);
    };

    const productCardAction = (product) => {
        props.navigation.navigate("ProductDetails", { data: product });
    };

    const setCartCounterNumber = async () => {
        if (db) {
            const cartItems = await db.getAllAsync('SELECT * FROM cart');
            setCartItemsCount(cartItems.length);
        }
    };

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
                setProductsFirstRow(productsFirstRow);

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

    useEffect(() => {
        if (db) {
            const fetchLoad = async () => {
                await setCartCounterNumber();
                setLoggedInStatus(isLoggedIn);
                await getHomeScreen({ homeScreenLoading });
            };
            fetchLoad();
        }
    }, [db]);

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

    const renderCategoryList = ({ item }) => (
        <ButtonCategory
            key={item.sub_category_id}
            data={{
                btnText: item.sub_category_name,
                category_id: item.sub_category_id,
                action: btnCategoryAction,
                bgColor: item.sub_category_id === categoryActive,
            }}
        />
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
        <Box style={styles.productBox} py="2">
            <ProductCard
                key={item.product_id}
                data={{
                    product: item,
                    action: productCardAction,
                    cardWidth: 200,
                }}
            />
        </Box>
    );

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
                    {appDataFetchMsg}
                </Heading>
            </View>
        );
    } else {
        return (
            <FlatList
                data={[{ type: 'header' }, { type: 'categories', data: categories }, { type: 'productsFirstRow', data: productsFirstRow }, { type: 'flashProducts', data: flashProducts }]}
                renderItem={({ item }) => {
                    if (item.type === 'header') {
                        return (
                            <View style={styles.headerContainer}>
                                <Heading size="md" fontWeight="bold">
                                    Let's help you find what you want!
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
                                        Flash Products
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
                ListFooterComponent={<View style={{ height: 80 }} />} // Add extra space at the bottom
                contentContainerStyle={styles.contentContainer}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    contentContainer: {
        paddingBottom: 80, // Adjust based on your content
    },
    horizontalListContainer: {
        paddingHorizontal: 30,
    },
    productCardContainer: {
        width: "8%",
        marginEnd: 20,
    },
    flashProductsContainer: {
        marginTop: 15,
    },
    flashProductsHeader: {
        marginTop: 15,
    },
    viewAllButton: {
        alignSelf: "flex-end",
        marginLeft: "auto",
    },
    columnWrapperStyle: {
        justifyContent: "space-between",
    },
    flashProductsListContainer: {
        paddingBottom: 80,
    },
    productBox: {
        width: "45%",
        height: 200,
    },
    headerContainer: {
        padding: 16,
    },
    errorText: {
        color: "#b60303",
        alignSelf: "center",
    },
});

export default HomeScreen;
