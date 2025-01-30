import React, {useContext, useEffect} from "react";
import {AppContext} from "@/app_contexts/AppContext";
import {Dimensions, Linking, ScrollView, StyleSheet, ToastAndroid, View} from "react-native";


import {Center} from "@/components/ui/center"
import {Box} from "@/components/ui/box"
import {Checkbox} from "@/components/ui/checkbox"
import {Button} from "@/components/ui/button"
import {HStack} from "@/components/ui/hstack"
import {VStack} from "@/components/ui/vstack"
import {Text} from "@/components/ui/text"
import {Image} from "@/components/ui/image"
import {useToast, Toast} from "@/components/ui/toast"
import {Spinner} from "@/components/ui/spinner"
import {Heading} from "@/components/ui/heading"
import {Input} from "@/components/ui/input"
import {Link} from "@/components/ui/link"
import {Pressable} from "@/components/ui/pressable"


import AntDesign from "react-native-vector-icons/AntDesign";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import Feather from "react-native-vector-icons/Feather";

import ToastComponent from "../components/ToastComponent";
import {registerUserAccount} from "../../config/API";
import {db} from "../../config/sqlite_db_service";

const {width} = Dimensions.get("window");
const windowHeight = Dimensions.get("window").height;

function SignUpScreen(props) {
    const [isLoggedIn, setLoggedInStatus] = useContext(AppContext);
    const [show, setShow] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isDisabled, setIsDisabled] = React.useState(true);

    // const [isSignUpError, setIsSignUpError] = React.useState(false);
    const toast = useToast();

    const [first_name, setFirstName] = React.useState("");
    const [last_name, setLastName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirm_password, setConfirmPassword] = React.useState("");
    const [conditions_check, setConditionsCheck] = React.useState(false);

    const SignUpUser = () => {
        setIsLoading(true);

        if (first_name === "") {
            const ToastDetails = {
                id: 14,
                title: "Required Field",
                variant: "left-accent",
                description: "First name is required",
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

        if (last_name === "") {
            const ToastDetails = {
                id: 14,
                title: "Required Field",
                variant: "left-accent",
                description: "Last name is required",
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

        if (phone === "") {
            const ToastDetails = {
                id: 14,
                title: "Required Field",
                variant: "left-accent",
                description: "Phone is required",
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

        if (password === "") {
            const ToastDetails = {
                id: 14,
                title: "Required Field",
                variant: "left-accent",
                description: "Password is required",
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

        if (confirm_password === "") {
            const ToastDetails = {
                id: 14,
                title: "Required Field",
                variant: "left-accent",
                description: "Confirm password is required",
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

        if (conditions_check === false) {
            const ToastDetails = {
                id: 14,
                title: "Agree to Terms",
                variant: "left-accent",
                description: "Please agree to our terms and conditions",
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

        if (password !== confirm_password) {
            const ToastDetails = {
                id: 14,
                title: "Check Password",
                variant: "left-accent",
                description: "Provided passwords do not match, please check your input",
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
            first_name: first_name,
            last_name: last_name,
            email: email,
            phone: phone,
            password: password,
            setIsSignUpError: setIsSignUpError
        };
        const response = registerUserAccount(data);
        // console.log(response);

    };

    const setIsSignUpError = (isError, message) => {
        setIsLoading(false);
        if (isError) {
            const ToastDetails = {
                id: 14,
                title: "Sign Up Failed",
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
                title: "Account Created",
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
            const userData = {email: email, phone: phone}
            setFirstName("")
            setLastName("")
            setEmail("")
            setPhone("")
            setPassword("")
            setConfirmPassword("")
            setConditionsCheck(false)
            props.navigation.navigate("SignUpVerifyAccount", {user: userData});
        }
    };
    const goToLogin = () => {
        props.navigation.navigate("Login");
    }

    useEffect(() => {
        setIsLoading(false);
        if (first_name !== "" && last_name !== "" && phone !== "" && password !== "" && confirm_password !== "" && conditions_check) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }

    }, [conditions_check, first_name, last_name, phone, password, confirm_password]);

    return (
        <ScrollView showsVerticalScrollIndicator={false} h={windowHeight - 80} _contentContainerStyle={{}}>
            <View style={styles.mainContainer}>
                <View style={styles.topContainer}>
                    <Text style={styles.textTitle}>Hey there,</Text>
                    <Heading style={styles.textSubTitle} size="lg">Create an Account</Heading>
                </View>

                <View style={{alignSelf: "center"}}>
                    <VStack space={4} w="100%" alignItems="center">

                        <Input
                            returnKeyType="next"
                            type={"text"}
                            value={first_name}
                            onChangeText={(first_name) => setFirstName(first_name)}
                            w={{
                                base: "100%",
                                md: "25%",
                            }}
                            InputLeftElement={<SimpleLineIcons style={{marginStart: 15}} name="user"
                                                               size={18} ml="2" color="#000"/>}
                            placeholder="First Name"/>

                        <Input
                            returnKeyType="next"
                            type={"text"}
                            value={last_name}
                            onChangeText={(last_name) => setLastName(last_name)}
                            w={{
                                base: "100%",
                                md: "25%",
                            }}
                            InputLeftElement={<SimpleLineIcons style={{marginStart: 15}} name="user"
                                                               size={18} ml="2" color="#000"/>}
                            placeholder="Last Name"/>

                        <Input
                            returnKeyType="next"
                            type={"text"}
                            value={phone}
                            onChangeText={(phone) => setPhone(phone)}
                            w={{
                                base: "100%",
                                md: "25%",
                            }}
                            InputLeftElement={<SimpleLineIcons style={{marginStart: 15}} name="phone"
                                                               size={18} ml="2" color="#000"/>}
                            placeholder="Phone"/>

                        <Input
                            value={email}
                            onChangeText={(email) => setEmail(email)}
                            type={"email"}
                            w={{
                                base: "100%",
                                md: "25%",
                            }}
                            InputLeftElement={<SimpleLineIcons style={{marginStart: 15}} name="envelope"
                                                               size={18} ml="2" color="#000"/>}
                            placeholder="Email (optional)"/>

                        <Input
                            value={password}
                            onChangeText={(password) => setPassword(password)}
                            w={{
                                base: "100%",
                                md: "25%",
                            }}
                            type={show ? "text" : "password"}
                            InputLeftElement={<AntDesign style={{marginStart: 15}} name="lock1"
                                                         size={18} ml="2" color="#000"/>}
                            placeholder="Password"

                            InputRightElement={
                                <Pressable onPress={() => setShow(!show)}>
                                    <Feather style={{marginEnd: 10, padding: 6}} name={show ? "eye" : "eye-off"}
                                             size={18} mr="2" color="#000"/>
                                </Pressable>
                            }

                        />

                        <Input
                            value={confirm_password}
                            onChangeText={(confirm_password) => setConfirmPassword(confirm_password)}
                            w={{
                                base: "100%",
                                md: "25%",
                            }}
                            type={show ? "text" : "password"}
                            InputLeftElement={<AntDesign style={{marginStart: 15}} name="lock1"
                                                         size={18} ml="2" color="#000"/>}
                            placeholder="Confirm Password"

                            InputRightElement={
                                <Pressable onPress={() => setShow(!show)}>
                                    <Feather style={{marginEnd: 10, padding: 6}} name={show ? "eye" : "eye-off"}
                                             size={18} mr="2" color="#000"/>
                                </Pressable>
                            }

                        />

                    </VStack>

                    <View style={{marginTop: 20}}>


                        <Box width="99%">
                            <Checkbox
                                isChecked={conditions_check}
                                onChange={() => {
                                    conditions_check ? setConditionsCheck(false) : setConditionsCheck(true);
                                }}
                                _text={{
                                    fontSize: "md",
                                    fontWeight: 700,
                                    _light: {
                                        color: "grey",
                                    },
                                    color: "grey",
                                }} shadow={2} value="agree" accessibilityLabel="Terms and conditions checkbox">
                                <Text style={{color: "grey"}}>By creating an account, you agree to our
                                    <Text style={{color: "rgba(255,255,255,0)"}}>
                                        a</Text>

                                    <Text
                                        style={{
                                            color: "grey",
                                            textDecorationLine: "underline",
                                            textDecorationColor: "grey"
                                        }}
                                        onPress={() => {
                                            Linking.openURL("http://www.example.com/").then(r => console.log("HAHA"));
                                        }}
                                    >
                                        Conditions of Use
                                    </Text>

                                    <Text style={{color: "rgba(255,255,255,0)"}}>
                                        a</Text>
                                    and
                                    <Text style={{color: "rgba(255,255,255,0)"}}>
                                        a</Text>
                                    <Text
                                        style={{
                                            color: "grey",
                                            textDecorationLine: "underline",
                                            textDecorationColor: "grey"
                                        }}
                                        onPress={() => {
                                            Linking.openURL("http://www.example.com/").then(r => console.log("HAHA"));
                                        }}
                                    >
                                        Privacy Notice
                                    </Text>
                                </Text>
                            </Checkbox>
                        </Box>

                    </View>

                    <View style={{marginTop: 20}}>
                        <Button isDisabled={isDisabled} isLoading={isLoading} isLoadingText="Registering..."
                                onPress={SignUpUser}
                                style={styles.btn}
                                size={"lg"}
                                _text={{
                                    color: "#fff",
                                }}>
                            Register
                        </Button>

                    </View>

                    <View style={{marginTop: 10}}>

                        <HStack style={{alignSelf: "center"}}>
                            <Text fontSize={"md"} mr={2}>Already have an account?</Text>
                            <Link
                                onPress={goToLogin}
                                _text={{
                                    fontSize: "md",
                                    fontWeight: 700,
                                    _light: {
                                        color: "black",
                                    },
                                    color: "black",
                                }}>
                                Login
                            </Link>
                        </HStack>


                        <Image

                            alt={"Logo"}
                            style={styles.logo}
                            source={require("@/assets/app_rs/my_shop_logo.png")}
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
        // alignSelf: "center",
    },
    topContainer: {
        alignSelf: "center",
        marginTop: 20,
        marginBottom: 10,
        // backgroundColor:"red",
        width: "100%",

    },
    textTitle: {
        padding: 7,
        color: "#424242",
        textAlign: "center",
        fontSize: 18,
    },
    textSubTitle: {
        color: "black",
        marginBottom: 8,
        padding: 5,
        textAlign: "center",
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
export default SignUpScreen;
