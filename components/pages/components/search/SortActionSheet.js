import React, {useState} from 'react';
import ActionSheet from 'react-native-actions-sheet';
import {View, Text, TouchableOpacity, StyleSheet} from "react-native";


const SortActionSheet = () => {
    const [selectedOption, setSelectedOption] = useState('our_ranking');

    const options = [
        {label: 'Our ranking', value: 'our_ranking'},
        {label: 'High to low price', value: 'high_first'},
        {label: 'Low to high price', value: 'low_first'},
        {label: 'By sales volume ', value: 'volume'},
        {label: 'Latest', value: 'latest'},
        {label: 'Rating', value: 'rating'}
    ];

    return (
        <ActionSheet
            gestureEnabled={true}
            indicatorStyle={{
                width: 100,
            }}>
            <View
                style={{
                    paddingHorizontal: 16,
                    height: 250,
                    // alignItems: 'center',
                    // justifyContent: 'center',
                }}>
                <Text
                    style={{
                        color: 'black',
                        fontSize: 18,
                        fontWeight: 'bold',
                        textAlign: 'center',
                    }}>
                    Sorting
                </Text>
                <View style={styles.radioContainer}>
                    {options.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            style={styles.radioOption}
                            onPress={() => setSelectedOption(option.value)}
                        >
                            <View
                                style={[
                                    styles.radioButton,
                                    selectedOption === option.value && styles.radioButtonSelected,
                                ]}
                            />
                            <Text style={styles.radioLabel}>{option.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ActionSheet>
    );
};
const styles = StyleSheet.create({
    radioContainer: {
        alignItems: 'flex-start', // Align options to the left
    },
    radioOption: {
        flexDirection: 'row', // Arrange radio button and label horizontally
        alignItems: 'center', // Vertically center items
        marginVertical: 8, // Add space between radio options
    },
    radioButton: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#707070',
        marginRight: 8, // Space between radio button and label
    },
    radioButtonSelected: {
        backgroundColor: '#2780e3', // Fill the selected radio button
        borderColor: '#fff'
    },
    radioLabel: {
        marginStart: 10,
        fontSize: 16,
        color: '#000',
    },
});
export default SortActionSheet;
