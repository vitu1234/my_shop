import React, { useCallback, useEffect, useState } from 'react';
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


const SearchScreen = (props) => {
    const db = useSQLiteContext();
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


    useEffect(() => {
        // fetchData();
        setIsAppDataFetchError(false);
        setIsAppDataFetchLoading(false);
    });

    useEffect(() => {
        if (!isSearchButtonPressed) {
            setSearchText(searchSuggestionItemName)
        }
    }, [searchSuggestionItemName]);


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
                searchText={searchText}
                props={props}
                data={"ddd"}
                goBack={navigateBack}
            />
            {isTyping && searchText.length > 0 ? (
                <SearchSuggestions db={db} searchText={searchText} setSearchText={setSearchText}
                    setIsSearchButton={setIsSearchButton}
                    setIsTyping={setIsTyping} setSearchSuggestionitemId={setSearchSuggestionItemId}
                    setSearchSuggestionItemName={setSearchSuggestionItemName}
                    setSearchSuggestionType={setSearchSuggestionType} navigation={props.navigation} />)
                : isSearchButton && searchText.length > 0 ? (

                    <SearchResults db={db} isSearchButtonPressed={isSearchButtonPressed} searchText={searchText}
                        searchSuggestionItemId={searchSuggestionItemId}
                        searchSuggestionItemName={searchSuggestionItemName} setSearchText={setSearchText}
                        searchSuggestionType={searchSuggestionType} navigation={props.navigation} />)
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
