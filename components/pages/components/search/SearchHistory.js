import React from 'react';
import {ScrollView, StyleSheet, Text, View} from "react-native";

const SearchHistory = () => {
    return (
        <ScrollView contentContainerStyle={styles.contentContainer}>
            {/* Your main content goes here */}
            <Text>Search history will appear here...</Text>
        </ScrollView>
    );
};
const styles = StyleSheet.create({

    contentContainer: {
        padding: 10,
    },
});
export default SearchHistory;
