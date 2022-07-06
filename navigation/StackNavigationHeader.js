import React from 'react';
import {HStack, View, Text} from 'native-base';
import Icon from 'react-native-vector-icons/AntDesign';
import {Dimensions, StyleSheet, TouchableHighlight, TouchableOpacity} from 'react-native';


function StackNavigationHeader(props) {
    let cartCount = 1;
    return (

        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Icon
                            name="shoppingcart"
                            color={'#000'}
                            size={26}
                            containerStyle={{marginHorizontal: 15, position: 'relative'}}
                        />
                        {cartCount > 0 ? (
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
                                    {cartCount}
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
