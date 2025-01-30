import React from 'react';
import {ScrollView, StyleSheet, Text, View} from "react-native";

const SearchHistory = () => {
    return (
        <ScrollView contentContainerStyle={styles.contentContainer}>
            {/* Your main content goes here */}
            <Text>Search History</Text>
        </ScrollView>
    );
};
const styles = StyleSheet.create({

    contentContainer: {
        padding: 10,
    },
});
export default SearchHistory;
