import React from "react";
import {Button} from "@/components/ui/button"
import {Card} from "@/components/ui/card"
import {ImageBackground, Image, Text, View, StyleSheet, TouchableOpacity} from "react-native";
import numbro from "numbro";
import {base_urlImages} from "../../../config/API";
import {House, Import, Star} from "lucide-react-native";
import {getProductDefaultAttribute} from "../../../config/sqlite_db_service";

let dataG = [];

function ProductCard(props) {
    const data = props.data;
    


    if (data !== undefined) {
        const product = data.product;
        const product_price = "K" + numbro(parseInt(product.product_attributes_price)).format({
            thousandSeparated: true, mantissa: 2,
        });
        return (<TouchableOpacity key={product.product_id} onPress={() => data.action(product)} style={styles.card}>
            <Image
                alt={"Product Image "}
                style={styles.thumb}
                // source={product.img_url}
                source={{
                    uri: product.cover,
                }}
            />
            <View style={styles.infoContainer}>
                <Text numberOfLines={1} style={styles.name}>{product.product_name}</Text>
                <Text numberOfLines={1} style={styles.price}>{product_price}</Text>
                <View style={styles.likeStarsContainer}>
                    <Text numberOfLines={1} style={styles.likesSize}>reviews({product.likes})</Text>
                    <Star size={15} color={"#ffa534"}/>
                    <Star size={15} color={"#ffa534"}/>
                    <Star size={15} color={"#ffa534"}/>
                    <Star size={15} color={"#ffa534"}/>
                    <Star size={15} color={"#ffa534"}/>
                </View>
            </View>
        </TouchableOpacity>);
    } else {
        console.log("undvccf");
    }

    return (<View/>);


}

const styles = StyleSheet.create({
    card: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 5,
        shadowOpacity: 0.09,
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
        color: "#424242", fontSize: 11, fontWeight: "bold",
    }, price: {
        color: "black", fontSize: 13, fontWeight: "900", marginBottom: 8,

    }, likesSize: {}, likeStarsContainer: {
        justifyContent: 'space-between', flexDirection: 'row',
    }
});
export default ProductCard;
