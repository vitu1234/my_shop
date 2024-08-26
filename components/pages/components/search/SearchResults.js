import React, {useCallback, useEffect, useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    Button, Dimensions,
    FlatList,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {Filter, ChevronDown} from "lucide-react-native";
import SortActionSheet from "@/components/pages/components/search/SortActionSheet";
import {SheetManager} from "react-native-actions-sheet";

const {width} = Dimensions.get("window");
import {Toast} from "@/components/ui/toast";
import ProductCard from "@/components/pages/components/ProductCard";
import ContentLoader from "react-native-easy-content-loader";
import {Heading} from "@/components/ui/heading";

const SearchResults = (props) => {
    // console.log(props)

    const [sortingOption, setSortingOption] = useState('our_ranking');
    const [isEnabled, setIsEnabled] = useState(false);

    const [searchProducts, setSearchProducts] = useState([]);
    const {db, searchText, searchSuggestionType, searchSuggestionItemId, searchSuggestionItemName} = props;
    //FROM PRODUCTS PAGE
    const [page, setPage] = useState(1);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isAppDataFetchLoading, setIsAppDataFetchLoading] = useState(true);
    const [isAppDataFetchError, setIsAppDataFetchError] = useState(false);
    const [appDataFetchMsg, setIsAppDataFetchMsg] = useState("");

    //END FROM PRODUCTS PAGE


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
        // console.log(product);
        props.navigation.navigate("ProductDetails", {data: product});
    };
    const fetchProducts = async (pageNumber) => {
        setIsFetchingMore(true);
        console.log("searchSuggestionItemId : RESULTS", searchSuggestionItemId);
        try {
            if (searchSuggestionItemId !== -1) {
                const fetchedProducts = await db.getAllAsync(`SELECT * FROM product INNER JOIN product_attributes ON product.product_id = product_attributes.product_id WHERE product_attributes.product_attributes_default = 1 ORDER BY RANDOM() LIMIT 20 OFFSET ${pageNumber * 20}`);
                if (fetchedProducts.length === 0) {
                    setHasMore(false);
                }
                setSearchProducts(prevProducts => [...prevProducts, ...fetchedProducts]);
            } else {
                console.log("fetchProducts with search criteria not selected")
            }

        } catch (error) {
            console.error("Error fetching products:", error);
            setHasMore(false);
        } finally {
            setIsFetchingMore(false);
        }
    };

    const fetchData = useCallback(async () => {
        if (db) {
            productsScreenLoading(false, "Fetched data")
        }
    }, [db]);

    useEffect(() => {
        if (db) {
            fetchData();
            fetchProducts(page - 1); // Load initial products
        }
    }, [db, page]);


    const productsScreenLoading = async (isFetchingDataError, message) => {
        setIsAppDataFetchLoading(false);
        if (isFetchingDataError) {
            setIsAppDataFetchError(true);
            setIsAppDataFetchMsg(message);
            Toast.show({
                text1: 'Error',
                text2: message,
                position: 'bottom',
                bottomOffset: 50,
            });
        } else {
            if (db) {
                if (searchSuggestionItemId !== -1) {
                    const productsFetch = await db.getAllAsync("SELECT * FROM product INNER JOIN product_attributes ON product.product_id = product_attributes.product_id WHERE product_attributes.product_attributes_default = 1 ORDER BY RANDOM() LIMIT 20");
                    setSearchProducts(productsFetch);
                } else {
                    console.log("productsScreenLoading with search criteria not selected")
                }

                setIsAppDataFetchError(false);
                setIsAppDataFetchMsg(message);
            } else {
                setIsAppDataFetchError(true);
                setIsAppDataFetchMsg("Local Database error...");
            }
        }
    };

    const loadMoreProducts = () => {
        console.log("loading more function")
        if (!isFetchingMore && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const renderProductList = ({item}) => (
        <View key={item.product_id} style={styles.productCardContainer}>
            <ProductCard data={{
                database: db,
                product: item,
                action: productCardAction,
            }}/>
        </View>
    );
    const renderFooter = () => {
        if (!isFetchingMore) return null;
        return (
            <View style={styles.footer}>
                <ActivityIndicator size="large" color="#000"/>
            </View>
        );
    };


    if (isAppDataFetchLoading) {
        return (
            <View style={styles.container}>
                <ContentLoader
                    active={true}
                    loading={true}
                    pRows={5}
                    pHeight={[70, 100, 50, 70, 160, 77]}
                    pWidth={[100, 300, 70, 200, 300, 300]}
                />
            </View>
        );
    } else if (isAppDataFetchError) {
        return (
            <View style={styles.container}>
                <Heading style={styles.errorText} size="sm" fontWeight="bold">
                    <Text>{appDataFetchMsg}</Text>
                </Heading>
            </View>
        );
    } else {
        return (
            <FlatList
                style={styles.container}
                data={[{type: 'header'}, {
                    type: 'products',
                    data: searchProducts
                }]}
                renderItem={({item}) => {
                    if (item.type === 'header') {
                        return (
                            <View style={styles.contentContainer}>
                                <View style={styles.topPartContainer}>
                                    <View style={styles.leftPart}>
                                        <Switch
                                            style={styles.switchStyle}
                                            trackColor={{false: '#767577', true: '#2780e3'}}
                                            thumbColor={isEnabled ? '#fff' : '#f4f3f4'}
                                            ios_backgroundColor="#3e3e3e"
                                            onValueChange={toggleSwitch}
                                            value={isEnabled}
                                        />
                                        <Text style={styles.textStyle}>Free Shipping</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={[styles.buttonContainer, {backgroundColor: '#767577'}]}
                                        onPress={openActionSheetSorting}
                                    >
                                        <Text style={{marginTop: 4}}><ChevronDown color={'#fff'} size={18}/></Text>
                                        <Text style={[styles.textStyle, {color: '#fff'}]}>
                                            Sorting
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.buttonContainer}
                                        onPress={() => Alert.alert('Simple Button pressed')}
                                    >
                                        <Text style={{marginTop: 4}}><Filter color={'#fff'} size={18}/></Text>
                                        <Text style={[styles.textStyle, {color: '#fff'}]}>
                                            Filters
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <Text>Search results</Text>
                                <SortActionSheet/>
                            </View>
                        );
                    } else if (item.type === 'products') {
                        return (
                            <View style={styles.flashProductsContainer}>

                                <FlatList
                                    style={styles.container}
                                    data={item.data}
                                    numColumns={2}
                                    columnWrapperStyle={styles.columnWrapperStyle}
                                    contentContainerStyle={styles.flashProductsListContainer}
                                    renderItem={renderProductList}
                                    keyExtractor={item => item.product_id.toString()}
                                />
                            </View>
                        );
                    }
                }}
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={renderFooter}
                onEndReached={loadMoreProducts}
                onEndReachedThreshold={0.5}
            />
        );
    }

    //END HERE


};

const styles = StyleSheet.create({
    contentContainer: {
        padding: 10,
    },
    topPartContainer: {
        flexDirection: 'row', // Arrange children horizontally
        alignItems: 'center', // Center items vertically
        justifyContent: 'space-between', // Pushes the button to the far right
    },
    switchStyle: {
        transform: [{scaleX: 0.9}, {scaleY: 0.8}],
    },
    leftPart: {
        flexDirection: 'row', // Arrange Switch and Text horizontally
        alignItems: 'center', // Center items vertically
    },
    textStyle: {
        fontWeight: 'bold'
    },
    buttonContainer: {
        flexDirection: 'row', // Arrange children horizontally
        alignItems: 'center', // Center items vertically
        justifyContent: 'space-between',
        backgroundColor: '#2780e3',
        padding: 6,
        borderRadius: 5
    },
    // FROM PRODUCTS
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
    flashProductsListContainer: {
        paddingBottom: 80,
    },
});

export default SearchResults;
