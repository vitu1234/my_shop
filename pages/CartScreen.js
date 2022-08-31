import React, {useContext, useEffect, useState} from 'react';
import {Button, Center, HStack, ScrollView, Text, View, Alert} from 'native-base';
import CartRow from './components/CartRow';
import {Dimensions, useWindowDimensions} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {AppContext, CartContext} from '../app_contexts/AppContext';
import {db} from "../config/sqlite_db_service";
import numbro from 'numbro';


const {width} = Dimensions.get('window');
const windowHeight = Dimensions.get('window').height;



function CartScreen(props) {

    const [isLoggedIn, setLoggedInStatus] = useContext(AppContext);
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
        setIsLoadingScreen(true);

        db.transaction((tx) => {
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
        });
    };

    const setLoadingScreen = () => {
        // console.log('iniit')
        setIsLoadingScreen(true);
    };

    if (!isLoadingScreen) {
        if (products.length > 0) {
            // console.log(products.length);


            const renderProductList = products.map((product) => {
                return (
                    <CartRow key={product.product_id} data={{
                        product: product,
                        // actionRemoveProductCart: removeProductCart,
                        // actionAddProductCart: addProductCart,
                        // actionMinusProductCart: minusProductCart,
                        actionRemoveLoading: setLoadingScreen,
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
