import React, { useEffect, useState,useContext } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { SQLiteProvider, useSQLiteContext, SQLiteDatabase } from 'expo-sqlite';
import { SearchInputTextContext } from "@/app_contexts/AppContext";

const SearchSuggestions = (props) => {

    console.log('SUGGESTIONS')
    console.log(props)
    const db = useSQLiteContext();
    const [searchText, setSearchText] = useContext(SearchInputTextContext);
    const [results, setResults] = useState([]);

    const searchProducts = async () => {
        console.log("SEARCH: " + props.searchText)
        try {
            const resultsFetch = await db.getAllAsync(`
                SELECT 'product' AS result_type, product.product_id AS id, product.product_name AS name, NULL AS description
                FROM product
                INNER JOIN product_attributes ON product.product_id = product_attributes.product_id
                WHERE product_attributes.product_attributes_default = 1
                AND (product.product_name LIKE '%${searchText}%' OR product_attributes.product_attributes_name LIKE '%${searchText}%' OR product_attributes.product_attributes_value LIKE '%${searchText}%')
                
                UNION
                
                SELECT 'sub_category' AS result_type, sub_category.sub_category_id AS id, sub_category.sub_category_name AS name, sub_category.sub_category_description AS description
                FROM sub_category
                WHERE sub_category.sub_category_name LIKE '%${searchText}%' OR sub_category.sub_category_description LIKE '%${searchText}%'
                
                UNION
                
                SELECT 'category' AS result_type, category.category_id AS id, category.category_name AS name, category.category_description AS description
                FROM category
                WHERE category.category_name LIKE '%${searchText}%' OR category.category_description LIKE '%${searchText}%';
            `);
            setResults(resultsFetch);
            // console.log("resultsFetch", resultsFetch);
        } catch (error) {
            console.error("Error fetching results:", error);
        }
    }


    useEffect(() => {
        if (searchText) {
            searchProducts();
        }
    }, [props.searchText]);

    const searchTheItem = (searchText, itemId, itemName, resultType) => {
        console.log(searchText)
        props.setIsSearchButton(true);
        props.setIsTyping(false);
        // console.log('Item Name:', itemName);
        // console.log('Result Type:', resultType);
        props.setSearchSuggestionitemId(itemId)
        props.setSearchSuggestionItemName(itemName)
        props.setSearchSuggestionType(resultType)

    };


    const renderItem = ({ item }) => {
        const handlePress = () => {
            console.log("HANDLE PRESS")
            searchTheItem(searchText, item.id, item.name, item.result_type);
        };
        switch (item.result_type) {
            case 'product':
                return (
                    <TouchableOpacity onPress={handlePress}>
                        <View style={styles.itemContainer}>
                            <Text style={styles.itemTitle}
                                numberOfLines={1}>{item.name}</Text>
                        </View>
                    </TouchableOpacity>
                );
            case 'sub_category':
                return (
                    <TouchableOpacity onPress={handlePress}>
                        <View style={styles.itemContainer}>
                            <Text numberOfLines={1} style={styles.itemTitle}>{item.name}</Text>
                            {/*<Text>Description: {item.description}</Text>*/}
                        </View>
                    </TouchableOpacity>
                );
            case 'category':
                return (
                    <TouchableOpacity onPress={handlePress}>
                        <View style={styles.itemContainer}>
                            <Text numberOfLines={1} style={styles.itemTitle}>{item.name}</Text>
                        </View>
                    </TouchableOpacity>
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.contentContainer}>
            <FlatList
                style={styles.flatListContainer}
                data={results}
                keyExtractor={(item) => `${item.result_type}-${item.id}`}
                renderItem={renderItem}
            />
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({

    contentContainer: {
        padding: 10,
    },
    flatListContainer: {
        padding: 16
    },
    itemContainer: {
        padding: 16,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: 'rgba(129,129,129,0.24)'
    },
    itemTitle: {
        // fontSize: 20,
        fontWeight: 'bold',
    }
});
export default SearchSuggestions;
