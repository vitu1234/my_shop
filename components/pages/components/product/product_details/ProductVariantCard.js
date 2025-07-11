import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import numbro from "numbro";

function ProductVariantCard(props) {
    const data = props.data;

    if (!data) return <View />;

    const productVariant = data.productVariant;
    const attributes = productVariant.attributes || [];

    const product_price = "K" + numbro(parseInt(productVariant.price)).format({
        thousandSeparated: true,
        mantissa: 2,
    });

    const isOutOfStock = productVariant.stock_qty === 0;
    const remaining = isOutOfStock ? "Out of Stock" : `${productVariant.stock_qty} in stock`;

    return (
        <TouchableOpacity
            key={productVariant.product_variant_id}
            onPress={() => data.action(productVariant)}
            style={[
                styles.card,
                productVariant.is_default === 1 && styles.highlightedContainer
            ]}
        >
            <View style={styles.infoContainer}>
                <Text
                    style={[
                        styles.sku,
                        productVariant.is_default === 1 && styles.highlightedTextColor
                    ]}
                >
                    {productVariant.sku}
                </Text>

                <Text
                    style={[
                        styles.stock,
                        isOutOfStock ? styles.outOfStock : null,
                        productVariant.is_default === 1 && styles.highlightedTextColor
                    ]}
                >
                    {remaining}
                </Text>

                <Text
                    style={[
                        styles.price,
                        productVariant.is_default === 1 && styles.highlightedTextColor
                    ]}
                >
                    {product_price}
                </Text>

                {attributes.map((attr, index) => (
                    <View key={index} style={styles.attributeGroup}>
                        <Text style={styles.filterName}>{attr.filter_name}:</Text>
                        <View style={styles.optionLabelsContainer}>
                            {attr.option_labels.map((label, i) => (
                                <Text key={i} style={styles.optionLabel}>
                                    {label.option_label}
                                </Text>
                            ))}
                        </View>
                    </View>
                ))}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 5,
        padding: 16,
        marginVertical: 6,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    highlightedContainer: {
        backgroundColor: "#007bff20", // light blue background
        borderColor: "#007bff",
        borderWidth: 1,
    },
    infoContainer: {
        flexDirection: "column",
    },
    sku: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4,
    },
    stock: {
        fontSize: 12,
        color: "#555",
        marginBottom: 4,
    },
    outOfStock: {
        color: "#ff3b30",
        fontWeight: "bold",
    },
    price: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#111",
        marginBottom: 10,
    },
    attributeGroup: {
        marginBottom: 6,
    },
    filterName: {
        fontSize: 12,
        fontWeight: "600",
        color: "#007bff",
        marginBottom: 2,
    },
    optionLabelsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
    },
    optionLabel: {
        backgroundColor: "#f0f0f0",
        paddingVertical: 3,
        paddingHorizontal: 6,
        borderRadius: 12,
        fontSize: 11,
        marginRight: 6,
        marginBottom: 4,
        color: "#333",
    },
    highlightedTextColor: {
        color: "#007bff",
    },
});

export default ProductVariantCard;
