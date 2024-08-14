import React, {useState} from 'react';
import {View, TextInput, Text, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import {ChevronLeft} from 'lucide-react-native';

export const SearchBarInput = (props) => {

    const [searchString, setSearchString] = useState('');
    const onChangeSearchString = (event) => {
        const {text} = event.nativeEvent;
        setSearchString(text);
        props.setSearchText(text);
        props.setIsTyping(true)
    };

    const onSubmitSearchString = (event) => {
        console.log("hehehe");
        props.setIsTyping(false)
        props.setIsSearchButton(true)
    };


    return (<View style={styles.searchBarContainer}>
        <TouchableOpacity style={styles.chevronIcon} onPress={props.goBack}>
            <ChevronLeft size={35}/>
        </TouchableOpacity>
        <SafeAreaView style={styles.inputContainer}>
            <TextInput

                value={searchString}
                onChange={onChangeSearchString}
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
