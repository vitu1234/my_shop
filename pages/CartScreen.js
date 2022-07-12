import React, {useContext, useEffect, useState} from 'react';
import {Button, Center, HStack, ScrollView, Text, View} from 'native-base';
import CartRow from './components/CartRow';
import {Dimensions, useWindowDimensions} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {UserContext} from '../app_contexts/UserContext';
import {CartContext} from '../app_contexts/CartContext';
import SQLite from 'react-native-sqlite-storage';
import ProductCard from './components/ProductCard';


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
                    const temp = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                        temp.push(results.rows.item(i));
                    }
                    setCartProducts(temp);
                },
            );
        });
    };


    useEffect(() => {
        setCartCounterNumber();
    }, [cartItemsCount]);

    const removeProductCart = () => {

    };

    const addProductCart = () => {

    };
    const minusProductCart = () => {

    };


    if (products.length > 0) {
        // console.log(products.length);
        const renderProductList = products.map((product) => {
            return (
                <CartRow key={product.product_id} data={{
                    product: product,
                    actionRemoveProductCart: removeProductCart,
                    actionAddProductCart: addProductCart,
                    actionMinusProductCart: minusProductCart,
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
                                <Text style={{color: '#fff', fontSize: 10}}>CHECKOUT (K60,000.00)</Text>
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


}

export default CartScreen;
