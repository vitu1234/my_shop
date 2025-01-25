import React, { useEffect, useState } from "react";
import { View, Dimensions, Alert, ImageBackground, Image, StyleSheet, TouchableOpacityc } from "react-native";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import Icon from "react-native-vector-icons/AntDesign";
import numbro from "numbro";
import { base_urlImages } from "../../../config/API";

import {Center} from "@/components/ui/center"
import {Box} from "@/components/ui/box"
import {Checkbox} from "@/components/ui/checkbox"
import {Button} from "@/components/ui/button"
import {HStack} from "@/components/ui/hstack"
import {VStack} from "@/components/ui/vstack"
import {Text} from "@/components/ui/text"

function CartRow({ data }) {
    if (!data) return <View />;
    
    const product = data.product;
    console.log("Product Cover:", product.cover);

    const [productQty, setProductQty] = useState(product.qty);
    const [productPrice, setProductPrice] = useState(product.qty * parseFloat(product.product_attributes_price));
    const [isLoadingBtnAdd, setIsLoadingBtnAdd] = useState(false);
    const [isLoadingBtnMinus, setIsLoadingBtnMinus] = useState(false);
    const [isLoadingBtnRemove, setIsLoadingBtnRemove] = useState(false);

    useEffect(() => {
        setProductPrice(productQty * parseFloat(product.product_attributes_price));
    }, [productQty]);

    const addProductCart = () => {
        setIsLoadingBtnAdd(true);
        const newQty = productQty + 1;
        setProductQty(newQty);

        db.transaction(tx => {
            tx.executeSql(
                "UPDATE cart SET qty=? WHERE product_id = ?",
                [newQty, product.product_id],
                () => {
                    setIsLoadingBtnAdd(false);
                    Alert.alert("Success!", "Your data has been updated.");
                },
                error => console.log(error)
            );
        });
    };

    const minusProductCart = () => {
        if (productQty === 1) return;

        const newQty = productQty - 1;
        setProductQty(newQty);
        setIsLoadingBtnMinus(true);

        db.transaction(tx => {
            tx.executeSql(
                "UPDATE cart SET qty=? WHERE product_id = ?",
                [newQty, product.product_id],
                () => setIsLoadingBtnMinus(false),
                error => console.log(error)
            );
        });
    };

    const removeProductCart = () => {
        setIsLoadingBtnRemove(true);
        data.actionRemoveLoading(true);

        db.transaction(tx => {
            tx.executeSql(
                "DELETE FROM cart WHERE id=?",
                [product.id],
                (tx, results) => {
                    if (results.rowsAffected > 0) {
                        Alert.alert("Success", "Removed from cart");
                    }
                    setIsLoadingBtnRemove(false);
                },
                error => console.log(error)
            );
        });
    };

    console.log(product.cover)

    return (
        
        <View style={{
            backgroundColor: "#fff",
            marginBottom: 4,
            paddingStart: 16,
            paddingEnd: 16,
            paddingTop: 10,
            paddingBottom: 10,
        }}>


            <View style={styles.mainContainer}>


                <View style={styles.container}>
                    <View style={styles.card}>
                        <Image
                        
                            alt={"Product Image"}
                            style={[styles.thumb, {alignSelf: 'center'}]}
                            source={{
                                uri: product.cover,
                            }}
                        />
                    </View>

                    <View>
                        <View style={{marginLeft: "auto", justifyContent: "flex-start", flexDirection: "row"}}>
                            <Button isLoading={isLoadingBtnRemove} onPress={() => removeProductCart()}
                                    style={{marginRight: "auto"}} variant={"outline"} size="sm">
                                <Icon name="close" size={15} color="#ff0101"/>
                            </Button>
                        </View>

                        <View style={styles.infoContainer}>
                            <View style={{flexDirection: "row"}}>
                                <Text numberOfLines={1} style={styles.name}>{product.product_attributes_name}</Text>
                            </View>
                            <Text numberOfLines={1} style={styles.price}>

                                K {numbro(parseInt(productPrice)).format({
                                thousandSeparated: true,
                                mantissa: 2,
                            })}

                            </Text>
                            <Center mt={5}>
                                <HStack space={5}
                                        style={{alignItems: "center"}}>

                                    <Button isLoading={isLoadingBtnMinus} onPress={() => minusProductCart()}
                                            variant={"outline"}
                                            size="sm">
                                        <Icon name="minus" size={15} color="#000"/>
                                    </Button>
                                    <Text style={{
                                        color: "grey",
                                        fontSize: 16,
                                        fontWeight: "bold"
                                    }}>{productQty}</Text>
                                    <Button isLoading={isLoadingBtnAdd} onPress={() => addProductCart()}
                                            variant={"outline"}
                                            size="sm">
                                        <Icon name="plus" size={15} color="#000"/>
                                    </Button>


                                </HStack>
                            </Center>
                        </View>
                    </View>
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cartItem: {
        backgroundColor: "#fff",
        marginBottom: 4,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    mainContainer: {
        alignSelf: "flex-start",
        alignContent: "center",
        justifyContent: "center",
        width: "100%",
    },
    container: {
        justifyContent: "space-between",
        flexDirection: "row",
    },
    card: {
        width: 120,
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowOpacity: 0.1,
        shadowRadius: 3,
        shadowColor: "black",
        shadowOffset: { height: 0, width: 0 },
        elevation: 1,
        marginEnd: 10,
    },
    thumb: {
        height: "100%",
        // borderTopLeftRadius: 16,
        // borderTopRightRadius: 16,
        width: "100%",
     
    },
    topRightButton: {
        marginLeft: "auto",
        justifyContent: "flex-start",
        flexDirection: "row",
    },
    infoContainer: {
        padding: 1,
        marginTop: 5,
    },
    name: {
        color: "#424242",
        fontSize: 13,
        fontWeight: "bold",
        flexShrink: 1,
        flex: 1,
        flexWrap: "wrap",
    },
    price: {
        color: "black",
        fontSize: 16,
        fontWeight: "900",
        marginBottom: 8,
    },
    qtyContainer: {
        alignItems: "center",
    },
    qtyText: {
        color: "grey",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default CartRow;
