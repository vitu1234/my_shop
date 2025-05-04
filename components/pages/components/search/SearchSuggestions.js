import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { SearchInputTextContext } from "@/app_contexts/AppContext";
import { getSearchSuggestions } from '@/components/config/API';

const SearchSuggestions = (props) => {
    const [fetchSuggestionsError, setFetchSuggestionsError] = useState("");
    const [results, setResults] = useState([]);

    const db = useSQLiteContext();

    const {
        searchText,
        setSearchText,
        setSearchSuggestionType,
        setSearchSuggestionItemId,
        setSearchSuggestionItemName,
    } = useContext(SearchInputTextContext);

    useEffect(() => {
        if (searchText) {
            fetchSuggestions();
        }
    }, [searchText]);

    const fetchSuggestions = async () => {
        setFetchSuggestionsError("");
        try {
            await getSearchSuggestions({ productsSearchSuggestionsLoading, searchText });
        } catch (error) {
            console.error("Error fetching results:", error);
            setFetchSuggestionsError("Failed to fetch suggestions.");
        }
    };

    const productsSearchSuggestionsLoading = (isFetchingDataError, message, fetchedResults) => {
        if (isFetchingDataError) {
            setFetchSuggestionsError(message || "Error fetching suggestions.");
        } else if (!fetchedResults || fetchedResults.length === 0) {
            setResults([]);
            setFetchSuggestionsError("No Matching Results Found.");
        } else {
            setResults(fetchedResults);
        }
    };

    const searchTheItem = (itemId, itemName, resultType) => {
        props.setIsSearchButton(true);
        props.setIsTyping(false);
        setSearchSuggestionItemId(itemId);
        setSearchSuggestionItemName(itemName);
        setSearchSuggestionType(resultType);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => {
            setSearchText(item.name); // updates the shared context
            searchTheItem(item.id, item.name, item.result_type);
        }}>
            <View style={styles.itemContainer}>
                <Text numberOfLines={1} style={styles.itemTitle}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.contentContainer}>
            {fetchSuggestionsError.length > 0 && (
                <Text style={styles.errorText}>{fetchSuggestionsError}</Text>
            )}
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
        padding: 16,
    },
    itemContainer: {
        padding: 16,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: 'rgba(129,129,129,0.24)',
    },
    itemTitle: {
        fontWeight: 'bold',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default SearchSuggestions;
