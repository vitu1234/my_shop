import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, ToastAndroid, FlatList, Dimensions, ScrollView } from "react-native";
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
    // console.log(props.navigation);
    const [cartItemsCount, setCartItemsCount] = useContext(CartContext);
    const [isLoggedIn, setLoggedInStatus] = useContext(AppContext);

    const [categoryActive, setCategoryActive] = useState(-1);
    const [IsAppDataFetchLoading, setIsAppDataFetchLoading] = useState(true);
    const [IsAppDataFetchError, setIsAppDataFetchError] = useState(false);
    const [appDataFetchMsg, setIsAppDataFetchMsg] = useState("");

    const [categories, setCategories] = useState([]);
    const [products_first_row, setProductsFirstRow] = useState([]);
    const [flash_products, setFlashProducts] = useState([]);
    const [db, setDb] = useState(null);

    const btnCategoryAction = (category_id) => {
        setCategoryActive(category_id);
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
            // ToastAndroid.showWithGravityAndOffset(
            //     message,
            //     ToastAndroid.LONG,
            //     ToastAndroid.BOTTOM,
            //     25,
            //     50,
            // );
            Toast.show({
                text1: 'Hello',
                text2: message,
                position: 'bottom',
                bottomOffset: 50,
            });
        } else {
            setIsAppDataFetchError(false);
            setIsAppDataFetchMsg(message);

            if (db) {
                const categories = await db.getAllAsync("SELECT * FROM category ORDER BY RANDOM()");
                setCategories(categories);

                const productsFirstRow = await db.getAllAsync("SELECT * FROM products_homescreen ORDER BY RANDOM() LIMIT 10");
                setProductsFirstRow(productsFirstRow);

                const productsHome = await db.getAllAsync("SELECT * FROM products_homescreen ORDER BY RANDOM() LIMIT 20");
                setFlashProducts(productsHome);

                console.log("productsFirstRow");
                console.log(productsFirstRow);
            }
        }
    };

    useEffect(() => {
        const initialize = async () => {
            try {
                const database = await connectToDatabase();
                setDb(database);
                await setCartCounterNumber();
                if (isLoggedIn) {
                    setLoggedInStatus(true);
                } else {
                    setLoggedInStatus(false);
                }
                await getHomeScreen({ homeScreenLoading });
            } catch (error) {
                console.error("Error during initialization:", error);
                // Handle any errors appropriately
            }
        };

        initialize();
    }, [isLoggedIn, setCartItemsCount, setLoggedInStatus]);

    const renderCategoryList = categories.map((category) => (
        <ButtonCategory
            key={category.category_id}
            data={{
                btnText: category.category_name,
                category_id: category.category_id,
                action: btnCategoryAction,
                bgColor: category.category_id === categoryActive,
            }}
        />
    ));

    const renderProductList = products_first_row.map((product) => (
        <View key={product.product_id} style={{ width: "8%", marginEnd: 20 }}>
            <ProductCard data={{
                product: product,
                action: productCardAction,
            }} />
        </View>
    ));

    if (IsAppDataFetchLoading) {
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
    } else if (IsAppDataFetchError) {
        return (
            <View style={styles.container}>
                <Heading style={styles.errorText} size="sm" fontWeight="bold">
                    {appDataFetchMsg}
                </Heading>
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <Heading size="md" fontWeight="bold">
                    Let's help you find what you want!
                </Heading>
                <ScrollView
                    ref={(scrollView) => {
                        scrollView = scrollView;
                    }}
                    marginTop={5}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    decelerationRate={0}
                    snapToInterval={width - 60}
                    snapToAlignment={"center"}
                    contentInset={{
                        top: 0,
                        left: 30,
                        bottom: 0,
                        right: 30,
                    }}
                >
                    <ButtonCategory
                        data={{
                            btnText: "All",
                            category_id: -1,
                            action: btnCategoryAction,
                            bgColor: categoryActive === -1,
                        }}
                    />
                    {renderCategoryList}
                </ScrollView>

                <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                    <VStack>
                        <ScrollView
                            ref={(scrollView) => {
                                scrollView = scrollView;
                            }}
                            marginTop={5}
                            showsHorizontalScrollIndicator={false}
                            horizontal={true}
                            decelerationRate={0}
                            snapToInterval={width - 60}
                            snapToAlignment={"center"}
                            contentInset={{
                                top: 0,
                                left: 30,
                                bottom: 0,
                                right: 30,
                            }}
                        >
                            {renderProductList}
                        </ScrollView>
                        <Divider style={{ marginTop: 10 }} />
                        <View style={{ display: "flex", direction: "row" }}>
                            <HStack style={{ marginTop: 15 }}>
                                <Heading size="md" fontWeight="bold">
                                    Flash Products
                                </Heading>
                                <Button
                                    onPress={() => console.log("Go to all products")}
                                    variant={"outline"}
                                    size={"sm"}
                                    style={{ alignSelf: "flex-end", marginLeft: "auto" }}
                                >
                                    <Text>View All</Text>
                                </Button>
                            </HStack>
                            <ScrollView horizontal={true} contentContainerStyle={{ width: "100%", height: "100%" }}>
                                <FlatList
                                    columnWrapperStyle={{ justifyContent: "space-between" }}
                                    contentContainerStyle={{ paddingBottom: 80 }}
                                    numColumns={2}
                                    horizontal={false}
                                    data={flash_products}
                                    renderItem={({ item }) => (
                                        <Box style={{ width: "45%" }} py="2">
                                            <ProductCard
                                                key={item.product_id}
                                                data={{
                                                    product: item,
                                                    action: productCardAction,
                                                    cardWidth: 200,
                                                }}
                                            />
                                        </Box>
                                    )}
                                    keyExtractor={item => item.product_id}
                                />
                            </ScrollView>
                        </View>
                    </VStack>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#fff",
        marginTop: 5,
    },
    cardContainer: {
        flex: 1,
        flexDirection: "column",
    },
    errorText: {
        color: "#b60303",
        alignSelf: "center",
    },
    card: {
        flex: 1,
        margin: 10,
        flexBasis: "50%",
    },
});

export default HomeScreen;
