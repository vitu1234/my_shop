import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, ScrollView} from "react-native";
import {SearchBarInput} from "@/components/pages/components/search/SearchBarInput";
import SearchHistory from "@/components/pages/components/search/SearchHistory";
import SearchResults from "@/components/pages/components/search/SearchResults";
import SearchSuggestions from "@/components/pages/components/search/SearchSuggestions";
import {connectToDatabase} from "@/components/config/sqlite_db_service";
import {Toast} from "@/components/ui/toast";
import ContentLoader from "react-native-easy-content-loader";
import {Heading} from "@/components/ui/heading";

const SearchScreen = (props) => {
    const [db, setDb] = useState(null);
    const [isTyping, setIsTyping] = React.useState(false);
    const [isSearchButton, setIsSearchButton] = React.useState(false);
    const [isSearchButtonPressed, setSearchButtonPressed] = React.useState(false);
    const [searchText, setSearchText] = React.useState('');
    const [searchSuggestionType, setSearchSuggestionType] = React.useState('');
    const [searchSuggestionItemId, setSearchSuggestionItemId] = React.useState(-1);
    const [searchSuggestionItemName, setSearchSuggestionItemName] = React.useState('');
    const [products, setProducts] = useState([]);

    const [isAppDataFetchLoading, setIsAppDataFetchLoading] = useState(true);
    const [isAppDataFetchError, setIsAppDataFetchError] = useState(false);
    const [appDataFetchMsg, setIsAppDataFetchMsg] = useState("");

    const navigateBack = () => {
        props.navigation.goBack();
    }

    const productsScreenLoading = async (isFetchingDataError, message) => {
        setIsAppDataFetchLoading(false);
        if (isFetchingDataError) {
            setIsAppDataFetchError(true);
            setIsAppDataFetchMsg(message);
            Toast.show({
                text1: 'Error', text2: message, position: 'bottom', bottomOffset: 50,
            });
        } else {
            if (db) {


                const productsFetch = await db.getAllAsync("SELECT * FROM product INNER JOIN product_attributes ON product.product_id = product_attributes.product_id WHERE product_attributes.product_attributes_default = 1 ORDER BY RANDOM()");
                setProducts(productsFetch);


                setIsAppDataFetchError(false);
                setIsAppDataFetchMsg(message);
            } else {
                setIsAppDataFetchError(true);
                setIsAppDataFetchMsg("Local Database error...");
            }
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
        }
    }, [db]);

    useEffect(() => {
        const initialize = async () => {
            if (!db) {
                try {
                    const database = await connectToDatabase();
                    setDb(database);
                } catch (error) {
                    console.error("Error during initialization:", error);
                }
            }
        };
        initialize();
    }, [db]);

    if (isAppDataFetchLoading) {
        return (<SafeAreaView style={styles.container}>
            <ContentLoader
                active={true}
                loading={true}
                pRows={5}
                pHeight={[70, 100, 50, 70, 160, 77]}
                pWidth={[100, 300, 70, 200, 300, 300]}
            />
        </SafeAreaView>);
    } else if (isAppDataFetchError) {
        return (<SafeAreaView style={styles.container}>
            <Heading style={styles.errorText} size="sm" fontWeight="bold">
                <Text>{appDataFetchMsg}</Text>
            </Heading>
        </SafeAreaView>);
    } else {
        return (<SafeAreaView style={styles.container}>
            <SearchBarInput
                setIsTyping={setIsTyping}
                setIsSearchButton={setIsSearchButton}
                setSearchButtonPressed={setSearchButtonPressed}
                setSearchText={setSearchText}
                props={props}
                data={"ddd"}
                goBack={navigateBack}
            />
            {isTyping && searchText.length > 0 ? (
                    <SearchSuggestions db={db} searchText={searchText} setIsSearchButton={setIsSearchButton}
                                       setIsTyping={setIsTyping} setSearchSuggestionitemId={setSearchSuggestionItemId}
                                       setSearchSuggestionItemName={setSearchSuggestionItemName}
                                       setSearchSuggestionType={setSearchSuggestionType}/>)
                : isSearchButton && searchText.length > 0 ? (

                <SearchResults db={db} isSearchButtonPressed={isSearchButtonPressed} searchText={searchText}
                              searchSuggestionItemId={searchSuggestionItemId}
                              searchSuggestionItemName={searchSuggestionItemName} setSearchText={setSearchText}
                              searchSuggestionType={searchSuggestionType}/>)
    :
        (<SearchHistory/>)
    }
    </SafeAreaView>)
        ;
    }
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff", flex: 1,
    }

});
export default SearchScreen;
