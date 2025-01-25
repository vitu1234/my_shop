import React, { useContext, useEffect, useState } from 'react';
import { Center } from "@/components/ui/center"
import { Button } from "@/components/ui/button"
import { HStack } from "@/components/ui/hstack"
import { Alert, AlertIcon, AlertText } from "@/components/ui/alert"
import { Text } from "@/components/ui/text"


import CartRow from './components/cart/CartRow';
import { Dimensions, ScrollView, useWindowDimensions, View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { AppContext, CartContext } from '@/app_contexts/AppContext';
import { SQLiteProvider, useSQLiteContext, SQLiteDatabase } from 'expo-sqlite'; 
import numbro from 'numbro';


const { width } = Dimensions.get('window');
const windowHeight = Dimensions.get('window').height;



function CartScreen(props) {
    const db = useSQLiteContext();
    const [isLoggedIn, setLoggedInStatus] = useContext(AppContext);
    const [cartItemsCount, setCartItemsCount] = useContext(CartContext);
    const [products, setCartProducts] = useState([]);
    const [productsCCC, setCartProductssss] = useState([]);
    const [productsTotalAmount, setProductsTotalAmount] = useState(0);
    const [isLoadingScreen, setIsLoadingScreen] = useState(true);

    const windowWidth = useWindowDimensions().width;
    const windowHeight = useWindowDimensions().height;


    const setCartCounterNumber = async () => {
        //update cart counter
        // db.transaction((tx) => {
        //     tx.executeSql(
        //         'SELECT * FROM cart',
        //         [],
        //         (tx, results) => {
        //             const len = results.rows.length;
        //             setCartItemsCount(len);

        //             let amountTotal = 0;
        //             const temp = [];

        //             for (let i = 0; i < results.rows.length; ++i) {
        //                 temp.push(results.rows.item(i));

        //                 amountTotal += (results.rows.item(i).qty * results.rows.item(i).product_price);
        //             }
        //             setCartProducts(temp);
        //             setProductsTotalAmount(amountTotal);
        //             setIsLoadingScreen(false);
        //         },
        //     );
        // });
console.log("settonmgn cart")
        let cartFullProductDetailsList = []
        const cartList = await db.getAllAsync("SELECT * FROM cart ORDER BY id DESC");
        for (let i = 0; i < cartList.length; i++) {
            // const element = array[cartList];
            // console.log("ITEMS CART")
            // console.log(cartList[i])

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
            }

            cartFullProductDetailsList.push(cartItem)
            
        }
        setCartProducts(cartFullProductDetailsList);
        // setCartProductssss(cartList);

    };


    useEffect(() => {
        setCartCounterNumber();
    }, []);
    const removeProductCart = (product) => {
        setIsLoadingScreen(true);

        /*db.transaction((tx) => {
            tx.executeSql(
                'DELETE FROM cart where id=?',
                [product.id],
                (tx, results) => {

                    if (results.rowsAffected > 0) {

                        const len = results.rows.length;
                        // setCartItemsCount(len);


                        const temp = [];
                        let amountTotal = 0;
                        for (let i = 0; i < results.rows.length; ++i) {
                            temp.push(results.rows.item(i));

                            amountTotal += (results.rows.item(i).qty * results.rows.item(i).product_price);
                        }
                        // setCartProducts(temp);
                        // setProductsTotalAmount(amountTotal);

                        Alert.alert(
                            'Success',
                            'Removed from cart',
                            [
                                {
                                    text: 'Ok',
                                    // onPress: () => navigation.navigate('HomeScreen'),
                                },
                            ],
                            {cancelable: false},
                        );
                    }
                });
        });*/
    };

    const setLoadingScreen = () => {
        // console.log('iniit')
        setIsLoadingScreen(true);
    };

    // if (!isLoadingScreen) {
    if (products.length > 0) {
        // console.log(products.length);


        const renderProductList = products.map((product) => {
            return (
                <CartRow key={product.id} data={{
                    product: product,
                    // actionRemoveProductCart: removeProductCart,
                    // actionAddProductCart: addProductCart,
                    // actionMinusProductCart: minusProductCart,
                    actionRemoveLoading: setLoadingScreen,
                }} />
            );
        });

        return (

            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#F5FCFF' }}>

                {/* <Text>Here</Text> */}
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

export default CartScreen;
