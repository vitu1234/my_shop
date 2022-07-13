import React, {useContext, useEffect, useState} from 'react';
import {Button, Center, HStack, ScrollView, Text, View, Alert} from 'native-base';
import CartRow from './components/CartRow';
import {Dimensions, useWindowDimensions} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {UserContext} from '../app_contexts/UserContext';
import {CartContext} from '../app_contexts/CartContext';
import SQLite from 'react-native-sqlite-storage';
import ProductCard from './components/ProductCard';
import numbro from 'numbro';


const {width} = Dimensions.get('window');
const windowHeight = Dimensions.get('window').height;

const db = SQLite.openDatabase(
    {
        name: 'MainDB1',
        location: 'default',
        version: 2,
    },
    () => {
    },
    error => {
        console.log(error);
    },
);

function CartScreen(props) {

    const [isLoggedIn, setLoggedInStatus] = useContext(UserContext);
    const [cartItemsCount, setCartItemsCount] = useContext(CartContext);
    const [products, setCartProducts] = useState([]);
    const [productsTotalAmount, setProductsTotalAmount] = useState(0);
    const [isLoadingScreen, setIsLoadingScreen] = useState(true);

    const windowWidth = useWindowDimensions().width;
    const windowHeight = useWindowDimensions().height;


    const setCartCounterNumber = () => {
        //update cart counter
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM cart',
                [],
                (tx, results) => {
                    const len = results.rows.length;
                    setCartItemsCount(len);

                    let amountTotal = 0;
                    const temp = [];

                    for (let i = 0; i < results.rows.length; ++i) {
                        temp.push(results.rows.item(i));

                        amountTotal += (results.rows.item(i).qty * results.rows.item(i).product_price);
                    }
                    setCartProducts(temp);
                    setProductsTotalAmount(amountTotal);
                    setIsLoadingScreen(false);
                },
            );
        });
    };


    useEffect(() => {
        setCartCounterNumber();
    }, [isLoadingScreen]);

    const removeProductCart = (product) => {
        db.transaction((tx) => {
            tx.executeSql(
                'DELETE FROM cart where id=?',
                [product.id],
                (tx, results) => {

                    if (results.rowsAffected > 0) {

                        const len = results.rows.length;
                        setCartItemsCount(len);


                        const temp = [];
                        let amountTotal = 0;
                        for (let i = 0; i < results.rows.length; ++i) {
                            temp.push(results.rows.item(i));

                            amountTotal += (results.rows.item(i).qty * results.rows.item(i).product_price);
                        }
                        // setCartProducts(temp);
                        setProductsTotalAmount(amountTotal);

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
        });
    };

    const addProductCart = (product) => {
        console.log(product);
        db.transaction(async (tx) => {
            await tx.executeSql(
                'UPDATE cart SET qty=? WHERE product_id = ?',
                [product.qty + 1, product.product_id],
                (tx, results) => {
                    if (results.rowsAffected > 0) {
                        const len = results.rows.length;
                        setCartItemsCount(len);

                        const temp = [];
                        let amountTotal = 0;
                        for (let i = 0; i < results.rows.length; ++i) {
                            temp.push(results.rows.item(i));

                            amountTotal += (results.rows.item(i).qty * results.rows.item(i).product_price);
                        }
                        // setCartProducts(temp);
                        setProductsTotalAmount(amountTotal);


                    }
                    console.log('updated');
                },
                error => {
                    console.log(error);
                },
            );
        });
    };

    const minusProductCart = (product, minusLogic) => {
        minusLogic(product);
        const new_qty = ((product.qty - 1) === 0) ? 1 : product.qty - 1;
        db.transaction(async (tx) => {
            await tx.executeSql(
                'UPDATE cart SET qty=? WHERE product_id = ?',
                [new_qty, product.product_id],
                (tx, results) => {
                    if (results.rowsAffected > 0) {
                        const len = results.rows.length;
                        const temp = [];
                        let amountTotal = 0;
                        for (let i = 0; i < results.rows.length; ++i) {
                            temp.push(results.rows.item(i));

                            amountTotal += (results.rows.item(i).qty * results.rows.item(i).product_price);
                        }


                    }
                },
                error => {
                    console.log(error);
                },
            );
        });
    };

    if (!isLoadingScreen) {
        if (products.length > 0) {
            // console.log(products.length);


            const renderProductList = products.map((product) => {
                return (
                    <CartRow key={product.product_id} data={{
                        product: product,
                        actionRemoveProductCart: removeProductCart,
                        // actionAddProductCart: addProductCart,
                        // actionMinusProductCart: minusProductCart,
                    }}/>
                );
            });

            return (

                <View style={{flex: 1, justifyContent: 'center', backgroundColor: '#F5FCFF'}}>


                    <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}
                                h={windowHeight - 80} _contentContainerStyle={{}}>
                        <View mt={2}>
                            {renderProductList}

                        </View>
                    </ScrollView>
                    <View style={{flex: -1, backgroundColor: 'rgba(161,161,161,0.25)'}}>
                        <View style={{marginStart: 16, marginEnd: 16, elevation: 3}}>
                            <Button style={{
                                margin: 5,
                            }} mt={2} size="md" variant="subtle" colorScheme="dark">
                                <HStack space={2}>
                                    <Icon name="creditcard" size={18} color="#fff"/>
                                    <Text style={{color: '#fff', fontSize: 10}}>CHECKOUT (K{
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
                <View mt={2} style={{justifyContent: 'center', backgroundColor: '#F5FCFF'}}>
                    <Text style={{color: 'red', textAlign: 'center', fontSize: 18}}>Products in cart will appear
                        here!</Text>
                </View>
            );
        }
    } else {
        return (
            <View>
                <Text style={{textAlign: 'center', fontSize: 18}}>Loading cart...</Text>
            </View>
        );
    }


}

export default CartScreen;
