import React, {useContext} from "react";
import {AppContext} from "../../app_contexts/AppContext";
import {Dimensions, StyleSheet, TouchableOpacity} from "react-native";
import {
    Button,
    Heading, HStack, Icon, Image,
    Input, Link,
    Pressable,
    ScrollView,
    Stack,
    Text, useToast,
    View,
} from "native-base";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import ToastComponent from "../components/ToastComponent";
import {registerVerifyCodeUserAccount} from "../../config/API";

const windowHeight = Dimensions.get("window").height;

function SignUpVerifyAccount(props) {
    const toast = useToast();


    const user = props.route.params.user;
    const [isLoading, setIsLoading] = React.useState(false);
    const [isDisabled, setIsDisabled] = React.useState(false);
    const [code, setCode] = React.useState("");
    const user_data = user.email === "" ? user.phone : user.email + '/' + user.phone;

    const resendVerificationCode = () => {
        setIsDisabled(true)
        setIsLoading(true)
    }

    //verify user provided code
    const verifyUserCode = () => {
        setIsLoading(true);

        if (code === "") {
            const ToastDetails = {
                id: 14,
                title: "Required Field",
                variant: "left-accent",
                description: "Verification code is required",
                isClosable: false,
                status: "error",
                duration: 1000,
            };
            toast.show({
                render: () => {
                    return <ToastComponent {...ToastDetails} />;
                },
            });
        }

        const data = {
            code: code,
            email: user.email,
            phone: user.phone,
            setIsVerifyAccountError: setIsVerifyAccountError
        };
        const response = registerVerifyCodeUserAccount(data);
        // console.log(response);

    };

    const setIsVerifyAccountError = (isError, message) => {
        setIsLoading(false);
        if (isError) {
            const ToastDetails = {
                id: 14,
                title: "Verification Failed",
                variant: "left-accent",
                description: message,
                isClosable: false,
                status: "error",
                duration: 1000,
            };
            toast.show({
                render: () => {
                    return <ToastComponent {...ToastDetails} />;
                },
            });
        } else {
            const ToastDetails = {
                id: 14,
                title: "Account Verified",
                variant: "left-accent",
                description: message,
                isClosable: false,
                status: "success",
                duration: 1000,
            };
            toast.show({
                render: () => {
                    return <ToastComponent {...ToastDetails} />;
                },
            });
            setCode("")
            goToHome();
        }
    };

    //login user and go to homescreen
    const goToHome = () => {
        props.navigation.navigate("Drawer");
    }


    return (
        <ScrollView showsVerticalScrollIndicator={false} h={windowHeight - 80} _contentContainerStyle={{}}>
            <View style={styles.mainContainer}>
                <View style={styles.topContainer}>
                    <Heading style={styles.textSubTitle} size="lg">Confirm Your Account</Heading>
                    <Text style={styles.textTitle}>Please enter the verification code which was sent to
                        <Text style={{fontWeight: "bold"}}> {user_data}</Text>
                    </Text>
                </View>

                <View style={{alignSelf: "center"}}>
                    <Stack space={4} w="100%" alignItems="center">

                        <Input type={"number"}
                               w={{
                                   base: "100%",
                                   md: "25%",
                               }}

                               value={code}
                               onChangeText={(code) => setCode(code)}

                               InputLeftElement={<MaterialIcons style={{marginStart: 15}} name="verified-user"
                                                                size={18} ml="2" color="#000"/>}
                               placeholder="4 digit code"/>

                    </Stack>

                    <View style={{marginTop: 20}}>
                        <Button
                            onPress={verifyUserCode}
                            isDisabled={isDisabled} style={styles.btn}
                            size={"lg"}
                            _text={{
                                color: "#fff",
                            }}>
                            Verify
                        </Button>

                    </View>


                    <View style={{marginTop: 25, marginBottom: 10, alignItems: "center"}}>
                        <Button
                            style={{width: "70%"}}
                            variant="subtle"
                            colorScheme="dark"
                            leftIcon={<Icon as={Ionicons} color="#fff" name="reload" size={"sm"}/>}
                            isDisabled={isDisabled} isLoading={isLoading} isLoadingText="Verifying..."
                            onPress={resendVerificationCode}
                            size={"sm"}
                            _text={{
                                color: "#fff",
                            }}>
                            Resend Verification Code
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
