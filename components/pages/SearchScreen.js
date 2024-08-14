import React from 'react';
import {View, Text, StyleSheet, SafeAreaView, ScrollView} from "react-native";
import {SearchBarInput} from "@/components/pages/components/search/SearchBarInput";
import SearchHistory from "@/components/pages/components/search/SearchHistory";
import SearchResults from "@/components/pages/components/search/SearchResults";
import SearchSuggestions from "@/components/pages/components/search/SearchSuggestions";

const SearchScreen = (props) => {

    const [isTyping, setIsTyping] = React.useState(false);
    const [isSearchButton, setIsSearchButton] = React.useState(false);
    const [searchText, setSearchText] = React.useState('');

    const navigateBack = () => {
        props.navigation.goBack();
    }

    return (

        <SafeAreaView style={styles.container}>
            <SearchBarInput
                setIsTyping={setIsTyping}
                setIsSearchButton={setIsSearchButton}
                setSearchText={setSearchText}
                props={props}
                data={"ddd"}
                goBack={navigateBack}
            />
            {
                isTyping && searchText.length > 0 ? (
                    <SearchSuggestions/>
                ) : isSearchButton && searchText.length > 0 ? (
                    <SearchResults searchText={searchText}/>
                ) : (
                    <SearchHistory/>
                )
            }
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flex: 1,
    }

});
export default SearchScreen;
