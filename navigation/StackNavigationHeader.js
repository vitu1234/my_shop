import React, {useContext} from 'react';
import {HStack, View, Text} from 'native-base';
import Icon from 'react-native-vector-icons/AntDesign';
import {Dimensions, StyleSheet, TouchableHighlight, TouchableOpacity} from 'react-native';
import {AppContext, CartContext} from '../app_contexts/AppContext';
// import {CartContext} from '../app_contexts/CartContext';


function StackNavigationHeader(props) {
    const [cartItemsCount, setCartItemsCount] = useContext(CartContext);

    const navigator = props.data.navigation;

    // console.log(navigator.getState().routes[1].name);
    const gotToCart = () => {
        if (navigator.getState().routes[1].name !== 'Cart') {
            navigator.navigate('Cart');
        }
    };

    return (

        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity onPress={gotToCart}>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Icon
                            name="shoppingcart"
                            color={'#000'}
                            size={26}
                            containerStyle={{marginHorizontal: 15, position: 'relative'}}
                        />
                        {cartItemsCount > 0 ? (
                            <View
                                style={{
                                    position: 'absolute',
                                    backgroundColor: 'blue',
                                    width: 16,
                                    height: 16,
                                    borderRadius: 15 / 2,
                                    right: -8,
                                    top: -5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <Text
                                    style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#FFFFFF',
                                        fontSize: 8,
                                    }}>
                                    {cartItemsCount}
                                </Text>
                            </View>
                        ) : null}
                        <View>

                        </View>
                    </View>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={{marginStart: 16}}>
                <Icon

                    name="login"
                    color={'#000'}
                    size={23}
                    containerStyle={{marginHorizontal: 15, position: 'relative'}}
                />
            </TouchableOpacity>
        </View>
    );
}

export default StackNavigationHeader;
