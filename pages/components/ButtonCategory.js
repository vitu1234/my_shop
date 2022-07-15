import React from 'react';
import {Button} from 'native-base';
import {View, StyleSheet} from 'react-native';


function ButtonCategory(props) {
    const data = props.data;
    if (data.bgColor === true) {
        return (
            <Button backgroundColor='#1f2937' onPress={() => data.action(data.category_id)} style={styles.btn} size={'md'}
                    variant="outline" _text={{
                color: '#fff',
            }}>{data.btnText}</Button>
        );
    } else {
        return (
            <Button onPress={() => data.action(data.category_id)} style={styles.btn}  variant="outline" size={'md'}
                    _text={{
                        color: '#1f2937',
                    }}>{data.btnText}</Button>
        );
    }


}

const styles = StyleSheet.create({
    btn: {
        // paddingLeft: 15,
        // paddingEnd: 15,
        margin: 5,
        alignSelf:'center',
        height:'100%'
    },
});

export default ButtonCategory;
