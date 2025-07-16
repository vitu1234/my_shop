import React, { useCallback, useContext, useEffect, useState, useRef } from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from "react-native";
import { AppContext, CartContext } from "@/app_contexts/AppContext";
import Carousel from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";
import { SBItem } from "@/components/carousel/SBItem";
import { window } from "@/components/carousel/constants";
import { useSharedValue } from "react-native-reanimated";
import { useSQLiteContext } from 'expo-sqlite';
import { Heart, Share, Star, StarHalf, ChevronDown, ChevronUp } from "lucide-react-native";
import { FlatList } from "react-native-actions-sheet";
import ProductVariantCard from "./components/product/product_details/ProductVariantCard";
import ShippingDetails from "@/components/pages/components/product/product_details/ShippingDetails";
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { getProductDetailsByProductID } from "../config/API";

const { width } = Dimensions.get("window");
const PAGE_WIDTH = window.width;

function ProductDetails(props) {
    const db = useSQLiteContext();
    const product_id = props.route.params.product_id;
    const [productQty, setProductQty] = useState(1);
    const [carouselImageIndex, setCarouselImageIndex] = useState(1);
    const [product, setProduct] = useState([]);
    const [productVariants, setProductVariants] = useState([]);
    const [productVariantDefault, setProductVariantDefault] = useState([]);
    const [productImages, setProductImages] = useState([]);
    const [productShipping, setProductShipping] = useState([]);
    const [isLoggedIn, setLoggedInStatus] = useContext(AppContext);
    const [cartItemsCount, setCartItemsCount] = useContext(CartContext);
    const [isAddingToCartBtn, setIsAddingToCartBtn] = useState(false);
    const [isPlusToCartBtnDisabled, setIsPlusToCartBtnDisabled] = useState(false);
    const [isMinusToCartBtnDisabled, setIsMinusToCartBtnDisabled] = useState(false);
    const windowWidth = useWindowDimensions().width;
    const scrollOffsetValue = useSharedValue(0);
    const [isVertical] = useState(false);
    const [isFast] = useState(false);
    const [isAutoPlay] = useState(true);
    const [isPagingEnabled] = useState(true);
    const ref = useRef(null);
    const [showVariantAttributes, setShowVariantAttributes] = useState(true);
    const [productsTotalAmount, setProductsTotalAmount] = useState(0);

    configureReanimatedLogger({ level: ReanimatedLogLevel.warn, strict: false });

    const fetchProductData = useCallback(async () => {
        if (db) {
            await getProductDetailsByProductID({ product_id, productDetailsLoading: getProduct });
        }
    }, [product]);

    const getProduct = async (isFetchingDataError, message, fetchedProducts) => {
        if (isFetchingDataError) {
            console.error("Error fetching product details:", message);
            return;
        }

        const product_variants = [];
        for (let i = 0; i < fetchedProducts.product_variants.length; i++) {
            try {
                if (fetchedProducts.product_variants[i].is_default == 1 && fetchedProducts.product_variants[i].is_active == 1) {
                    setProductVariantDefault(fetchedProducts.product_variants[i]);
                    product_variants.push(fetchedProducts.product_variants[i]);
                }
            } catch (error) {
                console.log("failed to read property of product variant", error);
            }
        }

        setProduct(fetchedProducts.product);
        setProductVariants(fetchedProducts.product_variants);
        setProductShipping(fetchedProducts.product_shipping);
        setProductImages(fetchedProducts.product_images.map(image => image.img_url));
    };

    useEffect(() => {
        fetchProductData();
    }, []);

    useEffect(() => {
        if (productQty === 1) {
            setIsMinusToCartBtnDisabled(true);
        }
    }, [productQty, cartItemsCount, productsTotalAmount, productVariantDefault]);

    const addToCart = async () => {
        const productVariantId = productVariantDefault.product_variant_id;
        console.log("Adding to cart productVariantId:", productVariantDefault);

        try {
            const cartItemsList = await db.getAllAsync("SELECT * FROM cart");
            let isUpdated = false;

            for (const row of cartItemsList) {
                if (productVariantId === row.product_variant_id) {
                    const qtyNow = row.qty + 1;
                    await db.runAsync('UPDATE cart SET qty = ? WHERE id = ?', qtyNow, row.id);
                    isUpdated = true;
                    break;
                }
            }

            if (!isUpdated) {
                await db.runAsync('INSERT INTO cart (product_id,product_variant_id, qty) VALUES (?, ?, ?)',
                    product_id, productVariantId, 1);
            }

            const countResult = await db.getFirstAsync("SELECT COUNT(*) as totalItems FROM cart");
            setCartItemsCount(countResult.totalItems);
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    const baseOptions = isVertical
        ? { vertical: true, width: windowWidth, height: PAGE_WIDTH / 2 }
        : { vertical: false, width: windowWidth };

    const productVariantCardAction = (product_variant_selected) => {
        setProductVariantDefault(product_variant_selected);
        setShowVariantAttributes(true);
    };

    const renderProductVariantList = ({ item }) => (
        <View key={item.product_variant_id} style={styles.productCardContainer}>
            <ProductVariantCard data={{ productVariant: item, action: productVariantCardAction, activeVariant: productVariantDefault }} />
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
                    ...(productVariantDefault && productVariantDefault.product_variant_id ? [{ type: 'selectedVariantAttributes' }] : []),

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

                            </View>

                        );
                    } else if (item.type === 'selectedVariantAttributes') {
                        const attributes = productVariantDefault?.attributes || [];
                        if (attributes.length === 0) {
                            return null; // No attributes to display
                        }

                        return (
                            <View style={[styles.detailsContainer, {
                                backgroundColor: '#ffffff',
                                borderRadius: 12,
                                padding: 16,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                                elevation: 3,
                                marginHorizontal: 12,
                                marginBottom: 16,
                            }]}>
                                <TouchableOpacity
                                    onPress={() => setShowVariantAttributes(!showVariantAttributes)}
                                    style={{
                                        marginBottom: 12,
                                        alignSelf: 'flex-start',
                                        backgroundColor: '#f0f4f8',
                                        paddingVertical: 8,
                                        paddingHorizontal: 14,
                                        borderRadius: 20,
                                        borderWidth: 1,
                                        borderColor: '#d0d7de',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text style={{ fontSize: 14, color: '#0366d6', fontWeight: '600', marginRight: 6 }}>
                                        {showVariantAttributes ? 'Hide More Details' : 'Show More Details'}
                                    </Text>
                                    {showVariantAttributes ? (
                                        <ChevronUp size={16} color="#0366d6" />
                                    ) : (
                                        <ChevronDown size={16} color="#0366d6" />
                                    )}
                                </TouchableOpacity>


                                {showVariantAttributes && (
                                    <>
                                        <Text style={{
                                            fontWeight: '700',
                                            fontSize: 16,
                                            marginBottom: 10,
                                            color: '#1f2937',
                                            textAlign: 'center',
                                        }}>
                                            Details
                                        </Text>

                                        {attributes.map((attr, index) => (
                                            <View key={index} style={{ marginBottom: 12 }}>
                                                <Text style={{
                                                    fontSize: 14,
                                                    fontWeight: '600',
                                                    color: '#4e46e5c2',
                                                    marginBottom: 6,
                                                }}>
                                                    {attr.filter_name}
                                                </Text>

                                                <View style={{
                                                    flexDirection: 'row',
                                                    flexWrap: 'wrap',
                                                    gap: 6,
                                                }}>
                                                    {attr.option_labels.map((label, i) => (
                                                        <Text
                                                            key={i}
                                                            style={{
                                                                backgroundColor: "#e5e7eb88",
                                                                paddingVertical: 6,
                                                                paddingHorizontal: 12,
                                                                borderRadius: 8,
                                                                fontSize: 13,
                                                                color: "#111827",
                                                                marginRight: 6,
                                                                marginBottom: 6,
                                                            }}
                                                        >
                                                            {label.option_label}
                                                        </Text>
                                                    ))}
                                                </View>
                                            </View>
                                        ))}
                                    </>
                                )}
                            </View>
                        );
                    }

                    else if (item.type === 'shippingDetails') {
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
