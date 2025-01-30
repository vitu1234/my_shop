import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import numbro from "numbro";


let dataG = [];

function ProductAttributeCard(props) {
    const data = props.data;
    
    

    if (data !== undefined) {
        const product = data.product;
        const activeAttribute = data.activeAttribute
    
        const product_price = "K" + numbro(parseInt(product.product_attributes_price)).format({
            thousandSeparated: true, mantissa: 2,
        });
        return (
        <TouchableOpacity key={product.product_attributes_id} onPress={() => data.action(product)} style={[
            styles.card, 
            (activeAttribute[0]['product_attributes_id'] == product.product_attributes_id) ? styles.highlightedContainer : null
        ]}>

            <View style={styles.infoContainer}>
                <Text numberOfLines={3}  style={[styles.name,
                    (activeAttribute[0]['product_attributes_id'] == product.product_attributes_id) ? styles.highlightedTextColor : null
                ]}>{product.product_attributes_name} | {product.product_attributes_value} X 1 QTY</Text>
                <Text style={[styles.price, 
                    (activeAttribute[0]['product_attributes_id'] == product.product_attributes_id) ? styles.highlightedTextColor : null
                ]}>{product_price}</Text>
            </View>
        </TouchableOpacity>);
    } else {
        console.log("undvccf");
    }

    return (<View />);


}

const styles = StyleSheet.create({
    card: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 5,
        shadowOpacity: 0.5,
        shadowRadius: 2,
        shadowColor: "black",
        shadowOffset: {
            height: 0, width: 0,
        },
        elevation: 1,
        marginVertical: 1,
        marginEnd: 2,
    }, thumb: {
        resizeMode: "cover",  // or "contain" depending on your need
        height: 180, borderTopLeftRadius: 16, borderTopRightRadius: 16, width: "100%",
    },

    infoContainer: {
        padding: 16,
    }, name: {
        height: 40,
        marginBottom: 3,
        color: "#424242", fontSize: 11, fontWeight: "bold",
    }, price: {
        color: "black", fontSize: 13, fontWeight: "900", marginBottom: 8,

    }, likesSize: {}, likeStarsContainer: {
        justifyContent: 'space-between', flexDirection: 'row',
    },
    highlightedContainer: {
        backgroundColor: 'dodgerblue',
    },
    highlightedTextColor:{
        color:'#fff'
    }
});
export default ProductAttributeCard;
