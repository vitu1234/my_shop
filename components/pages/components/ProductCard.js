import React from "react";
import {Button} from "@/components/ui/button"
import {Card} from "@/components/ui/card"
import {Image} from "@/components/ui/image"
import {ImageBackground, Text, StyleSheet, TouchableOpacity} from "react-native";
import numbro from "numbro";
import {base_urlImages} from "../../config/API";

let dataG = [];

function ProductCard(props) {
    const data = props.data;
    dataG = data;

    if (data !== undefined) {

        const product = data.product;

        const product_price = "K" + numbro(parseInt(product.price)).format({
            thousandSeparated: true,
            mantissa: 2,
        });


        return (
            <TouchableOpacity onPress={() => data.action(product)} style={styles.card}>
                <Image
                    alt={"Product Image"}
                    style={styles.thumb}
                    // source={product.img_url}
                    source={{
                        uri: base_urlImages + "/products/" + product.img_url,
                    }}
                />
                <View style={styles.infoContainer}>
                    <Text numberOfLines={1} style={styles.name}>{product.product_name}</Text>
                    <Text numberOfLines={1} style={styles.price}>{product_price}</Text>
                </View>
            </TouchableOpacity>
        );
    } else {
        console.log("undf");
    }

    return (
        <View/>
    );


}

const styles = StyleSheet.create({
    card: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowOpacity: 0.5,
        shadowRadius: 3,
        shadowColor: "black",
        shadowOffset: {
            height: 0,
            width: 0,
        },
        elevation: 3,
        marginVertical: 20,
        marginEnd: 20,
    },
    thumb: {
        resizeMode: "center",
        height: 150,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        width: "100%",
    },
    infoContainer: {
        padding: 16,
    },
    name: {
        color: "#424242",
        fontSize: 11,
        fontWeight: "bold",
    },
    price: {
        color: "black",
        fontSize: 13,
        fontWeight: "900",
        marginBottom: 8,

    },
});
export default ProductCard;
