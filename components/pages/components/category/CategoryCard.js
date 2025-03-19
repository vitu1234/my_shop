import React from "react";
import { TouchableOpacity, Image, Text, View, StyleSheet } from "react-native";

function CategoryCard(props) {
    const data = props.data;

    if (data !== undefined) {
        const category = data.category;

        return (
            <TouchableOpacity 
                key={category.product_id} 
                onPress={() => data.action(category)} 
                style={styles.card}
            >
                <View style={styles.contentContainer}>
                    <Image
                        alt={"Category Image"}
                        style={styles.thumb}
                        source={{ uri: category.category_icon }}
                    />
                    <Text numberOfLines={2} style={styles.name}>{category.category_name}</Text>
                </View>
            </TouchableOpacity>
        );
    } else {
        console.log("Data undefined");
    }

    return <View />;
}

const styles = StyleSheet.create({
    card: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 5,
        shadowOpacity: 0.09,
        shadowRadius: 2,
        shadowColor: "black",
        shadowOffset: { height: 0, width: 0 },
        elevation: 1,
        // marginVertical: 5,
        padding: 10,
        borderColor: "#ccc",
        borderWidth: 1
    },
    contentContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    thumb: {
        width: 30,
        height: 30,
        resizeMode: "cover",
        borderRadius: 8,
        marginRight: 1,
    },
    name: {
        color: "#424242",
        fontSize: 14,
        // fontWeight: "bold",
        flexShrink: 1,
    }
});

export default CategoryCard;
