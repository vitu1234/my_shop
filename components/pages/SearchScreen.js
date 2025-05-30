import React, { useCallback, useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { SearchBarInput } from "@/components/pages/components/search/SearchBarInput";
import SearchHistory from "@/components/pages/components/search/SearchHistory";
import SearchResults from "@/components/pages/components/search/SearchResults";
import SearchSuggestions from "@/components/pages/components/search/SearchSuggestions";
import { connectToDatabase } from "@/components/config/sqlite_db_service";
import { Toast } from "@/components/ui/toast";
import ContentLoader from "react-native-easy-content-loader";
import { Heading } from "@/components/ui/heading";

import { SQLiteProvider, useSQLiteContext, SQLiteDatabase } from 'expo-sqlite';
import { SearchInputTextContext } from "@/app_contexts/AppContext";

const SearchScreen = (props) => {
    const db = useSQLiteContext();
    const [isTyping, setIsTyping] = React.useState(false);
    const [isSearchButton, setIsSearchButton] = React.useState(false);
    const [isSearchButtonPressed, setSearchButtonPressed] = React.useState(false);
    // const [searchText, setSearchText] = useContext(SearchInputTextContext);
    // const [searchSuggestionType, setSearchSuggestionType] = React.useState('');
    // const [searchSuggestionItemId, setSearchSuggestionItemId] = React.useState(-1);
    // const [searchSuggestionItemName, setSearchSuggestionItemName] = React.useState('');

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

    const [products, setProducts] = useState([]);

    const [isAppDataFetchLoading, setIsAppDataFetchLoading] = useState(true);
    const [isAppDataFetchError, setIsAppDataFetchError] = useState(false);
    const [appDataFetchMsg, setIsAppDataFetchMsg] = useState("");

    const navigateBack = () => {
        setSearchText("")
        setSearchSuggestionType("")
        setSearchSuggestionItemId(-1)
        setSearchSuggestionItemName("")
        props.navigation.goBack();
    }




    // useEffect(() => {
    //     if (!isSearchButtonPressed) {
    //         setSearchText(searchSuggestionItemName)
    //     }
    // }, [searchSuggestionItemName, searchText]);



    useEffect(() => {
        // Example to mimic data fetching setup
        setIsAppDataFetchError(false);
        setIsAppDataFetchLoading(false);
    }, []);

    useEffect(() => {
        if (!isSearchButtonPressed && searchSuggestionItemName) {
            setSearchText(searchSuggestionItemName);
        }
    }, [searchSuggestionItemName, isSearchButtonPressed]);


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
                
                
                props={props}
                data={"ddd"}
                goBack={navigateBack}
            />
            {isTyping && searchText.length > 0 ? (
                <SearchSuggestions db={db} 
                    setIsSearchButton={setIsSearchButton}
                    setIsTyping={setIsTyping} 
                    
                     navigation={props.navigation} />)
                : isSearchButton && searchText.length > 0 ? (

                    <SearchResults db={db} isSearchButtonPressed={isSearchButtonPressed} 
                        
                        
                        navigation={props.navigation} />)
                    :
                    (<SearchHistory />)
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
