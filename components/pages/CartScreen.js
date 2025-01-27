import React, { useContext, useEffect, useState } from 'react';
import { Center } from "@/components/ui/center"
import { Button } from "@/components/ui/button"
import { HStack } from "@/components/ui/hstack"
import { Alert, AlertIcon, AlertText } from "@/components/ui/alert"
import { Text } from "@/components/ui/text"
import Checkbox from 'expo-checkbox';
import { SquareX, SquareCheckBig, Leaf } from "lucide-react-native";

import CartRow from './components/cart/CartRow';
import { Dimensions, ScrollView, useWindowDimensions, View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { AppContext, CartContext } from '@/app_contexts/AppContext';
import { SQLiteProvider, useSQLiteContext, SQLiteDatabase } from 'expo-sqlite';
import numbro from 'numbro';


const { width } = Dimensions.get('window');
const windowHeight = Dimensions.get('window').height;



function CartScreen(props) {
    const db = useSQLiteContext();

    const [isCheckedSelectAllDeselect, setCheckedSelectAllDeselect] = useState(false);
    const [isLoggedIn, setLoggedInStatus] = useContext(AppContext);
    const [products, setCartProducts] = useState([]);
    const [productsTotalAmount, setProductsTotalAmount] = useState(0);

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

        }

        setCartProducts(cartFullProductDetailsList);
        // setCartProductssss(cartList);

    };


    useEffect(() => {
        setCartItems();
    }, []);


    const removeProductCart = async (selectedProduct) => {
        console.log("Remove product from cart")
        console.log(selectedProduct)

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


    const removeSelectedItems = () => {
        console.log("Delete selected items")
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
        console.log("Select all or Deselect alls")
        setCheckedSelectAllDeselect(Boolean(newValue));
        const updatedProducts = products.map((product) => ({
            ...product,
            isChecked: Boolean(newValue),
        }));

        setCartProducts([]); 
        setCartProducts(updatedProducts); 

        if (newValue) {
            await db.runAsync(
                'UPDATE cart SET isChecked = ? ',
                Boolean(newValue)
            );
        } else {
            await db.runAsync(
                'UPDATE cart SET isChecked = ? ',
                Boolean(newValue)
            );
        }


        // update the list of products locally for faster UI response
        // Update local state immediately for better UI responsiveness
        
        setCartProducts([]); 
        setCartProducts(updatedProducts); 
        console.log("updatedProducts")
        console.log(updatedProducts)
        setCartItems()
        
    };

    // if (!isLoadingScreen) {
    if (products.length > 0) {

        const renderProductList = products.map((product) => {
            return (
                <CartRow key={product.id} data={{
                    product: product,
                    removeProductCart: removeProductCart,
                    updateProductQtyCart: updateProductQtyCart,
                    selectDeselectProductQtyCart: selectDeselectProductQtyCart,
                }} />
            );
        });

        return (

            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#F5FCFF' }}>

                <View style={styles.topRow}>
                    {/* <TouchableOpacity onPress={removeProductCart} style={styles.iconButton}>
                    <SquareCheckBig size={18} color="green" />
                </TouchableOpacity> */}

                    <View style={styles.section}>
                        <Checkbox style={styles.checkbox} value={isCheckedSelectAllDeselect} onValueChange={handleSelectDeselectAllChange} />
                    </View>

                    <TouchableOpacity onPress={removeSelectedItems} style={styles.deleteSelected}>
                        <Text style={{ fontSize: 18 }}>Delete selected items</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}
                    h={windowHeight - 80} _contentContainerStyle={{}}>
                    <View mt={2}>
                        {renderProductList}

                    </View>
                </ScrollView>
                <View style={{ flex: -1, backgroundColor: 'rgba(161,161,161,0.25)' }}>
                    <View style={{ marginStart: 16, marginEnd: 16, elevation: 3 }}>
                        <Button style={{
                            margin: 5,
                        }} mt={2} size="md" variant="subtle" colorScheme="dark">
                            <HStack space={2}>
                                <Icon name="creditcard" size={18} color="#fff" />
                                <Text style={{ color: '#fff', fontSize: 10 }}>CHECKOUT (K{
                                    numbro(parseInt(productsTotalAmount)).format({
                                        thousandSeparated: true,
                                        mantissa: 2,
                                    })
                                }) </Text>
                            </HStack>

                        </Button>
                    </View>
                </View>
            </View>
        );
    } else {
        return (
            <View mt={2} style={{ justifyContent: 'center', backgroundColor: '#F5FCFF' }}>
                <Text style={{ color: 'red', textAlign: 'center', fontSize: 18 }}>Products in cart will appear
                    here!</Text>
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
});

export default CartScreen;
