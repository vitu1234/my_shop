import 'react-native-gesture-handler';

import React from 'react';
import type {Node} from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';

import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import StackNavigator from './navigation/StackNavigator';
import {NativeBaseProvider} from 'native-base';


const App: () => Node = () => {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    return (
        <NativeBaseProvider>

            <StackNavigator/>
        </NativeBaseProvider>
    );
};

const styles = StyleSheet.create({});

export default App;
