import React, {useEffect, useState, useContext} from 'react';
import {View, TextInput, Text, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import {ChevronLeft} from 'lucide-react-native';
import { SearchInputTextContext } from "@/app_contexts/AppContext";

export const SearchBarInput = (props) => {
    console.log('SearchInputTextContext values:', {
        searchText,
        setSearchText,
        searchSuggestionType,
        setSearchSuggestionType,
        searchSuggestionItemId,
        setSearchSuggestionItemId,
        searchSuggestionItemName,
        setSearchSuggestionItemName,
    });


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

    const onChangeSearchString = (text) => {
        setSearchText(text);
        props.setIsTyping(true);
        props.setSearchButtonPressed(false);
        console.log("SET TEXT: "+ text)
    };

    const onSubmitSearchString = (event) => {
        // console.log("hehehe");
        // console.log(props)c
        props.setIsTyping(false)
        props.setIsSearchButton(true)
        props.setSearchButtonPressed(true)
    };

    useEffect(() => {
        setSearchText(searchText);
    }, [searchText]);


    return (<View style={styles.searchBarContainer}>
        <TouchableOpacity style={styles.chevronIcon} onPress={props.goBack}>
            <ChevronLeft size={35}/>
        </TouchableOpacity>
        <SafeAreaView style={styles.inputContainer}>
            <TextInput

                value={searchText}
                onChangeText={onChangeSearchString}
                onSubmitEditing={onSubmitSearchString}

                clearButtonMode={'while-editing'}
                enterKeyHint={"search"}
                autoFocus={true}
                style={styles.searchBar}
                placeholder="Search..."
            />
        </SafeAreaView>
        <TouchableOpacity onPress={props.goBack}>
            <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
    </View>);
}

const styles = StyleSheet.create({
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    }, chevronIcon: {
        marginRight: 10,
    }, inputContainer: {
        flex: 1, marginRight: 10,
    }, searchBar: {
        height: 40, borderColor: '#ddd', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10,
    }, cancelText: {
        color: '#ff0000',
    },
});
