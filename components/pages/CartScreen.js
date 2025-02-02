import React, { useContext, useEffect, useState } from 'react';
import { Center } from "@/components/ui/center"
import { Button } from "@/components/ui/button"
import { HStack } from "@/components/ui/hstack"
import { Text } from "@/components/ui/text"
import Checkbox from 'expo-checkbox';
import { SquareX, SquareCheckBig, Leaf } from "lucide-react-native";

import CartRow from './components/cart/CartRow';
import { Dimensions, ScrollView, useWindowDimensions, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { AppContext, CartContext } from '@/app_contexts/AppContext';
import { SQLiteProvider, useSQLiteContext, SQLiteDatabase } from 'expo-sqlite';
import { FlatList } from "react-native-actions-sheet";
import { SafeAreaView } from "react-native-safe-area-context";


const { width } = Dimensions.get("window");

const PAGE_WIDTH = window.width;


function CartScreen(props) {
    const db = useSQLiteContext();

    const [isLoggedIn, setLoggedInStatus] = useContext(AppContext);
    const [cartItemsCount, setCartItemsCount] = useContext(CartContext);
    const [isCheckedSelectAllDeselect, setCheckedSelectAllDeselect] = useState(true);

    const [products, setCartProducts] = useState([]);
    const [productsTotalAmount, setProductsTotalAmount] = useState(0);

    const [showBox, setShowBox] = useState(true);



    const windowWidth = useWindowDimensions().width;
    const windowHeight = useWindowDimensions().height;

    const setCartItems = async () => {

        let cartFullProductDetailsList = []
        const cartList = await db.getAllAsync("SELECT * FROM cart ORDER BY id DESC");
        for (let i = 0; i < cartList.length; i++) {

            const productAttributeDetails = await db.getFirstAsync('SELECT * FROM product_attributes WHERE product_attributes_id = ' + cartList[i].product_attributes_id);
            const productDetails = await db.getFirstAsync('SELECT * FROM product WHERE product_id = ' + productAttributeDetails.product_id);
            const cartItem = {
                "id": cartList[i].id,
                "product_attributes_id": cartList[i].product_attributes_id,
                "qty": cartList[i].qty,
                "product_id": productDetails.product_id,
                "cover": productDetails.cover,
                "product_description": productDetails.product_description,
                "product_name": productDetails.product_name,
                "product_attributes_default": productAttributeDetails.product_attributes_default,
                "product_attributes_name": productAttributeDetails.product_attributes_name,
                "product_attributes_value": productAttributeDetails.product_attributes_value,
                "product_attributes_price": productAttributeDetails.product_attributes_price,
                "product_attributes_stock_qty": productAttributeDetails.product_attributes_stock_qty,
                "product_attributes_summary": productAttributeDetails.product_attributes_summary,
                "isChecked": Boolean(cartList[i].isChecked),
            }

            cartFullProductDetailsList.push(cartItem)
            if (!cartList[i].isChecked) {
                setCheckedSelectAllDeselect(false)
            }

        }
        setCartItemsCount(cartFullProductDetailsList.length)
        setCartProducts(cartFullProductDetailsList);
        // setCartProductssss(cartList);

    };


    useEffect(() => {
        setCartItems();
    }, []);


    const removeProductCart = async (selectedProduct) => {
        // console.log("Remove product from cart")
        // console.log(selectedProduct)

        for (let i = 0; i < products.length; i++) {
            if (products[i].id === selectedProduct.id) {
                await db.runAsync(
                    'DELETE FROM cart WHERE id = ?',
                    selectedProduct.id
                );
            }
        }

        setCartItems()
    };


    const removeSelectedItems = async () => {
        // console.log("Delete selected items")

        const cartListItems = await db.getAllAsync("SELECT * FROM cart WHERE isChecked = 1");
        if (cartListItems.length > 0) {
            showConfirmDeleteCartItemsDialog(cartListItems.length)
        } else {
            Alert.alert("Please select one or more items");
        }

    }

    const deleteProductsFromCart = async () => {
        await db.runAsync(
            'DELETE FROM cart WHERE isChecked = 1'
        );

        setCartItems()
        setShowBox(false);
    }

    const updateProductQtyCart = async (selectedProduct, newQty) => {
        for (let i = 0; i < products.length; i++) {
            if (products[i].id === selectedProduct.id) {
                await db.runAsync(
                    'UPDATE cart SET qty = ? WHERE id = ?',
                    newQty,
                    selectedProduct.id
                );
            }

        }
    }

    const selectDeselectProductQtyCart = async (selectedProduct, isChecked) => {
        for (let i = 0; i < products.length; i++) {
            if (products[i].id === selectedProduct.id) {
                if (isChecked) {
                    products[i].isChecked = true
                } else {
                    products[i].isChecked = false
                }

                await db.runAsync(
                    'UPDATE cart SET isChecked = ? WHERE id = ?',
                    isChecked,
                    selectedProduct.id
                );
            }

        }
    }


    const handleSelectDeselectAllChange = async (newValue) => {
        // console.log("Select all or Deselect all");
        setCheckedSelectAllDeselect(Boolean(newValue));

        const updatedProducts = products.map((product) => ({
            ...product,
            isChecked: Boolean(newValue),
        }));

        await db.runAsync('UPDATE cart SET isChecked = ?', Boolean(newValue));

        setCartProducts(updatedProducts);
    };

    const showConfirmDeleteCartItemsDialog = (checkedItems) => {
        return Alert.alert(
            "Are you sure?",
            "Remove " + checkedItems + " item(s) from your cart?",
            [
                // The "Yes" button
                {
                    text: "Yes",
                    onPress: () => {
                        deleteProductsFromCart();
                    },
                },
                // The "No" button
                // Does nothing but dismiss the dialog when tapped
                {
                    text: "No",
                },
            ]
        );
    };

    // if (!isLoadingScreen) {
    if (products.length > 0) {

        const renderProductList = products.map((product) => {
            return (
                <CartRow key={`${product.id}-${product.isChecked}`} data={{
                    product: product,
                    removeProductCart: removeProductCart,
                    updateProductQtyCart: updateProductQtyCart,
                    selectDeselectProductQtyCart: selectDeselectProductQtyCart,
                }} />
            );
        });
        return (
            <View style={{ flex: 1 }}>
                <View >

                    <View style={styles.topRow}>
                        <View style={styles.section}>
                            <Checkbox style={styles.checkbox} value={isCheckedSelectAllDeselect} onValueChange={handleSelectDeselectAllChange} />
                        </View>

                        <TouchableOpacity onPress={removeSelectedItems} style={styles.deleteSelected}>
                            <Text style={{ fontSize: 18 }}>Delete selected items</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    style={{ marginBottom: 98 }}
                    data={[
                        { type: 'selectDelete' },
                        { type: 'cart_list' },
                    ]}
                    renderItem={({ item }) => {
                        // console.log(item.type)
                         if (item.type === 'cart_list') {
                            return (
                                <View >
                                    <ScrollView style={{ flex: -1 }} showsVerticalScrollIndicator={false}
                                        h={windowHeight - 80} _contentContainerStyle={{}}>
                                        <View mt={4}>
                                            {renderProductList}

                                        </View>
                                    </ScrollView>

                                </View>

                            );
                        }
                        return null;
                    }}
                    keyExtractor={(item, index) => index.toString()} // Ensure each item has a unique key

                />
                <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity style={styles.button} >
                        <Text style={styles.buttonText}>Add to Cart</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.buyNowButton]} >
                        <Text style={styles.buttonText}>Buy Now</Text>
                    </TouchableOpacity>
                </View>
            </View>




        );


    } else {
        return (
            <View style={{ justifyContent: 'center', backgroundColor: '#F5FCFF', marginTop: 2, padding: 70 }}>
                <Text style={{ color: 'red', textAlign: 'center', fontSize: 18 }}>Your cart is empty</Text>
            </View>
        );

    }
    // } else {
    //     return (
    //         <View>
    //             <Text style={{textAlign: 'center', fontSize: 18}}>Loading cart...</Text>
    //         </View>
    //     );
    // }


}

const styles = StyleSheet.create({
    cartItem: {
        backgroundColor: "#f9f9f9",
        marginVertical: 6,
        padding: 16,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    topRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 2,
        padding: 16,
        backgroundColor: "#fff"
    },



    section: {
        // flexDirection: 'row',
        // alignItems: 'center',
        padding: 4,
        marginEnd: 5,
        flex: 1,
        alignItems: "flex-start"
    },
    paragraph: {
        fontSize: 15,
    },
    checkbox: {
        // margin: 8,
        padding: 8
    },

    deleteSelected: {
        flex: 1,
        alignItems: "flex-end"
    },


    //Revamping cart screen
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
        // flexDirection: "column"
    }, productCardContainer: {
        width: (width - 30) / 2 - 8,
        marginHorizontal: 5,
    }
});

export default CartScreen;
