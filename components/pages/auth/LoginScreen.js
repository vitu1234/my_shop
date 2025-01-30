import React, {useContext, useEffect} from "react";
import {AppContext} from "@/app_contexts/AppContext";
import {Dimensions, ScrollView, StyleSheet, View} from "react-native";


import {Center} from "@/components/ui/center"
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

import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import ToastComponent from "../components/ToastComponent";
import {userLogin} from "../../config/API";

const {width} = Dimensions.get("window");
const windowHeight = Dimensions.get("window").height;


function LoginScreen(props) {
    const toast = useToast();
    const [isLoggedIn, setLoggedInStatus] = useContext(AppContext);

    const [show, setShow] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isDisabled, setIsDisabled] = React.useState(true);
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");


    const loginUser = () => {
        setIsLoading(true);
        if (email !== "" && password !== "") {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
        let data = ''
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (reg.test(email) === false) {
            data = {
                phone: email,
                password: password,
                setIsLoginError: setIsLoginError
            };
        } else {
            data = {
                email: email,
                password: password,
                setIsLoginError: setIsLoginError
            };
            // console.log("Value is not an email address!");
        }
        const response = userLogin(data);


    }

    const goToForgetPassword = () => {
        props.navigation.navigate("ForgetPassword");
    };

    const goToRegister = () => {
        props.navigation.navigate("SignUp");
    }

    //handle login status
    const setIsLoginError = (isError, message) => {
        setIsLoading(false);

        if (isError) {
            const ToastDetails = {
                id: 14,
                title: "Login Failed",
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
            // setPassword("")
        } else {
            const ToastDetails = {
                id: 14,
                title: "Login Success",
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
            goToHome()
        }
    };

    //login user and go to homescreen
    const goToHome = () => {
        setLoggedInStatus(true)
        props.navigation.navigate("Drawer");
    }

    useEffect(() => {
        setIsLoading(false);
        if (email !== "" && password !== "") {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }

    }, [email, password]);

    return (
        <ScrollView showsVerticalScrollIndicator={false} h={windowHeight - 80} _contentContainerStyle={{}}>
            <View style={styles.mainContainer}>
                <View style={styles.topContainer}>
                    <Text style={styles.textTitle}>Hey there,</Text>
                    <Heading style={styles.textSubTitle} size="lg">Welcome Back</Heading>
                </View>

                <View style={{alignSelf: "center"}}>
                    <VStack space={4} w="100%" alignItems="center">

                        <Input

                            value={email}
                            onChangeText={(email) => setEmail(email)}

                            w={{
                                base: "100%",
                                md: "25%",
                            }}
                            InputLeftElement={<SimpleLineIcons style={{marginStart: 15}} name="envelope"
                                                               size={18} ml="2" color="#000"/>}
                            placeholder="Phone or email"/>

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

                    </VStack>

                    <View style={{marginTop: 10, alignSelf: "center", padding: 5}}>
                        <Link onPress={goToForgetPassword} _text={{
                            fontSize: "md",
                            fontWeight: 700,
                            _light: {
                                color: "grey",
                            },
                            color: "grey",
                        }}>
                            Forgot your password?
                        </Link>
                    </View>

                    <View style={{marginTop: 10}}>
                        <Button
                            isDisabled={isDisabled} isLoading={isLoading} isLoadingText="Checking..."
                            onPress={loginUser} style={styles.btn} size={"lg"}
                            _text={{
                                color: "#fff",
                            }}>
                            Login
                        </Button>

                    </View>

                    <View style={{marginTop: 20}}>


                        <HStack style={{alignSelf: "center"}}>
                            <Text fontSize={"md"} mr={2}>Don't have an account yet?</Text>
                            <Link onPress={goToRegister} _text={{
                                fontSize: "md",
                                fontWeight: 700,
                                _light: {
                                    color: "black",
                                },
                                color: "black",
                            }}>
                                Register
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
        marginTop: 20,
        height: 100,
        width: 300,
        alignSelf: "center",
    },


});
export default LoginScreen;
