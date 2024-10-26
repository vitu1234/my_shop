import React, { useCallback, useContext, useEffect, useState } from "react";
import { Dimensions, StyleSheet, TouchableHighlight, TouchableOpacity, View, Text } from "react-native";
import { AppContext, CartContext } from "@/app_contexts/AppContext";
import { ScrollView } from "react-native-gesture-handler";
import { ICarouselInstance } from "react-native-reanimated-carousel";
import Carousel from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";

import { SBItem } from "@/components/carousel/SBItem";
import SButton from "@/components/carousel/SButton";
import { ElementsText, window } from "@/components/carousel/constants";
import { useWindowDimensions } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { Toast } from "@/components/ui/toast";
import { SQLiteProvider, useSQLiteContext, SQLiteDatabase } from 'expo-sqlite';

import { Heart, Share } from "lucide-react-native";
import { FlatList } from "react-native-actions-sheet";

const PAGE_WIDTH = window.width;


function ProductDetails(props) {
    // console.log(props.route.params.db)
    const db = useSQLiteContext();
    const product_id = props.route.params.product_id;
    const [productQty, setProductQty] = useState(1);
    const [carouselImageIndex, setCarouselImageIndex] = useState(1);

    const [product, setProduct] = useState([])
    const [productAttributes, setProductAttributes] = useState([])
    const [productImages, setProductImages] = useState([])

    const [isLoggedIn, setLoggedInStatus] = useContext(AppContext);
    const [cartItemsCount, setCartItemsCount] = useContext(CartContext);
    const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);
    const [isAddingToCartBtn, setIsAddingToCartBtn] = useState(false);
    const [isPlusToCartBtnDisabled, setIsPlusToCartBtnDisabled] = useState(false);
    const [isMinusToCartBtnDisabled, setIsMinusToCartBtnDisabled] = useState(false);

    const [productsTotalAmount, setProductsTotalAmount] = useState(0);

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
            await getProduct(product_id)
        }
    }, [product]);

    const getProduct = async (product_id) => {
        // await Promise.all([F
        // 1. A new transaction begins

        const ProductDetails = await db.getFirstAsync('SELECT * FROM product WHERE product_id = ' + product_id);
        const product_attributes = await db.getAllAsync('SELECT * FROM product_attributes WHERE product_id =' + product_id);
        const product_sub_category = await db.getAllAsync('SELECT * FROM product_sub_category WHERE product_id =' + product_id);

        const product_images = [];
        for await (const row of db.getEachAsync('SELECT * FROM product_images WHERE product_id = ' + product_id)) {
            product_images.push(row.img_url);
        }

        setProduct(ProductDetails)
        setProductImages(product_images)
        console.log(product_images);

        // }),

        // ]);
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

    }, [productQty, cartItemsCount, productsTotalAmount]);


    const addToCart = async () => {
        // console.log("added to cart");
        // console.log(product);
        // setProductQty(productQty);
        //check if there are products in cart

        setIsAddingToCartBtn(true);
        /*
        try {
          //insert into cart
          await db.transaction((tx) => {
            tx.executeSql(
              "SELECT * FROM cart WHERE product_id = ?",
              [
                product.product_id,
              ],
              (tx, results) => {
                const len = results.rows.length;
                // console.log("dhdhd " + len);
                if (len > 0) {
                  db.transaction(async (tx) => {
                    await tx.executeSql(
                      "UPDATE cart SET qty=? WHERE product_id = ?",
                      [productQty, product.product_id],
                      () => {
                        // console.log("updated");
                        // Alert.alert("Success!", "Your data has been updated.");
                        db.transaction((tx) => {
                          tx.executeSql(
                            "SELECT * FROM cart",
                            [],
                            (tx, results) => {

                              let amountTotal = 0;
                              const temp = [];

                              for (let i = 0; i < results.rows.length; ++i) {
                                temp.push(results.rows.item(i));

                                amountTotal += (results.rows.item(i).qty * results.rows.item(i).product_price);
                              }

                              setProductsTotalAmount(amountTotal);
                              setCartItemsCount(results.rows.length);
                            },
                          );
                        });
                      },
                      error => {
                        console.log(error);
                      },
                    );
                  });
                } else {
                  db.transaction(async (tx) => {

                    await tx.executeSql(
                      "INSERT INTO cart(product_id,product_name,product_price,qty,img_url) VALUES (?,?,?,?,?);",
                      [product.product_id, product.product_name, product.price, productQty, product.img_url],
                    );
                    // console.log("added to sqlite");
                    db.transaction((tx) => {
                      tx.executeSql(
                        "SELECT * FROM cart",
                        [],
                        (tx, results) => {

                          let amountTotal = 0;
                          const temp = [];

                          for (let i = 0; i < results.rows.length; ++i) {
                            temp.push(results.rows.item(i));

                            amountTotal += (results.rows.item(i).qty * results.rows.item(i).product_price);
                          }

                          setProductsTotalAmount(amountTotal);
                          setCartItemsCount(results.rows.length);
                        },
                      );
                    });
                  });
                }
              },
            );
          });

          //update cart counter
          db.transaction((tx) => {
            tx.executeSql(
              "SELECT * FROM cart",
              [],
              (tx, results) => {
                let amountTotal = 0;
                const temp = [];

                for (let i = 0; i < results.rows.length; ++i) {
                  temp.push(results.rows.item(i));

                  amountTotal += (results.rows.item(i).qty * results.rows.item(i).product_price);
                }


                setProductsTotalAmount(amountTotal);
                setCartItemsCount(results.rows.length);
              },
            );
          });


        } catch (e) {
          // console.log(e);
        }
        */
        // setTimeout(setBottomSheetOpen(true), 2000);
        // setBottomSheetOpen(true);
        setTimeout(() => {
            setBottomSheetOpen(true);
            setIsAddingToCartBtn(false);
        }, 1000);

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
    const [data, setData] = React.useState([...new Array(4).keys()]);
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


    const renderProductItem = ({ item }) => {
        return item.isSectionHeader ? (
            <View style={styles.sectionHeaderContainer}>
                <Text style={styles.sectionHeaderText}>{item.title}</Text>
            </View>
        ) : (
            <View style={styles.productDetailContainer}>
                <Text style={styles.productDetailText}>{item.detail}</Text>
            </View>
        );
    };
    const productDetailsData = [
        { isSectionHeader: true, title: "Product Details" },
        { detail: "Product Name: " + product.product_name },
        { detail: "Description: " + product.description },
        { detail: "Price: $" + product.price },
        { detail: "Other Details: " + product.other_details },
    ];


    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={[
                    { type: 'carousel' },
                    { type: 'productDetails' }
                ]}
                renderItem={({ item }) => {
                    console.log(item.type)
                    if (item.type === 'carousel') {
                        return (
                            <SafeAreaView edges={["left","right"]}  >
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
                                <Text>Product Details will come here</Text>
                            </View>
                        );
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

    detailsContainer:{
        padding: 16,
        backgroundColor:'#fff'
    }
});

export default ProductDetails;
