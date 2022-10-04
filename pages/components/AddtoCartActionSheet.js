import React, {useContext, useEffect, useState} from 'react';
import {
    Actionsheet,
    Alert,
    Box,
    Button,
    Center,
    HStack,
    Image,
    ScrollView,
    useDisclose,
    View,
    VStack,
} from 'native-base';
import {StyleSheet, Text, TouchableOpacity, useWindowDimensions} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {Dimensions} from 'react-native';
import numbro from 'numbro';
import SQLite from 'react-native-sqlite-storage';
import ProductCard from './ProductCard';
import CollapsibleView from '@eliav2/react-native-collapsible-view';
import {AppContext} from '../../app_contexts/AppContext';
import {CartContext} from '../../app_contexts/AppContext';
import CartRow from './CartRow';
import {db} from '../../config/sqlite_db_service'



function AddtoCartActionSheet(props) {
    const {
        isOpen,
        onOpen,
        onClose,
    } = useDisclose();
    const [cartItemsCount, setCartItemsCount] = useContext(CartContext);
    const [productsTotalAmount, setProductsTotalAmount] = useState(0);

    const close = () => {
        // console.log('closing bottom sheet');
        props.setStatus(false);
    };


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
                    setProductsTotalAmount(amountTotal);
                },
            );
        });
    };


    useEffect(() => {
        setCartCounterNumber();
    }, [cartItemsCount]);


    return <Center>
        {/*<Button onPress={onOpen}>Actionsheet</Button>*/}
        <Actionsheet isOpen={props.isOpen} onClose={close}>
            <Actionsheet.Content>
                <Box w="100%" h={60} px={4} justifyContent="center">
                    <Text style={{ textAlign: 'center', fontSize:16, color:'#000'}}>
                        Your Cart Total
                    </Text>
                </Box>


                <Actionsheet.Item onPress={props.openCart} style={{backgroundColor: 'black', alignItems: 'center'}}>

                    <HStack w={'100%'} space={2}>
                        <Icon name="shoppingcart" size={18} color="#fff"/>
                        <Text style={{
                            color: '#fff',
                            fontSize: 12,
                        }}>View Cart - {cartItemsCount} {(cartItemsCount > 1 ? 'Items' : 'Item')} (K{
                            numbro(parseInt(productsTotalAmount)).format({
                                thousandSeparated: true,
                                mantissa: 2,
                            })
                        }) </Text>
                    </HStack>
                </Actionsheet.Item>

            </Actionsheet.Content>
        </Actionsheet>
    </Center>;

}


export default AddtoCartActionSheet;
