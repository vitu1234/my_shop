import React from "react";
import type {
    StyleProp,
    ViewStyle,
    ImageURISource,
    ImageSourcePropType,
} from "react-native";
import {
    StyleSheet,
    View,
    ActivityIndicator,
    Text,
} from "react-native";
import { Image } from 'expo-image';

interface Props {
    style?: StyleProp<ViewStyle>
    index?: number
    showIndex?: boolean
    img?: ImageSourcePropType
}

export const SBImageItem: React.FC<Props> = ({
                                                 style,
                                                 index: _index,
                                                 showIndex = true,
                                                 img
                                             }) => {
    const index = _index ?? 0;


    return (
        <View style={[styles.container]}>
            <ActivityIndicator size="small" />
            <Image contentFit="contain"  cachePolicy={'memory-disk'} key={index} style={styles.image} source={img ?? source} />
            {
                showIndex && <Text
                    style={{
                        position: "absolute",
                        color: "#6E6E6E",
                        fontSize: 40,
                        backgroundColor: "#fff",
                        borderRadius: 5,
                        overflow: "hidden",
                        paddingHorizontal: 10,
                        paddingTop: 2,
                    }}
                >
                    {index}
                </Text>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
        borderRadius: 8,
        overflow: "hidden",

    },
    image: {
        width: "90%",  // Adjusts the width to prevent cropping
        height: "90%",  // Ad
        position: "absolute",
        transform: [{ scale: 0.9 }],
        borderRadius: 10
    },
});
