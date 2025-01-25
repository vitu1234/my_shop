import React, { useEffect, useState } from "react";
import { View, Alert, Image, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import numbro from "numbro";
import { SquareX, SquareCheckBig, Weight, Box } from 'lucide-react-native';

import { Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";

function CartRow({ data }) {
    if (!data) return <View />;

    const product = data.product;
    const [productQty, setProductQty] = useState(product.qty);
    const [productPrice, setProductPrice] = useState(product.qty * parseFloat(product.product_attributes_price));
    const [isLoading, setIsLoading] = useState({ add: false, minus: false, remove: false });

    useEffect(() => {
        setProductPrice(productQty * parseFloat(product.product_attributes_price));
    }, [productQty]);

    const updateQuantity = (change) => {
        if (productQty + change < 1) return;
        setIsLoading((prev) => ({ ...prev, [change > 0 ? 'add' : 'minus']: true }));
        const newQty = productQty + change;
        // setProductQty(newQty);

        // db.transaction(tx => {
        //     tx.executeSql(
        //         "UPDATE cart SET qty=? WHERE product_id = ?",
        //         [newQty, product.product_id],
        //         () => setIsLoading((prev) => ({ ...prev, [change > 0 ? 'add' : 'minus']: false })),
        //         error => console.log(error)
        //     );
        // });
    };

    const removeProductCart = () => {
        setIsLoading((prev) => ({ ...prev, remove: true }));
        data.actionRemoveLoading(true);

        db.transaction(tx => {
            tx.executeSql(
                "DELETE FROM cart WHERE id=?",
                [product.id],
                (tx, results) => {
                    if (results.rowsAffected > 0) {
                        Alert.alert("Success", "Removed from cart");
                    }
                    setIsLoading((prev) => ({ ...prev, remove: false }));
                },
                error => console.log(error)
            );
        });
    };

    return (
        <View style={styles.cartItem}>

            <HStack space={3} style={{ marginBottom: 5, flexDirection: "row" }}>
                <TouchableOpacity onPress={removeProductCart} style={{ ...styles.removeButton }}>
                    <SquareCheckBig size={18} color="green" />
                </TouchableOpacity>

                <VStack style={{ ...styles.detailsContainer, flex: 1, alignItems: "center", marginEnd: 10 }}>
                    <Text numberOfLines={1} style={styles.name}>{product.product_name}</Text>
                    <Text numberOfLines={2}>{product.product_attributes_name} - {product.product_attributes_value}</Text>
                </VStack>

                <TouchableOpacity onPress={removeProductCart} style={{ ...styles.removeButton }}>
                    <SquareX size={28} />
                </TouchableOpacity>
            </HStack>

            <HStack style={styles.container}>


                <Image style={styles.thumb} source={{ uri: product.cover }} />

                <VStack style={styles.detailsContainer}>
                    <Text style={styles.price}>
                        K {numbro(parseInt(productPrice)).format({ thousandSeparated: true, mantissa: 2 })}
                    </Text>
                </VStack>


            </HStack>

            <View style={{ flexDirection: "row" }}>

                <View style={{ flex: 1 }}></View>

                <HStack space={3} style={{ ...styles.qtyContainer, flex: 2, flexDirection: 'row', borderRadius: 5, borderColor: 'gray', borderWidth: 1 }}>

                    <TouchableOpacity disabled={productQty === 1 ? true : false} style={{ flex: 1 }} isLoading={isLoading.minus} onPress={() => updateQuantity(-1)} variant="outline" size="40">
                        <Icon name="minus" size={20} color={productQty === 1 ? "gray" : "#000"} />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{productQty}</Text>
                    <TouchableOpacity disabled={productQty >= product.product_attributes_stock_qty ? true : false} style={{ flex: 1 }} isLoading={isLoading.add} onPress={() => updateQuantity(1)} variant="outline" size="sm">
                        <Icon name="plus" size={20} color="#000" />
                    </TouchableOpacity>

                </HStack>

                <View style={{ flex: 3 }}></View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cartItem: {
        backgroundColor: "#fff",
        marginBottom: 5,
        padding: 16,
        borderRadius: 10,
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    removeButton: {
        // marginRight: 10,
    },
    thumb: {
        width: 65,
        height: 65,
        borderRadius: 10,
    },
    detailsContainer: {
        flex: 1,
        marginLeft: 10,
    },
    name: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#424242",
    },
    price: {
        fontSize: 18,
        fontWeight: "bold",
        color: "black",
    },
    qtyContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    qtyText: {
        fontSize: 16,
        fontWeight: "bold",
        // color: "grey",
        marginTop: 10,
        marginBottom: 10,
        flex: 1
    },
});

export default CartRow;
