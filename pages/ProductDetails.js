import React, {useContext, useEffect, useState} from 'react';
import {Button, Center, HStack, Image, ScrollView, Text, View, VStack} from 'native-base';
import {Dimensions, StyleSheet, TouchableHighlight, TouchableOpacity} from 'react-native';
import numbro from 'numbro';
import Icon from 'react-native-vector-icons/AntDesign';
import CollapsibleView from '@eliav2/react-native-collapsible-view';
import {UserContext} from '../app_contexts/UserContext';
import {CartContext} from '../app_contexts/CartContext';
import SQLite from 'react-native-sqlite-storage';


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


function ProductDetails(props) {

    const product = props.route.params.data;
    const [productQty, setProductQty] = useState(1);
    const [product_price, setProductPrice] = useState(product.product_price);

    const [isLoggedIn, setLoggedInStatus] = useContext(UserContext);
    const [cartItemsCount, setCartItemsCount] = useContext(CartContext);


    const setCartCounterNumber = () => {
        //update cart counter
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM cart',
                [],
                (tx, results) => {
                    const len = results.rows.length;
                    setCartItemsCount(len);
                    console.log('COUNTING');
                },
            );
        });
    };


    useEffect(() => {
        setProductPrice(productQty * (parseFloat(product.product_price)));
        setCartCounterNumber();

    }, [productQty, cartItemsCount]);


    const addToCart = async () => {
        console.log('added to cart');
        // console.log(product);
        // setProductQty(productQty);
        //check if there are products in cart


        try {
            //insert into cart
            await db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM cart WHERE product_id = ?',
                    [
                        product.product_id,
                    ],
                    (tx, results) => {
                        const len = results.rows.length;
                        console.log('dhdhd ' + len);
                        if (len > 0) {
                            db.transaction(async (tx) => {
                                await tx.executeSql(
                                    'UPDATE cart SET qty=? WHERE product_id = ?',
                                    [productQty, product.product_id],
                                    () => {
                                        console.log('updated');
                                        Alert.alert('Success!', 'Your data has been updated.');
                                    },
                                    error => {
                                        console.log(error);
                                    },
                                );
                            });
                        } else {
                            db.transaction(async (tx) => {

                                await tx.executeSql(
                                    'INSERT INTO cart(product_id,product_name,product_price,qty,img_url) VALUES (?,?,?,?,?);',
                                    [product.product_id, product.product_name, product.product_price, productQty, product.img_url],
                                );
                                console.log('added to sqlite');
                                db.transaction((tx) => {
                                    tx.executeSql(
                                        'SELECT * FROM cart',
                                        [],
                                        (tx, results) => {
                                            setCartItemsCount(results.rows.length);
                                            console.log('hmm cart' + results.rows.length);
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
                    'SELECT * FROM cart',
                    [],
                    (tx, results) => {
                        setCartItemsCount(results.rows.length);
                        console.log('hmm cart' + results.rows.length);
                    },
                );
            });
            /*
            await db.transaction(async (tx) => {

                await tx.executeSql(
                    'INSERT INTO Users (Name, Age) VALUES (?,?)',
                    ['vt', 33],
                );
            });


            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM Users',
                    [],
                    (tx, results) => {
                        const len = results.rows.length;
                        console.log('hm22222m ' + results.rows.length);

                    },
                );
            });
             */

        } catch (e) {
            console.log(e);
        }

    };

    const addProductQty = () => {
        setProductQty(productQty + 1);
    };

    const minusProductQty = () => {
        if (productQty === 1) {
            setProductQty(1);
        } else {
            setProductQty(productQty - 1);
        }
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false} h={windowHeight - 80} _contentContainerStyle={{}}>

            <Center>
                <View style={{width: width - 20, padding: 10}}>
                    <VStack space={1}>
                        <View style={styles.card}>
                            <Image
                                alt={'Product Image'}
                                style={styles.thumb}
                                source={product.img_url}
                            />
                            <View style={styles.infoContainer}>
                                <Text numberOfLines={1} style={styles.name}>{product.product_name}</Text>
                                <Text numberOfLines={1}
                                      style={styles.price}>K {numbro(parseInt(product_price)).format({
                                    thousandSeparated: true,
                                    mantissa: 2,
                                })}</Text>
                            </View>

                            <HStack>

                            </HStack>

                            <Center mt={3} mb={3}>
                                <HStack space={5}
                                        style={{alignItems: 'center'}}>

                                    <Button onPress={minusProductQty} variant={'outline'} size="sm">
                                        <Icon name="minus" size={15} color="#000"/>
                                    </Button>
                                    <Text style={{fontSize: 16, color:'grey', fontWeight: 'bold'}}>{productQty}</Text>
                                    <Button onPress={addProductQty} variant={'outline'} size="sm">
                                        <Icon name="plus" size={15} color="#000"/>
                                    </Button>
                                </HStack>
                            </Center>

                            <CollapsibleView
                                title={<Text
                                    style={{color: 'black'}}>Description</Text>}
                                duration={800}
                                arrowStyling={{size: 20, rounded: true}}
                            >

                                <Text style={styles.prodDesc}>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                    tempor
                                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                                    nostrud
                                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
                                    aute
                                    irure
                                    dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                    pariatur.
                                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                                    deserunt
                                    mollit anim id est laborum.
                                </Text>
                            </CollapsibleView>


                        </View>

                        <View>


                            <Button onPress={addToCart} size="sm" variant="subtle" colorScheme="dark">
                                <HStack space={2}>
                                    <Icon name="shoppingcart" size={20} color="#fff"/>
                                    <Text style={{color: '#fff'}}>Add to Cart</Text>
                                </HStack>

                            </Button>

                        </View>
                    </VStack>

                </View>
            </Center>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowOpacity: 0.5,
        shadowRadius: 3,
        shadowColor: 'black',
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
        width: '100%',
    },
    infoContainer: {
        padding: 10,
        alignItems: 'center',
    },
    name: {
        color: '#424242',
        fontSize: 13,
        fontWeight: 'bold',
    },
    price: {
        color: 'black',
        fontSize: 16,
        fontWeight: '900',

    }, prodDesc: {
        color: '#424242',
        marginBottom: 8,
        padding: 10,
        textAlign: 'justify',

    }, cartBtn: {
        // backgroundColor: '#000000',
        height: 50,
        width: '100%',

    },
    cartText: {
        color: '#fff',
        padding: 10,

    },
});

export default ProductDetails;
