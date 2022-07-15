import React from 'react';
import {Button, Card, Image, View} from 'native-base';

import ImagedCarouselCard from 'react-native-imaged-carousel-card';
import {ImageBackground, Text, StyleSheet, TouchableOpacity} from 'react-native';
import numbro from 'numbro';

let dataG = [];

function ProductCard(props) {
    const data = props.data;
    dataG = data;

    if (data !== undefined) {

        const product = data.product;


        const product_price = 'K' + numbro(parseInt(product.product_price)).format({
            thousandSeparated: true,
            mantissa: 2,
        });


        return (
            <TouchableOpacity onPress={() => data.action(product)} style={styles.card}>
                <Image
                    alt={'Product Image'}
                    style={styles.thumb}
                    source={product.img_url}
                />
                <View style={styles.infoContainer}>
                    <Text numberOfLines={1} style={styles.name}>{product.product_name}</Text>
                    <Text numberOfLines={1} style={styles.price}>{product_price}</Text>
                </View>
            </TouchableOpacity>
        );
    } else {
        console.log('undf');
    }

    return (
        <View/>
    );


}

const styles = StyleSheet.create({
    card: {
        width: 200,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowOpacity: 0.5,
        shadowRadius: 3,
        shadowColor: 'black',
        shadowOffset: {
            height: 0,
            width: 0,
        },
        elevation: 3,
        marginVertical: 20,
        marginEnd: 20,
    },
    thumb: {
        height: 250,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        width: '100%',
    },
    infoContainer: {
        padding: 16,
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
        marginBottom: 8,

    },
});
export default ProductCard;
