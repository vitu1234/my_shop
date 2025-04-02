import React, { useContext, useEffect, useState, useCallback } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    FlatList,
    Dimensions,
    TouchableOpacity,
    Text,
    ActivityIndicator, Pressable
} from "react-native";
import ButtonCategory from "./components/ButtonCategory";
import CategoryCard from "./components/category/CategoryCard";
import { AppContext, CartContext } from "@/app_contexts/AppContext";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import ContentLoader from "react-native-easy-content-loader";
import { Divider } from "@/components/ui/divider";
import Toast from "react-native-toast-message";
import { getHomeScreen } from "../config/API";
import { Heading } from "lucide-react-native";

import { SQLiteProvider, useSQLiteContext, SQLiteDatabase } from 'expo-sqlite';


const { width } = Dimensions.get("window");

function CategoryScreen(props) {

    const db = useSQLiteContext();


    const [categoryActive, setCategoryActive] = useState(-1);
    const [categories, setCategories] = useState([]);



    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const btnCategoryAction = (categoryId) => {
        setCategoryActive(categoryId);
    };

    const categoryCardAction = (category) => {
        console.log(category.category_id)
        props.navigation.navigate("ProductsByCategoryScreen", { category_id: category.category_id, db: props.db });
    };

    const fetchData = useCallback(async () => {
        await fetchCategories();

    });

    useEffect(() => {
        fetchData();
    }, []);



    const fetchCategories = async () => {

        const categories = await db.getAllAsync("SELECT * FROM category ");

        setCategories(categories);

    };



    const renderCategoryList = ({ item }) => (
        <Box style={styles.flashProductBox} py="2">
            <CategoryCard
                key={item.category_id}
                data={{
                    database: db,
                    category: item,
                    action: categoryCardAction,
                    cardWidth: (width - 30) / 2 - 15,
                }}
            />
        </Box>
    );

    const renderFooter = () => {
        if (!isFetchingMore) return null;
        return (
            <View style={styles.footer}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    };


    return (
        <FlatList
            style={styles.container}
            data={[{ type: 'categories', data: categories }]}
            renderItem={({ item }) => {
                if (item.type === 'header') {
                    return (
                        <View style={styles.headerContainer}>

                            <Text style={styles.headerText}>Let's help you find what you want!</Text>

                        </View>
                    );
                } else if (item.type === 'productsFirstRow') {
                    return (
                        <FlatList
                            style={styles.container}
                            data={item.data}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.horizontalListContainer}
                            renderItem={renderProductList}
                            keyExtractor={item => item.product_id.toString()}
                        />
                    );
                } else if (item.type === 'categories') {
                    return (
                        <View style={styles.flashProductsContainer}>
                            {/* <View style={[styles.flashProductsHeader, { justifyContent: 'space-between' }]}>
                                    <Text style={styles.headerText}>Flash Products</Text>
                                    <TouchableOpacity
                                        onPress={() => console.log("Go to all products")}

                                    >
                                        <Text style={{ color: '#2780e3', fontWeight: 'bold' }}>View All {">>"}</Text>
                                    </TouchableOpacity>
                                </View> */}
                            <FlatList
                                style={styles.container}
                                data={item.data}
                                numColumns={2}
                                columnWrapperStyle={styles.columnWrapperStyle}
                                contentContainerStyle={styles.flashProductsListContainer}
                                renderItem={renderCategoryList}
                                keyExtractor={item => `${item.category_id}-${item.category_name}${+Math.floor(Math.random() * 1000)}`}

                                removeClippedSubviews={true}
                                maxToRenderPerBatch={10}
                                windowSize={11}
                                initialNumToRender={10}

                                ListFooterComponent={renderFooter}
                                // onEndReached={loadMoreProducts}
                                onEndReachedThreshold={0.5}
                            />
                        </View>
                    );
                }
            }}
            keyExtractor={(item, index) => index.toString()}
        // ListFooterComponent={renderFooter}
        // onEndReached={loadMoreProducts}
        // onEndReachedThreshold={0.5}
        />
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    headerContainer: {
        padding: 16,
        margin: 7
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    categoryButton: {
        marginBottom: 18,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#e0e0e0',
        borderRadius: 20,
        marginHorizontal: 5,
    },
    activeCategory: {
        backgroundColor: '#2780e3'
    },
    activeCategoryText: {
        color: '#fff'
    },
    categoryText: {
        color: '#000',
        fontWeight: 'bold',
    },
    productCardContainer: {
        width: (width - 30) / 2 - 15,
        marginHorizontal: 5,
    },
    flashProductsContainer: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: 'rgba(250,249,249,0.83)',
    },
    flashProductsHeader: {
        // marginBottom: 10,
        // alignItems: 'center',
        // justifyContent: 'space-between',
        flexDirection: 'row',
        margin: 10
    },
    viewAllButton: {

        // marginLeft: 'auto',
        borderColor: '#2780e3',

        // borderWidth: 1,
        padding: 5
    },
    flashProductBox: {
        marginVertical: 5,
        width: (width - 10) / 2 - 15,
    },
    columnWrapperStyle: {
        justifyContent: 'space-between',
    },
    flashProductsListContainer: {
        paddingBottom: 80,
    },
    footer: {
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        alignItems: 'center',
    },
    errorText: {
        color: "#b60303",
        alignSelf: "center",
    },
    horizontalListContainer: {
        paddingHorizontal: 16,
    },
});

export default CategoryScreen;
