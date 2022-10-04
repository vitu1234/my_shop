import React, {useContext} from "react";
import {AppContext} from "../../app_contexts/AppContext";
import {Dimensions, StyleSheet} from "react-native";
import {
    Button,
    Heading, HStack, Image,
    Input, Link,
    Pressable,
    ScrollView,
    Stack,
    Text,
    View,
} from "native-base";
import Icon from "react-native-vector-icons/AntDesign";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import {red} from "react-native-reanimated/lib/types/lib/reanimated2";
import {LinearGradient} from "react-native-svg";

const {width} = Dimensions.get("window");
const windowHeight = Dimensions.get("window").height;

function SignUpVerifyAccount(props) {
    return (
        <ScrollView showsVerticalScrollIndicator={false} h={windowHeight - 80} _contentContainerStyle={{}}>
            <View style={styles.mainContainer}>
                <View style={styles.topContainer}>
                    <Heading style={styles.textSubTitle} size="lg">Confirm Your Account</Heading>
                    <Text style={styles.textTitle}>Please enter the verification code which was sent to your phone or
                        email!</Text>
                    <Text style={styles.textTitle}>We we take care the rest after entering the code!</Text>
                </View>

                <View style={{alignSelf: "center"}}>
                    <Stack space={4} w="100%" alignItems="center">

                        <Input
                            w={{
                                base: "100%",
                                md: "25%",
                            }}
                            InputLeftElement={<SimpleLineIcons style={{marginStart: 15}} name="envelope"
                                                               size={18} ml="2" color="#000"/>}
                            placeholder="Phone or email"/>

                    </Stack>

                    <View style={{marginTop: 20}}>
                        <Button onPress={() => console.log("hahah")} style={styles.btn} size={"lg"}
                                _text={{
                                    color: "#fff",
                                }}>
                            Send Reset Instructions
                        </Button>

                    </View>

                    <View style={{marginTop: 100}}>
                        <Image

                            alt={"Logo"}
                            style={styles.logo}
                            source={require("../../assets/app_rs/my_shop_logo.png")}
                        />

                    </View>

                </View>

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        padding: 16,

    },
    topContainer: {
        alignSelf: "center",
        marginTop: 10,
        marginBottom: 15,
        // backgroundColor:"red",
        width: "100%",

    },
    textTitle: {
        marginTop: 2,
        paddingStart: 7,
        paddingEnd: 7,
        color: "grey",
        textAlign: "left",
        // fontSize: 18,
        fontWeight: "600"
    },
    textSubTitle: {
        color: "black",
        // marginBottom: 8,
        paddingStart: 5,
        paddingEnd: 5,
        textAlign: "left",
        fontWeight: "900",
    },

    btn: {
        width: "100%",
        // paddingLeft: 15,
        // paddingEnd: 15,
        margin: 5,
        alignSelf: "center",
        // backgroundColor: "red",
    },

    gradient: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
    },
    logo: {
        height: 100,
        width: 300,
        alignSelf: "center",
    },


});
export default SignUpVerifyAccount;
