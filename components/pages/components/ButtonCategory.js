import React from 'react';
import {View, StyleSheet,Text} from 'react-native';
import {Button} from "@/components/ui/button"


function ButtonCategory(props) {
    const data = props.data;
    if (data.bgColor === true) {
        return (
            <Button key={data.category_id} backgroundColor='#1f2937' onPress={() => data.action(data.category_id)} style={styles.btn}
                    size={'md'}
                    variant="outline" _text={{
                color: '#fff',
            }}><Text>{data.btnText}</Text></Button>
        );
    } else {
        return (
            <Button key={data.category_id} onPress={() => data.action(data.category_id)} style={styles.btn} variant="outline" size={'md'}
                    _text={{
                        color: '#1f2937',
                    }}><Text>{data.btnText}</Text></Button>
        );
    }


}

const styles = StyleSheet.create({
    btn: {
        // paddingLeft: 15,
        // paddingEnd: 15,
        margin: 5,
        alignSelf: 'center',
        height: '100%'
    },
});

export default ButtonCategory;
