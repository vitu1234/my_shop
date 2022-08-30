import React, {useContext, useEffect, useState} from 'react';
import {Box, Button, FlatList, Heading, HStack, Input, ScrollView, Text, View, VStack} from 'native-base';
import {Dimensions, StyleSheet} from 'react-native';
import {CartContext} from '../app_contexts/AppContext';
import ButtonCategory from './components/ButtonCategory';
import ProductCard from './components/ProductCard';
import SQLite from 'react-native-sqlite-storage';
import Icon from 'react-native-vector-icons/AntDesign';
import SearchFilterScreen from './components/SearchFilterScreen';

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

const products_list = [
    {
        'product_id': 2,
        'product_name': 'Men\'s T-Shirt',
        'product_price': '6000',
        'img_url': require('../assets/products/tshirt_3.png'),
    }, {
        'product_id': 1,
        'product_name': 'Nike Shoes Men',
        'product_price': '30000',
        'img_url': require('../assets/products/shoes_1.png'),
    },

    {
        'product_id': 5,
        'product_name': 'Nike Shoes Universal',
        'product_price': '36000',
        'img_url': require('../assets/products/shoes_2.png'),
    },
    {
        'product_id': 3,
        'product_name': 'Macbook Air 2019',
        'product_price': '1200000',
        'img_url': require('../assets/products/macbook_4.png'),
    },
    {
        'product_id': 4,
        'product_name': 'iPhone X Max',
        'product_price': '970000',
        'img_url': require('../assets/products/phone_5.png'),
    },
];

const db = SQLite.openDatabase(
    {
        name: 'MainDB1',
        location: 'default',
        version: 2,
    },
    () => {
        // console.log('db creaetd')
    },
    error => {
        console.log(error);
    },
);

function Products(props) {
    const [categoryActive, setCategoryActive] = useState(-1);
    const [cartItemsCount, setCartItemsCount] = useContext(CartContext);

    const initialSearchFilters = {
        price_asc: false,
        price_desc: false,
        newest_first: false,
        oldest_first: false,
        name_asc: false,
        name_desc: false,
    };

    const setFilters1 = (filters) => {
        setSearchFilters(filters);
        console.log(filters);
        console.log('filter products here');
    };
    const [searchFilters, setSearchFilters] = useState(initialSearchFilters);

    const btnCategoryAction = (category_id) => {
        console.log('GOES TO ' + category_id + ' CATEGORY');
        setCategoryActive(category_id);
    };

    const productCardAction = (product) => {
        // console.log(product);
        props.navigation.navigate('ProductDetails', {data: product});
    };

    const setCartCounterNumber = () => {
        //update cart counter
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM cart',
                [],
                (tx, results) => {
                    const len = results.rows.length;
                    setCartItemsCount(len);

                },
            );
        });
    };


    useEffect(() => {
        setCartCounterNumber();
    }, []);

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
            <Heading size="lg" fontWeight='900'>
                Your One Stop Shop!
                {/*<Text color="emerald.500"> React Ecosystem</Text>*/}
            </Heading>
            <Input mt={5} InputLeftElement={<Icon style={{margin: 3}} name="search1"
                                                  size={18} ml="2" color="#000"/>}
                   placeholder="Search Products..."/>
            <ScrollView
                ref={(scrollView) => {
                    scrollView = scrollView;
                }}
                // style={s.container}
                //pagingEnabled={true}
                marginTop={5}
                marginBottom={5}
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
                            data={{
                                btnText: 'All',
                                category_id: -1,
                                action: btnCategoryAction,
                                bgColor: false,
                            }}/>
                }

                {renderCategoryList}
            </ScrollView>

            <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                <VStack>


                    {/*<Divider style={{marginTop: 5}}/>*/}
                    <View style={{display: 'flex', direction: 'row'}}>

                        <ScrollView
                            horizontal={true}
                            contentContainerStyle={{width: '100%', height: '100%'}}>
                            <FlatList
                                columnWrapperStyle={{justifyContent: 'space-between'}}
                                contentContainerStyle={{paddingBottom: 190}}

                                numColumns={2} horizontal={false}
                                data={products_list}
                                renderItem={({item}) =>
                                    <Box style={{width: '45%'}}
                                         py="1">
                                        <ProductCard key={item.product_id} data={{
                                            product: item,
                                            action: productCardAction,
                                            cardWidth: 200,
                                        }}/>
                                    </Box>
                                } keyExtractor={item => item.product_id}/>
                        </ScrollView>
                    </View>

                    <SearchFilterScreen data={{newFilters: setFilters1}} searchStates={[searchFilters]}/>

                </VStack>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
        marginTop: 5,
    },
    cardContainer: {
        flex: 1,
        flexDirection: 'column',
    },

    card: {
        flex: 1,
        margin: 10,
        flexBasis: '50%',
    },
});
export default Products;
