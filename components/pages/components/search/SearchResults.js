import React, {useState} from 'react';
import {Alert, Button, StyleSheet, Switch, Text, TouchableOpacity, View} from "react-native";
import {Filter, ChevronDown} from "lucide-react-native";
import SortActionSheet from "@/components/pages/components/search/SortActionSheet";
import {SheetManager} from "react-native-actions-sheet";

const SearchResults = (props) => {
    console.log(props)

    if (!props.isSearchButtonPressed) {
        console.log("NOT button press")
        // props.setSearchText(props.searchSuggestionItemName)
    }

    const [sortingOption, setSortingOption] = useState('our_ranking');
    const [isEnabled, setIsEnabled] = useState(false);

    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState)
    };

    const openActionSheetSorting = async () => {

        const selectedSortOption = await SheetManager.show('sort-action-sheet', {
            payload: {
                initialSortingOption: sortingOption
            }
        });

        if (selectedSortOption && selectedSortOption.selected_sorting) {
            setSortingOption(selectedSortOption.selected_sorting);
        }
    };

    return (
        <View style={styles.contentContainer}>
            <View style={styles.topPartContainer}>
                <View style={styles.leftPart}>
                    <Switch
                        style={styles.switchStyle}
                        trackColor={{false: '#767577', true: '#2780e3'}}
                        thumbColor={isEnabled ? '#fff' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                    <Text style={styles.textStyle}>Free Shipping</Text>
                </View>
                <TouchableOpacity
                    style={[styles.buttonContainer, {backgroundColor: '#767577'}]}
                    onPress={openActionSheetSorting}
                >
                    <Text style={{marginTop: 4}}><ChevronDown color={'#fff'} size={18}/></Text>
                    <Text style={[styles.textStyle, {color: '#fff'}]}>
                        Sorting
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={() => Alert.alert('Simple Button pressed')}
                >
                    <Text style={{marginTop: 4}}><Filter color={'#fff'} size={18}/></Text>
                    <Text style={[styles.textStyle, {color: '#fff'}]}>
                        Filters
                    </Text>
                </TouchableOpacity>
            </View>
            <Text>Search results</Text>
            <SortActionSheet/>
        </View>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        padding: 10,
    },
    topPartContainer: {
        flexDirection: 'row', // Arrange children horizontally
        alignItems: 'center', // Center items vertically
        justifyContent: 'space-between', // Pushes the button to the far right
    },
    switchStyle: {
        transform: [{scaleX: 0.9}, {scaleY: 0.8}],
    },
    leftPart: {
        flexDirection: 'row', // Arrange Switch and Text horizontally
        alignItems: 'center', // Center items vertically
    },
    textStyle: {
        fontWeight: 'bold'
    },
    buttonContainer: {
        flexDirection: 'row', // Arrange children horizontally
        alignItems: 'center', // Center items vertically
        justifyContent: 'space-between',
        backgroundColor: '#2780e3',
        padding: 6,
        borderRadius: 5
    },
});

export default SearchResults;
