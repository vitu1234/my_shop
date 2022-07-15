import React from 'react';
import {Center, Image, Text, View} from 'native-base';
import {Dimensions, StyleSheet, TouchableOpacity} from 'react-native';
import numbro from 'numbro';


const {width} = Dimensions.get('window');

function ProductDetails(props) {
    const product = props.route.params.data;

    const product_price = 'K' + numbro(parseInt(product.product_price)).format({
        thousandSeparated: true,
        mantissa: 2,
    });

    return (
        <Center>
            <View style={{width: width - 30, padding: 16}}>
                <View style={styles.card}>
                    <Image
                        alt={'Product Image'}
                        style={styles.thumb}
                        source={product.img_url}
                    />
                    <View style={styles.infoContainer}>
                        <Text numberOfLines={1} style={styles.name}>{product.product_name}</Text>
                        <Text numberOfLines={1} style={styles.price}>{product_price}</Text>
                    </View>
                </View>
            </View>
        </Center>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 300,
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
    },
    thumb: {
        height: 300,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        width: '100%',
    },
    infoContainer: {
        padding: 16,
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
        marginBottom: 8,

    },
});

export default ProductDetails;
