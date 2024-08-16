import React, {useState} from 'react';
import ActionSheet, {SheetManager} from 'react-native-actions-sheet';
import {View, Text, TouchableOpacity, StyleSheet} from "react-native";

const SortActionSheet = (props) => {

    const logObject = props.payload;

    // Determine the initial sorting option
    let initialSortingOption = 'our_ranking'; // default value
    if (logObject && logObject.initialSortingOption) {
        initialSortingOption = logObject.initialSortingOption;
    }

    // State hook for selected option
    const [selectedOption, setSelectedOption] = useState(initialSortingOption);

    const options = [
        {label: 'Our ranking', value: 'our_ranking'},
        {label: 'High to low price', value: 'high_first'},
        {label: 'Low to high price', value: 'low_first'},
        {label: 'By sales volume', value: 'volume'},
        {label: 'Latest', value: 'latest'},
        {label: 'Rating', value: 'rating'}
    ];

    function selectAndClose(value) {
        setSelectedOption(value);
        setTimeout(() => {
            SheetManager.hide(props.sheetId, {
                payload: {'selected_sorting': value}
            });
        }, 600);
    }

    return (
        <ActionSheet
            payload={{'selected_sorting': selectedOption}}
            gestureEnabled={true}
            indicatorStyle={{width: 100}}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Sorting</Text>
                <View style={styles.radioContainer}>
                    {options.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            style={styles.radioOption}
                            onPress={() => selectAndClose(option.value)}
                        >
                            <View
                                style={[styles.radioButton, selectedOption === option.value && styles.radioButtonSelected]}
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
    container: {
        paddingHorizontal: 16,
        height: 250,
    },
    title: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    radioContainer: {
        alignItems: 'flex-start',
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    radioButton: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#707070',
        marginRight: 8,
    },
    radioButtonSelected: {
        backgroundColor: '#2780e3',
        borderColor: '#fff',
    },
    radioLabel: {
        marginStart: 10,
        fontSize: 16,
        color: '#000',
    },
});

export default SortActionSheet;
