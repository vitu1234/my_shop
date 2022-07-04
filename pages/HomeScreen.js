import React, {useState} from 'react';
import {Container, Heading, ScrollView, Text} from 'native-base';
import {View, StyleSheet} from 'react-native';
import ButtonCategory from '../components/ButtonCategory';
import {Dimensions} from 'react-native';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const {width} = Dimensions.get('window');


const product_categories_list = [
    {
        'category_id': 1,
        'category_name': 'Shoes',
    },
    {
        'category_id': 2,
        'category_name': 'Electronics',
    },
    {
        'category_id': 3,
        'category_name': 'Automotives',
    },
    {
        'category_id': 4,
        'category_name': 'Children & Toys',
    },
    {
        'category_id': 5,
        'category_name': 'School & Books',
    },
];

function HomeScreen(props) {
    const [categoryActive, setCategoryActive] = useState(-1);
    const btnCategoryAction = (category_id) => {
        console.log('GOES TO ' + category_id + ' CATEGORY');
        setCategoryActive(category_id);
    };

    const renderCategoryList = product_categories_list.map((category) => {
        if (category.category_id === categoryActive) {
            return (
                <ButtonCategory key={category.category_id} data={{
                    btnText: category.category_name,
                    category_id: category.category_id,
                    action: btnCategoryAction,
                    bgColor: true,
                }}></ButtonCategory>
            );
        } else {
            return (

                <ButtonCategory key={category.category_id} data={{
                    btnText: category.category_name,
                    category_id: category.category_id,
                    action: btnCategoryAction,
                    bgColor: false,
                }}></ButtonCategory>
            );
        }


    });

    return (
        <View style={styles.container}>
            <Heading size="md" fontWeight='bold'>
                Let's help you find what you want!
                {/*<Text color="emerald.500"> React Ecosystem</Text>*/}
            </Heading>
            <ScrollView
                ref={(scrollView) => {
                    scrollView = scrollView;
                }}
                // style={s.container}
                //pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                decelerationRate={0}
                snapToInterval={width - 60}
                snapToAlignment={'center'}
                contentInset={{
                    top: 0,
                    left: 30,
                    bottom: 0,
                    right: 30,
                }}>

                {
                    (categoryActive === -1) ?
                        <ButtonCategory
                            data={{btnText: 'All', category_id: -1, action: btnCategoryAction, bgColor: true}}/>
                        :
                        <ButtonCategory
                            data={{btnText: 'All', category_id: -1, action: btnCategoryAction, bgColor: false}}/>
                }

                {renderCategoryList}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor:'#fff',
        marginTop:5
    },
});

export default HomeScreen;
