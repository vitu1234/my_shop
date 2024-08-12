import React from 'react';
import { Button, StyleSheet, Text} from 'react-native';


function ButtonCategory(props) {
    const data = props.data;
    if (data.bgColor === true) {
        return (
            <Button key={data.category_id} backgroundColor='#1f2937' onPress={() => data.action(data.category_id)}
                    style={styles.btn}
                    size={'md'}
                    title={data.btnText}
                    variant="outline" _text={{
                color: '#fff',
            }}></Button>
        );
    } else {
        return (
            <Button key={data.category_id} onPress={() => data.action(data.category_id)} style={styles.btn}
                    variant="outline" size={'md'}
                    _text={{
                        color: '#1f2937',
                    }}
                    title={data.btnText}
            ></Button>
        );
    }


}

const styles = StyleSheet.create({
    btn: {
        // paddingLeft: 15,
        // paddingEnd: 15,
        marginBottom: 5,
        alignSelf: 'center',
        height: '100%'
    },
});

export default ButtonCategory;
