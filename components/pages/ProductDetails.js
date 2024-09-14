import React, {useCallback, useContext, useEffect, useState} from "react";
import {Dimensions, StyleSheet, TouchableHighlight, TouchableOpacity, View} from "react-native";

import {AppContext, CartContext} from "@/app_contexts/AppContext";
import {ScrollView} from "react-native-gesture-handler";
import {ICarouselInstance} from "react-native-reanimated-carousel";
import Carousel from "react-native-reanimated-carousel";
import {SafeAreaView} from "react-native-safe-area-context";

import {SBItem} from "@/components/carousel/SBItem";
import SButton from "@/components/carousel/SButton";
import {ElementsText, window} from "@/components/carousel/constants";
import {useWindowDimensions} from "react-native";
import {useSharedValue} from "react-native-reanimated";
import {Toast} from "@/components/ui/toast";

const PAGE_WIDTH = window.width;


function ProductDetails(props) {
    console.log("PROPERRRR")
    // console.log(props.route.params.db)
    const db = props.route.params.db;
    const product_id = props.route.params.product_id;
    const [productQty, setProductQty] = useState(1);

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
        await Promise.all([
            // 1. A new transaction begins
            db.withExclusiveTransactionAsync(async () => {

                const product = await db.getFirstAsync('SELECT * FROM product');
                const product_attributes = await db.getFirstAsync('SELECT * FROM product_attributes');
                const product_images = [];
                const product_sub_category = await db.getFirstAsync('SELECT * FROM product_sub_category');
                for await (const row of db.getEachAsync('SELECT * FROM product_images WHERE product_id = ' + product_id)) {
                    product_images.push(row.img_url);
                }

                setProduct(product)
                setProductImages(product_images)
                console.log(product_images);

            }),

        ]);
    }


    useEffect(() => {
        if (db) {
            fetchProductData();
        }
    }, [db]);


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
    const [isAutoPlay, setIsAutoPlay] = React.useState(false);
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
            height: PAGE_WIDTH / 2,
        });
    return (
        <SafeAreaView edges={["bottom"]} style={{flex: 1}}>
            <Carousel
                {...baseOptions}
                loop
                enabled // Default is true, just for demo
                ref={ref}
                defaultScrollOffsetValue={scrollOffsetValue}
                testID={"xxx"}
                style={{width: "100%"}}
                autoPlay={true}
                autoPlayInterval={isFast ? 100 : 2000}
                data={productImages}
                onScrollStart={() => {
                    console.log('===1')
                }}
                onScrollEnd={() => {
                    console.log('===2')
                }}

                onConfigurePanGesture={g => g.enabled(false)}
                pagingEnabled={isPagingEnabled}
                onSnapToItem={index => console.log("current index:", index)}
                renderItem={({index}) => <SBItem key={index} index={index}/>}
            />
            <ScrollView style={{flex: 1}}>
                <SButton
                    onPress={() => {
                        setData([...new Array(5).keys()]);
                    }}
                >
                    {"Change the data length to 5"}
                </SButton>
                <SButton
                    onPress={() => {
                        setData([...new Array(3).keys()]);
                    }}
                >
                    {"Change the data length to 3"}
                </SButton>
                <SButton
                    onPress={() => {
                        setIsVertical(!isVertical);
                    }}
                >
                    {isVertical ? "Set horizontal" : "Set Vertical"}
                </SButton>
                <SButton
                    onPress={() => {
                        setIsFast(!isFast);
                    }}
                >
                    {isFast ? "NORMAL" : "FAST"}
                </SButton>
                <SButton
                    onPress={() => {
                        setIsPagingEnabled(!isPagingEnabled);
                    }}
                >
                    PagingEnabled:{isPagingEnabled.toString()}
                </SButton>
                <SButton
                    onPress={() => {
                        setIsAutoPlay(!isAutoPlay);
                    }}
                >
                    {ElementsText.AUTOPLAY}:{`${isAutoPlay}`}
                </SButton>
                <SButton
                    onPress={() => {
                        console.log(ref.current?.getCurrentIndex());
                    }}
                >
                    Log current index
                </SButton>
                <SButton
                    onPress={() => {
                        setData(
                            data.length === 6
                                ? [...new Array(8).keys()]
                                : [...new Array(6).keys()],
                        );
                    }}
                >
                    Change data length to:{data.length === 6 ? 8 : 6}
                </SButton>
                <SButton
                    onPress={() => {
                        ref.current?.scrollTo({count: -1, animated: true});
                    }}
                >
                    prev
                </SButton>
                <SButton
                    onPress={() => {
                        ref.current?.scrollTo({count: 1, animated: true});
                    }}
                >
                    next
                </SButton>
            </ScrollView>
        </SafeAreaView>
    );


    // return (
    //   <ScrollView showsVerticalScrollIndicator={false} h={windowHeight - 80} _contentContainerStyle={{}}>
    //
    //     <Center>
    //       <View style={{ width: width - 20, padding: 10 }}>
    //         <VStack space={1}>
    //           <View style={styles.card}>
    //             <Image
    //               alt={"Product Image"}
    //               style={styles.thumb}
    //               source={{
    //                 uri: base_urlImages + "/products/" + product.img_url,
    //               }}
    //             />
    //             <View style={styles.infoContainer}>
    //               <Text numberOfLines={1} style={styles.name}>{product.product_name}</Text>
    //               <Text numberOfLines={1}
    //                     style={styles.price}>K {numbro(parseInt(price)).format({
    //                 thousandSeparated: true,
    //                 mantissa: 2,
    //               })}</Text>
    //             </View>
    //
    //             <HStack>
    //
    //             </HStack>
    //
    //             <Center mt={3} mb={3}>
    //               <HStack space={5}
    //                       style={{ alignItems: "center" }}>
    //
    //                 <Button isDisabled={isMinusToCartBtnDisabled} onPress={minusProductQty} variant={"outline"} size="sm">
    //                   <Icon name="minus" size={15} color="#000" />
    //                 </Button>
    //                 <Text style={{ fontSize: 16, color: "grey", fontWeight: "bold" }}>{productQty}</Text>
    //                 <Button isDisabled={isPlusToCartBtnDisabled} onPress={addProductQty} variant={"outline"} size="sm">
    //                   <Icon name="plus" size={15} color="#000" />
    //                 </Button>
    //               </HStack>
    //             </Center>
    //
    //             <CollapsibleView
    //               title={<Text
    //                 style={{ color: "black" }}>Description</Text>}
    //               duration={800}
    //               arrowStyling={{ size: 20, rounded: true }}
    //             >
    //
    //               <Text style={styles.prodDesc}>
    //                 {
    //                   product.product_description
    //                 }
    //               </Text>
    //             </CollapsibleView>
    //
    //
    //           </View>
    //
    //           <View>
    //
    //
    //             <Button isLoading={isAddingToCartBtn} isLoadingText={"Adding..."} onPress={addToCart} size="sm"
    //                     variant="subtle" colorScheme="dark">
    //               <HStack space={2}>
    //                 <Icon name="shoppingcart" size={20} color="#fff" />
    //                 <Text style={{ color: "#fff" }}>Add to Cart</Text>
    //               </HStack>
    //
    //             </Button>
    //
    //           </View>
    //         </VStack>
    //
    //       </View>
    //     </Center>
    //     <AddtoCartActionSheet openCart={openCart} setStatus={setBottomSheetOpen} isOpen={isBottomSheetOpen}
    //                           productsTotalAmount={productsTotalAmount} cartItemsCount={cartItemsCount} />
    //   </ScrollView>
    // );
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
});

export default ProductDetails;
