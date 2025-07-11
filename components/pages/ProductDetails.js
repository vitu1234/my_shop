import React, { useCallback, useContext, useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { AppContext, CartContext } from "@/app_contexts/AppContext";
import Carousel from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";
import { SBItem } from "@/components/carousel/SBItem";
import { window } from "@/components/carousel/constants";
import { useSharedValue } from "react-native-reanimated";
import { useSQLiteContext } from 'expo-sqlite';

import { Heart, Share, Star, StarHalf } from "lucide-react-native";
import { FlatList } from "react-native-actions-sheet";
import ProductVariantCard from "./components/product/product_details/ProductVariantCard";
import ShippingDetails from "@/components/pages/components/product/product_details/ShippingDetails";
import {
    configureReanimatedLogger,
    ReanimatedLogLevel,
} from 'react-native-reanimated';

import { getProductDetailsByProductID } from "../config/API";

const { width } = Dimensions.get("window");

const PAGE_WIDTH = window.width;


function ProductDetails(props) {
    // console.log(props.route.params.db)

    const db = useSQLiteContext();

    const product_id = props.route.params.product_id;
    const [productQty, setProductQty] = useState(1);
    const [carouselImageIndex, setCarouselImageIndex] = useState(1);

    const [product, setProduct] = useState([])
    const [productVariants, setProductVariants] = useState([])
    const [productVariantDefault, setProductVariantDefault] = useState([])
    const [productImages, setProductImages] = useState([])
    const [productShipping, setProductShipping] = useState([])

    const [isLoggedIn, setLoggedInStatus] = useContext(AppContext);
    const [cartItemsCount, setCartItemsCount] = useContext(CartContext);
    const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);
    const [isAddingToCartBtn, setIsAddingToCartBtn] = useState(false);
    const [isPlusToCartBtnDisabled, setIsPlusToCartBtnDisabled] = useState(false);
    const [isMinusToCartBtnDisabled, setIsMinusToCartBtnDisabled] = useState(false);

    const [productsTotalAmount, setProductsTotalAmount] = useState(0);
    // This is the default configuration
    configureReanimatedLogger({
        level: ReanimatedLogLevel.warn,
        strict: false, // Reanimated runs in strict mode by default
    });
    const setCartCounterNumber = () => {
        //update cart counter
        /*db.transaction((tx) => {
          tx.executeSql(
            "SELECT * FROM cart",
            [],
            (tx, results) => {
              const len = results.rows.length;
              let amountTotal = 0;
              const temp = [];

              for (let i = 0; i < results.rows.length; ++i) {
                temp.push(results.rows.item(i));

                amountTotal += (results.rows.item(i).qty * results.rows.item(i).product_price);
              }


              setProductsTotalAmount(amountTotal);
              setCartItemsCount(len);

              // console.log("COUNTING");
            },
          );
        });*/
    };

    const fetchProductData = useCallback(async () => {
        if (db) {
            // await getProduct(product_id)
            await getProductDetailsByProductID({ product_id, productDetailsLoading: getProduct });
        }
    }, [product]);

    const getProduct = async (isFetchingDataError, message, fetchedProducts) => {

        if (isFetchingDataError) {
            console.error("Error fetching product details:", message);
            return;
        }

        console.log("Fetched Product Details:", fetchedProducts);
        setProduct(fetchedProducts.product);
        setProductVariants(fetchedProducts.product_variants);
        setProductShipping(fetchedProducts.product_shipping);
        // setProductAttributes(fetchedProducts.product_attributes);
        // setProductShipping(fetchedProducts.product_shipping);
        setProductImages(fetchedProducts.product_images.map(image => image.img_url));
        // setProductAttributeDefault(fetchedProducts.product_attributes.filter(attr => attr.product_attributes_default === 1));


        // const ProductDetails = await db.getFirstAsync('SELECT * FROM product WHERE product_id = ' + product_id);
        // const product_attributes = await db.getAllAsync('SELECT * FROM product_attributes WHERE product_id =' + product_id);
        // const product_sub_category = await db.getAllAsync('SELECT * FROM product_sub_category WHERE product_id =' + product_id);
        // // const product_shipping = await db.getAllAsync('SELECT * FROM product_shipping INNER JOIN shipping_company ON product_shipping.shipping_company_id = shipping_company.shipping_company_id WHERE product_id =' + product_id);

        // const product_images = [];
        // for await (const row of db.getEachAsync('SELECT * FROM product_images WHERE product_id = ' + product_id)) {
        //     product_images.push(row.img_url);
        // }

        const product_variants = [];
        for (let i = 0; i < product_variants.length; i++) {
            try {
                if (product_variants[i].is_default == 1 && product_variants[i].is_active == 1) {
                    product_variants.push(product_variants[i])
                }
            } catch (error) {
                console.log("failed to read property of product variant", error)
            }
        }

        // setProduct(ProductDetails)
        // setProductImages(product_images)
        // setProductAttributeDefault(product_attribute_default)
        // setProductAttributes(product_attributes)
        // setProductShipping(product_shipping)

    }


    useEffect(() => {
        fetchProductData();
    }, []);


    useEffect(() => {
        if (productQty === 1) {
            setIsMinusToCartBtnDisabled(true);
        }
        // setProductPrice(productQty * (parseFloat(0)));
        setCartCounterNumber();

    }, [productQty, cartItemsCount, productsTotalAmount, productVariantDefault]);


    const addToCart = async () => {
        console.log("adding to cart");
        console.log(productVariantDefault);

        const productVariantId = productVariantDefault[0].product_variant_id;

        try {
            // Fetch existing cart items
            const cartItemsList = await db.getAllAsync("SELECT * FROM cart");
            console.log("Cart Items Count:", cartItemsList.length);

            let isUpdated = false;

            for (const row of cartItemsList) {
                console.log("Looping: ", row.id, row.product_variant_id, row.qty);

                // Check if the item already exists in the cart
                if (productVariantId === row.product_variant_id) {
                    const qtyNow = row.qty + 1;
                    console.log("Updating Quantity to:", qtyNow);

                    // Update the quantity
                    const updateResult = await db.runAsync(
                        'UPDATE cart SET qty = ? WHERE id = ?',
                        qtyNow,
                        row.id
                    );
                    console.log("Cart Update Result:", updateResult);
                    isUpdated = true;
                    break; // No need to continue looping if item is found
                }
            }

            // If the item is not found in the cart, insert it
            if (!isUpdated) {
                const insertResult = await db.runAsync(
                    'INSERT INTO cart (product_variant_id, qty) VALUES (?, ?)',
                    productVariantId,
                    1
                );
                console.log("Insert Result:", insertResult.lastInsertRowId, insertResult.changes);
            }

            // Count the total number of items in the cart
            const countResult = await db.getFirstAsync("SELECT COUNT(*) as totalItems FROM cart");
            console.log("Total Items in Cart After Operation:", countResult.totalItems);

            setCartItemsCount(countResult.totalItems)
            
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };


    const addProductQty = () => {
        //amount should not exit the qty in inventory
        const before_add = productQty + 1;
        if (before_add <= product.qty) {
            setProductQty(productQty + 1);
            setIsPlusToCartBtnDisabled(false);
            setIsMinusToCartBtnDisabled(false);
        } else {
            setIsPlusToCartBtnDisabled(true);
        }
    };

    const minusProductQty = () => {
        if (productQty === 1) {
            setProductQty(1);
            setIsMinusToCartBtnDisabled(true);
        } else {
            setProductQty(productQty - 1);
            setIsPlusToCartBtnDisabled(false);
            setIsMinusToCartBtnDisabled(false);
        }
    };

    const openCart = () => {
        props.navigation.navigate("Cart");
    };


    const windowWidth = useWindowDimensions().width;
    const scrollOffsetValue = useSharedValue(0);
    const [isVertical, setIsVertical] = React.useState(false);
    const [isFast, setIsFast] = React.useState(false);
    const [isAutoPlay, setIsAutoPlay] = React.useState(true);
    const [isPagingEnabled, setIsPagingEnabled] = React.useState(true);
    const ref = React.useRef(null);

    const baseOptions = isVertical
        ? ({
            vertical: true,
            width: windowWidth,
            height: PAGE_WIDTH / 2,
        })
        : ({
            vertical: false,
            width: windowWidth,
            // height: PAGE_WIDTH / 2,
        });

    const productVariantCardAction = (product_variant_selected) => {

        console.log("Selected Product Variant:", product_variant_selected);

        let selectedVariantArray = []
        selectedVariantArray.push(product_variant_selected)
        setProductVariantDefault(selectedVariantArray)
    };

    const renderProductVariantList = ({ item }) => (

        <View key={item.product_variant_id} style={styles.productCardContainer}>
            <ProductVariantCard data={{
                productVariant: item,
                action: productVariantCardAction,
                activeVariant: productVariantDefault
            }} />
        </View>
    );


    return (
        <View style={{ flex: 1 }}>
            <FlatList
                showsVerticalScrollIndicator={false}
                style={{ marginBottom: 98 }}
                data={[
                    { type: 'carousel' },
                    { type: 'productDetails' },
                    { type: 'shippingDetails' }
                ]}
                renderItem={({ item }) => {
                    // console.log(item.type)
                    if (item.type === 'carousel') {
                        return (
                            <SafeAreaView edges={["left", "right"]}  >
                                <View >
                                    <Carousel
                                        {...baseOptions}
                                        // enabled // Default is true, just for demo
                                        ref={ref}
                                        testID={"xxx"}
                                        style={{ width: "100%", height: 300, backgroundColor: '#fff' }}
                                        autoPlay={false}
                                        autoPlayInterval={isFast ? 100 : 2000}
                                        data={productImages}
                                        onScrollStart={() => {
                                            console.log('===1');
                                        }}
                                        onScrollEnd={() => {
                                            console.log('===2');
                                        }}
                                        snapEnabled={false}
                                        onConfigurePanGesture={g => g.enabled(false)}
                                        pagingEnabled={isPagingEnabled}
                                        // onSnapToItem={index => console.log("current index:", index)}
                                        onSnapToItem={index => { setCarouselImageIndex(index + 1) }}
                                        renderItem={({ index }) => <SBItem img_url={productImages[index]} key={index} index={index} />}
                                    />

                                    <View style={{
                                        position: 'absolute',
                                        top: 20, // Adjust to position at bottom of carousel area
                                        right: 20,  // Adjust as desired
                                        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Optional for contrast
                                        padding: 8,
                                        borderRadius: 5,
                                    }}>
                                        <Text style={{ color: '#fff' }}>{carouselImageIndex}/{productImages.length}</Text>
                                    </View>

                                    <View style={{
                                        position: 'absolute',
                                        bottom: 20, // Adjust to position at bottom of carousel area
                                        right: 20,  // Adjust as desired
                                        // Optional for contrast

                                    }}>
                                        <TouchableOpacity>
                                            <View style={{
                                                backgroundColor: '#fff', padding: 4,
                                                borderRadius: 18
                                            }}>
                                                <Heart fill={'red'} color={'red'} size={28} />
                                            </View>
                                        </TouchableOpacity>
                                        <Text style={{
                                            // margin: 1
                                        }}></Text>
                                        <TouchableOpacity >
                                            <View style={{
                                                backgroundColor: '#fff', padding: 4,
                                                borderRadius: 18
                                            }}>
                                                <Share size={28} />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ flex: 1 }}></View>
                            </SafeAreaView>
                        );
                    } else if (item.type === 'productDetails') {
                        return (
                            <View style={styles.detailsContainer}>
                                {/* <Text>Product Details will come here</Text> */}
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end'
                                }}>

                                    <Star size={20} color={'orange'} fill={'orange'} />
                                    <Star size={20} color={'orange'} fill={'orange'} />
                                    <Star size={20} color={'orange'} fill={'orange'} />
                                    <Star size={20} color={'orange'} fill={'orange'} />
                                    <StarHalf size={20} color={'orange'} fill={'orange'} />
                                    <Text style={{
                                        fontSize: 16,
                                        color: '#424242',
                                        marginTop: 2

                                    }}>(2,390)</Text>
                                </View>

                                <View style={{
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    marginTop: 5
                                }}>
                                    <Text style={{
                                        fontSize: 16,
                                        color: '#424242',
                                        marginTop: 2,
                                        marginBottom: 16,
                                        fontWeight: 'bold'
                                    }}>
                                        {product.product_name}
                                    </Text>
                                </View>

                                <FlatList
                                    style={styles.container}
                                    data={productVariants}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.horizontalListContainer}
                                    renderItem={renderProductVariantList}
                                    keyExtractor={item => item.product_variant_id.toString()}
                                />
                                {/* <Text>HAHAHAHAHA </Text>
                                <Text>HAHAHAHAHA </Text>
                                <Text>HAHAHAHAHA </Text>
                                <Text>HAHAHAHAHA </Text>
                                <Text>HAHAHAHAHA </Text>
                                <Text>HAHAHAHAHA </Text>
                                <Text>HAHAHAHAHA </Text>
                                <Text>HAHAHAHAHA </Text>
                                <Text>HAHAHAHAHA </Text> */}
                            </View>

                        );
                    } else if (item.type === 'shippingDetails') {
                        return (
                            <View style={styles.detailsContainer}>
                                <ShippingDetails data={product_id} />
                            </View>
                        )
                    }
                    return null;
                }}
                keyExtractor={(item, index) => index.toString()} // Ensure each item has a unique key

            />
            <View style={styles.actionButtonsContainer}>
                <TouchableOpacity style={styles.button} onPress={addToCart}>
                    <Text style={styles.buttonText}>Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.buyNowButton]} >
                    <Text style={styles.buttonText}>Buy Now</Text>
                </TouchableOpacity>
            </View>
        </View>




    );



};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowOpacity: 0.5,
        shadowRadius: 3,
        shadowColor: "black",
        shadowOffset: {
            height: 0,
            width: 0,
        },
        elevation: 0,
        marginVertical: 20,
    },
    thumb: {
        height: 300,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        width: "100%",
    },
    infoContainer: {
        padding: 10,
        alignItems: "center",
    },
    name: {
        color: "#424242",
        fontSize: 13,
        fontWeight: "bold",
    },
    price: {
        color: "black",
        fontSize: 16,
        fontWeight: "900",

    }, prodDesc: {
        color: "#424242",
        marginBottom: 8,
        padding: 10,
        textAlign: "justify",

    }, cartBtn: {
        // backgroundColor: '#000000',
        height: 50,
        width: "100%",

    },
    cartText: {
        color: "#fff",
        padding: 10,

    },


    productDetailContainer: {
        // padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    productDetailText: {
        fontSize: 16,
    },
    sectionHeaderContainer: {
        // paddingVertical: 10,
        backgroundColor: "#f8f8f8",
        paddingHorizontal: 20,
    },
    sectionHeaderText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    carouselIndicator: {
        position: "absolute",
        top: 20,
        right: 20,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        padding: 8,
        borderRadius: 5,
    },
    actionButtonsContainer: {
        position: "absolute",
        bottom: 0,
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        padding: 16,
        backgroundColor: "#fff",
    },
    button: {
        flex: 1,
        backgroundColor: "#333",
        padding: 16,
        borderRadius: 5,
        margin: 5,
        alignItems: "center",
    },
    buyNowButton: {
        backgroundColor: "#FF5722",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },

    detailsContainer: {
        marginTop: 5,
        padding: 16,
        backgroundColor: '#fff',
        flexDirection: "column"
    }, productCardContainer: {
        width: (width - 30) / 2 - 8,
        marginHorizontal: 5,
    }
});

export default ProductDetails;
