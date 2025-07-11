import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import numbro from "numbro";


let dataG = [];

function ProductVariantCard(props) {


    // console.log("ProductVariantCard Rendered");
    // console.log("ProductVariantCard Props");
    // console.log(props.data); 
    // const productAttribute = props.data.productVariant;
    // const activeAttribute = props.data.activeVariant[0];

    const data = props.data;
    
    // console.log("ProductVariantCard");
    // console.log(data);
    // let data = undefined;

    if (data !== undefined) {
        const productVariant = data.productVariant;
        // const activeVariant = data.activeVariant[0]

        console.log("ProductVariantCard Attributes");
        console.log(productVariant.attributes);
    
        // console.log(productAttribute)
        // console.log("PRODUCT ATTRIBUTE")
        // console.log(data.activeAttribute)
        // console.log("1 IRT")
        // console.log(activeVariant)

        const product_price = "K" + numbro(parseInt(productVariant.price)).format({
            thousandSeparated: true, mantissa: 2,
        });
        return (
            // <View>
            //     <Text>Test</Text>
            // </View>
        <TouchableOpacity key={productVariant.product_variant_id} onPress={() => data.action(productVariant)} style={[
            styles.card, 
            (productVariant.is_default == 1) ? styles.highlightedContainer : null   
        ]}>

            <View style={styles.infoContainer}>
                <Text numberOfLines={3}  style={[styles.name,
                    (productVariant.is_default == 1) ? styles.highlightedTextColor : null
                ]}>{productVariant.product_attributes_name} | {productVariant.product_attributes_value} X 1 QTY</Text>
                <Text style={[styles.price, 
                    (productVariant.is_default == 1) ? styles.highlightedTextColor : null
                ]}>{product_price}</Text>
            </View>
        </TouchableOpacity>
        );
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
export default ProductVariantCard;
