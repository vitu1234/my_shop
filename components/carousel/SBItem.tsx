import React from "react";
import type {StyleProp, ViewStyle, ViewProps, ImageSourcePropType} from "react-native";
import {LongPressGestureHandler} from "react-native-gesture-handler";
import type {AnimateProps} from "react-native-reanimated";
import Animated from "react-native-reanimated";

import Constants from "expo-constants";

import {SBImageItem} from "./SBImageItem";
import {SBTextItem} from "./SBTextItem";

interface Props extends AnimateProps<ViewProps> {
    style?: StyleProp<ViewStyle>
    index?: number
    pretty?: boolean
    showIndex?: boolean
    img?: ImageSourcePropType
}

export const SBItem: React.FC<Props> = (props) => {
    // console.log("CAROUTSELD TITEM ")
    // console.log(props)

    const {style, showIndex = false, index, pretty, img=true, testID, ...animatedViewProps} = props;
    const enablePretty = Constants?.expoConfig?.extra?.enablePretty || true;
    const [isPretty, setIsPretty] = React.useState(pretty || enablePretty);
    return (
        <LongPressGestureHandler
            onActivated={() => {
                setIsPretty(!isPretty);
            }}
        >
            <Animated.View testID={testID} style={{flex: 1}} {...animatedViewProps}>
                {isPretty || img
                    ? (
                        <SBImageItem
                            style={style}
                            index={typeof index === "number" ? index : 0}  // Ensure `index` is always a number
                            showIndex={typeof index === "number" && showIndex !== undefined ? showIndex : false}  // Default `showIndex` to false if undefined
                            img={props.img_url}
                        />
                    )
                    : (
                        <SBTextItem style={style} index={index}/>
                    )}
            </Animated.View>
        </LongPressGestureHandler>
    );
};
