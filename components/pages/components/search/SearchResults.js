import React, { useCallback, useEffect, useState, useContext, useRef } from 'react';
import {
    ActivityIndicator, Alert, Button, Dimensions, FlatList, StyleSheet, Switch, Text, TouchableOpacity, View
} from "react-native";
import { Filter, ChevronDown } from "lucide-react-native";
import SortActionSheet from "@/components/pages/components/search/SortActionSheet";
import { SheetManager } from "react-native-actions-sheet";

const { width } = Dimensions.get("window");
import { Toast } from "@/components/ui/toast";
import ProductCard from "@/components/pages/components/product/ProductCard";
import ContentLoader from "react-native-easy-content-loader";
import { Heading } from "@/components/ui/heading";
import { SQLiteProvider, useSQLiteContext, SQLiteDatabase } from 'expo-sqlite';
import { SearchInputTextContext } from "@/app_contexts/AppContext";
import { getSearch } from '@/components/config/API';



const SearchResults = (props) => {
    const db = useSQLiteContext();
    const [sortingOption, setSortingOption] = useState('our_ranking');
    const [isEnabled, setIsEnabled] = useState(false);
    const {
        searchText,
        setSearchText,
        searchSuggestionType,
        setSearchSuggestionType,
        searchSuggestionItemId,
        setSearchSuggestionItemId,
        searchSuggestionItemName,
        setSearchSuggestionItemName,
    } = useContext(SearchInputTextContext);

    const offsetRef = useRef(0); // for pagination

    const [limit, setLimit] = useState(20); //for pagination

    const [searchProducts, setSearchProducts] = useState([]);
    const {

        // searchText,
        isSearchButtonPressed
        // setSearchText
    } = props;
    //FROM PRODUCTS PAGE
    const [page, setPage] = useState(1);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isAppDataFetchLoading, setIsAppDataFetchLoading] = useState(true);
    const [isAppDataFetchError, setIsAppDataFetchError] = useState(false);
    const [appDataFetchMsg, setIsAppDataFetchMsg] = useState("");



    //END FROM PRODUCTS PAGE

    // console.log(props)
    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState)
    };

    const openActionSheetSorting = async () => {

        const selectedSortOption = await SheetManager.show('sort-action-sheet', {
            payload: {
                initialSortingOption: sortingOption
            }
        });

        if (selectedSortOption && selectedSortOption.selected_sorting) {
            setSortingOption(selectedSortOption.selected_sorting);
        }
    };


    // GET FROM PRODUCTS PAGE
    const productCardAction = (product) => {
        // console.log('PRODUCCCCCCCCCCCCCCCCCCCCCCCCCCCCCT');
        // console.log(product);
        props.navigation.navigate("ProductDetails", { product_id: product.product_id });
    };


    const fetchData = useCallback(async () => {
        // setSearchProducts([])
        // productsSearchResultsLoading(false, "Fetched data")
        console.log("FETCHING DATA")
        console.log(searchSuggestionType)
        console.log(searchSuggestionItemId)
        if (isSearchButtonPressed) {
            await getSearch({ productsSearchResultsLoading, searchText, limit, offset: offsetRef.current });
        } else {
            if (searchSuggestionType === 'category') {
                await getSearch({ productsSearchResultsLoading, searchText, limit, offset: offsetRef.current, category_id: searchSuggestionItemId });
                console.log('SEARCH BY CATEGORY')
            } else if (searchSuggestionType === 'sub_category') {
                await getSearch({ productsSearchResultsLoading, searchText, limit, offset: offsetRef.current, sub_category_id: searchSuggestionItemId });
            } else {
                await getSearch({ productsSearchResultsLoading, searchText, limit, offset: offsetRef.current, product_id: searchSuggestionItemId });
            }


        }

    });

    useEffect(() => {
        fetchData();
        // fetchProducts(page - 1); // Load initial products
    }, []);


    const productsSearchResultsLoading = async (isFetchingDataError, message, fetchResults) => {

        console.log("   SEARCH RESULTS: ---->>>" + fetchResults)
        console.log("   SEARCH RESULTS2: ---->>>" + message)
        setIsAppDataFetchLoading(false);

        if (isFetchingDataError) {
            setIsAppDataFetchError(true);
            setIsAppDataFetchMsg(message);
            Toast.show({
                text1: 'Error', text2: message, position: 'bottom', bottomOffset: 50,
            });
        } else {

            if (fetchResults && fetchResults.length > 0) {
                setSearchProducts(fetchResults);
                setIsAppDataFetchError(false);
            } else {
                setSearchProducts([]);
                setIsAppDataFetchError(true);
                setIsAppDataFetchMsg("No items matching search query...");
            }



            // setIsAppDataFetchError(false);
            // setIsAppDataFetchMsg(message);

        }
    };


    const renderProductList = ({ item, index }) => (
        <View key={`${item.product_id}-${index}-${item.product_attributes_id}`} style={styles.productCardContainer}>
            <ProductCard data={{
                product: item, action: productCardAction,
            }} />
        </View>);
    const renderFooter = () => {
        if (!isFetchingMore) return null;
        return (<View style={styles.footer}>
            <ActivityIndicator size="large" color="#000" />
        </View>);
    };

    if (isAppDataFetchLoading) {
        return (<View style={styles.container}>
            <ContentLoader
                active={true}
                loading={true}
                pRows={5}
                pHeight={[70, 100, 50, 70, 160, 77]}
                pWidth={[100, 300, 70, 200, 300, 300]}
            />
        </View>);
    } else if (isAppDataFetchError) {
        return (<View style={styles.container}>
            <Heading style={styles.errorText} size="sm" fontWeight="bold">
                <Text>{appDataFetchMsg}</Text>
            </Heading>
        </View>);
    } else {
        if (searchProducts.length === 0) {
            return (<View style={styles.container}>
                <Heading style={styles.errorText} size="sm" fontWeight="bold">
                    <Text>No items matching search query...</Text>
                </Heading>
            </View>);
        }
        return (<FlatList
            style={styles.container}
            data={[{ type: 'header' }, {
                type: 'products', data: searchProducts
            }]}
            renderItem={({ item }) => {
                if (item.type === 'header') {
                    return (<View style={styles.contentContainer}>
                        <View style={styles.topPartContainer}>
                            <View style={styles.leftPart}>
                                <Switch
                                    style={styles.switchStyle}
                                    trackColor={{ false: '#767577', true: '#2780e3' }}
                                    thumbColor={isEnabled ? '#fff' : '#f4f3f4'}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={toggleSwitch}
                                    value={isEnabled}
                                />
                                <Text style={styles.textStyle}>Free Shipping</Text>
                            </View>
                            <TouchableOpacity
                                style={[styles.buttonContainer, { backgroundColor: '#767577' }]}
                                onPress={openActionSheetSorting}
                            >
                                <Text style={{ marginTop: 4 }}><ChevronDown color={'#fff'} size={18} /></Text>
                                <Text style={[styles.textStyle, { color: '#fff' }]}>
                                    Sorting
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.buttonContainer}
                                onPress={() => Alert.alert('Simple Button pressed')}
                            >
                                <Text style={{ marginTop: 4 }}><Filter color={'#fff'} size={18} /></Text>
                                <Text style={[styles.textStyle, { color: '#fff' }]}>
                                    Filters
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Text>Search results</Text>
                        <SortActionSheet />
                    </View>);
                } else if (item.type === 'products') {
                    return (<View style={styles.flashProductsContainer}>

                        <FlatList
                            style={styles.container}
                            data={item.data}
                            numColumns={2}
                            columnWrapperStyle={styles.columnWrapperStyle}
                            contentContainerStyle={styles.flashProductsListContainer}
                            renderItem={renderProductList}
                            keyExtractor={item => `${item.product_id}-${item.product_attributes_id}${+Math.floor(Math.random() * 1000)}`}

                            removeClippedSubviews={true}
                            maxToRenderPerBatch={10}
                            windowSize={11}
                            initialNumToRender={10}

                            ListFooterComponent={renderFooter}
                            // onEndReached={loadMoreProducts}
                            onEndReachedThreshold={0.5}
                        />
                    </View>);
                }
            }}
            keyExtractor={(item, index) => index.toString()}
        // ListFooterComponent={renderFooter}
        // onEndReached={loadMoreProducts}
        // onEndReachedThreshold={0.5}
        />);
    }

    //END HERE


};

