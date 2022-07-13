import React from 'react';
import {Button, Center, HStack, Image, View} from 'native-base';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {Dimensions} from 'react-native';
import numbro from 'numbro';

const {width} = Dimensions.get('window');
const windowHeight = Dimensions.get('window').height;


function CartRow(props) {
    const data = props.data;
    if (data !== undefined) {
        const product = data.product;
        const product_price = 'K' + numbro(parseInt(product.product_price) * product.qty).format({
            thousandSeparated: true,
            mantissa: 2,
        });

        return (
            <View style={{
                backgroundColor: '#fff',
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
                                style={{alignSelf: 'center'}}
                                alt={'Product Image'}
                                style={styles.thumb}
                                source={product.img_url}
                            />
                        </View>

                        <View>
                            <View style={{marginLeft: 'auto', justifyContent: 'flex-start', flexDirection: 'row'}}>
                                <Button style={{marginRight: 'auto'}} variant={'outline'} size="sm">
                                    <Icon name="close" size={15} color="#ff0101"/>
                                </Button>
                            </View>

                            <View style={styles.infoContainer}>
                                <Text numberOfLines={1} style={styles.name}>{product.product_name}</Text>
                                <Text numberOfLines={1} style={styles.price}>{product_price}</Text>
                                <Center mt={5}>
                                    <HStack space={5}
                                            style={{alignItems: 'center'}}>

                                        <Button variant={'outline'} size="sm">
                                            <Icon name="minus" size={15} color="#000"/>
                                        </Button>
                                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>{product.qty}</Text>
                                        <Button variant={'outline'} size="sm">
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
    } else {
        return (
            <View/>
        );
    }

}

const styles = StyleSheet.create({
    card: {
        width: 120,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowOpacity: 0.1,
        shadowRadius: 3,
        shadowColor: 'black',
        shadowOffset: {
            height: 0,
            width: 0,
        },
        elevation: 1,
        marginVertical: 0,
        marginEnd: 10,
    },
    thumb: {
        height: 100,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        width: '100%',
    },
    infoContainer: {
        padding: 1,
        marginTop: 5,
    },
    name: {
        color: '#424242',
        fontSize: 13,
        fontWeight: 'bold',
        flexShrink: 1,
    },
    price: {
        color: 'black',
        fontSize: 16,
        fontWeight: '900',
        marginBottom: 8,
        flexShrink: 1,

    },
    mainContainer: {
        alignSelf: 'flex-start',
        alignContent: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    container: {
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
});
export default CartRow;
