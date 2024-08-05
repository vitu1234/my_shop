import React, {useContext, useEffect} from "react";
import {Dimensions, StyleSheet} from "react-native";

const navibar_profile_styles = StyleSheet.create({
    profileImgContainer: {
        margin: 16,
        height: 30,
        width: 30,
        borderRadius: 40,
        backgroundColor: "#eeeeee",
        overflow: 'hidden'
    },
    profileImg: {
        height: "100%",
        width: "100%",
        borderRadius: 40,
        // alignSelf: "center",
        resizeMode: "center",
    },
});
export {
    navibar_profile_styles
};