const styles = StyleSheet.create({
    contentContainer: {
        padding: 10,
    }, topPartContainer: {
        flexDirection: 'row', // Arrange children horizontally
        alignItems: 'center', // Center items vertically
        justifyContent: 'space-between', // Pushes the button to the far right
    }, switchStyle: {
        transform: [{ scaleX: 0.9 }, { scaleY: 0.8 }],
    }, leftPart: {
        flexDirection: 'row', // Arrange Switch and Text horizontally
        alignItems: 'center', // Center items vertically
    }, textStyle: {
        fontWeight: 'bold'
    }, buttonContainer: {
        flexDirection: 'row', // Arrange children horizontally
        alignItems: 'center', // Center items vertically
        justifyContent: 'space-between', backgroundColor: '#2780e3', padding: 6, borderRadius: 5
    }, // FROM PRODUCTS
    productCardContainer: {
        width: (width - 30) / 2 - 15, marginHorizontal: 5,
    }, flashProductsContainer: {
        paddingHorizontal: 16, paddingVertical: 10, backgroundColor: 'rgba(250,249,249,0.83)',
    }, flashProductsHeader: {
        // marginBottom: 10,
        // alignItems: 'center',
        // justifyContent: 'space-between',
        flexDirection: 'row', margin: 10
    }, flashProductsListContainer: {
        paddingBottom: 80,
    },
    errorText: {
        textAlign: 'center',
        color: 'red'
    }
});

export default SearchResults;
