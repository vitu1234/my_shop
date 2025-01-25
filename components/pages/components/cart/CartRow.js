import React, { useEffect, useState } from "react";
import { View, Alert, Image, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import numbro from "numbro";
import { SquareX, SquareCheckBig } from "lucide-react-native";

import Checkbox from 'expo-checkbox';

import { Text } from "@/components/ui/text";

function CartRow({ data }) {
    if (!data) return <View />;

    const product = data.product;
    const [productQty, setProductQty] = useState(product.qty);
    const [productPrice, setProductPrice] = useState(product.qty * parseFloat(product.product_attributes_price));
    const [isLoading, setIsLoading] = useState({ add: false, minus: false, remove: false });

    const [isChecked, setChecked] = useState(false);

    useEffect(() => {
        setProductPrice(productQty * parseFloat(product.product_attributes_price));
    }, [productQty]);

    const updateQuantity = (change) => {
        if (productQty + change < 1) return;
        setIsLoading((prev) => ({ ...prev, [change > 0 ? "add" : "minus"]: true }));
        setProductQty(productQty + change);
        // Database update logic here
    };

    const removeProductCart = () => {
        setIsLoading((prev) => ({ ...prev, remove: true }));
        data.actionRemoveLoading(true);
        // Database remove logic here
        Alert.alert("Success", "Removed from cart");
        setIsLoading((prev) => ({ ...prev, remove: false }));
    };

    return (
        <View style={styles.cartItem}>
            {/* Product Info Row */}
            <View style={styles.topRow}>
                {/* <TouchableOpacity onPress={removeProductCart} style={styles.iconButton}>
                    <SquareCheckBig size={18} color="green" />
                </TouchableOpacity> */}

                <View style={styles.section}>
                    <Checkbox style={styles.checkbox} value={isChecked} onValueChange={setChecked} />
                </View>

                <View style={styles.productDetails}>
                    <Text numberOfLines={1} style={styles.name}>
                        {product.product_name}
                    </Text>
                    <Text numberOfLines={2} style={styles.description}>
                        {product.product_attributes_name} - {product.product_attributes_value}
                    </Text>
                </View>

                <TouchableOpacity onPress={removeProductCart} style={styles.iconButton}>
                    <SquareX size={24} />
                </TouchableOpacity>
            </View>

            {/* Image and Price */}
            <View style={styles.middleRow}>
                <Image style={styles.thumb} source={{ uri: product.cover }} />
                <Text style={styles.price}>
                    K{numbro(parseInt(productPrice)).format({ thousandSeparated: true, mantissa: 2 })}
                </Text>
            </View>

            <View style={{ flex: 1 }}></View>

            {/* Quantity Controls */}
            <View style={styles.bottomRow}>
                <TouchableOpacity
                    disabled={productQty === 1}
                    style={[
                        styles.qtyButton,
                        productQty === 1 && styles.disabledButton,
                    ]}
                    onPress={() => updateQuantity(-1)}
                >
                    <Icon name="minus" size={20} color={productQty === 1 ? "#aaa" : "#000"} />
                </TouchableOpacity>

                <Text style={styles.qtyText}>{productQty}</Text>

                <TouchableOpacity
                    disabled={productQty >= product.product_attributes_stock_qty}
                    style={[
                        styles.qtyButton,
                        productQty >= product.product_attributes_stock_qty && styles.disabledButton,
                    ]}
                    onPress={() => updateQuantity(1)}
                >
                    <Icon name="plus" size={20} color="#000" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cartItem: {
        backgroundColor: "#f9f9f9",
        marginVertical: 6,
        padding: 16,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    topRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 2,
    },
    iconButton: {
        padding: 8,
    },
    productDetails: {
        flex: 1,
        marginHorizontal: 8,
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    description: {
        fontSize: 14,
        color: "#666",
    },
    middleRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 2,
    },
    thumb: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    price: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
        flex: 1,

    },
    bottomRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        marginTop: 2,
        marginLeft: 72
    },
    qtyButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: "#f0f0f0",
        alignItems: "center",
        justifyContent: "center",
    },
    disabledButton: {
        backgroundColor: "#e0e0e0",
    },
    qtyText: {
        marginHorizontal: 16,
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },

    section: {
        // flexDirection: 'row',
        // alignItems: 'center',
        padding: 4,
        marginEnd: 5
    },
    paragraph: {
        fontSize: 15,
    },
    checkbox: {
        // margin: 8,
        padding: 8
    },
});

export default CartRow;
