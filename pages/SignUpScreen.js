import React, { useContext } from "react";
import { AppContext } from "../app_contexts/AppContext";
import { Dimensions, Linking, StyleSheet } from "react-native";
import {
  Box,
  Button,
  Checkbox,
  Heading,
  HStack,
  Image,
  Input,
  Link,
  Pressable,
  ScrollView,
  Stack,
  Text,
  View,
  useToast,
  Alert,
} from "native-base";
import AntDesign from "react-native-vector-icons/AntDesign";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import Feather from "react-native-vector-icons/Feather";

import ToastComponent from "./components/ToastComponent";

const { width } = Dimensions.get("window");
const windowHeight = Dimensions.get("window").height;

function SignUpScreen(props) {
  const [isLoggedIn, setLoggedInStatus] = useContext(AppContext);
  const [show, setShow] = React.useState(false);
  const toast = useToast();

  const SignUpUser = () => {
    const ToastDetails = {
      id: 14,
      title: "Network connection restored",
      variant: "left-accent",
      description: "This is to inform you that your network connectivity is restored",
      isClosable: false,
      status: "error",
      duration: 1000,
    };

    toast.show({
      render: () => {
        return <ToastComponent {...ToastDetails} />;
      },
    });

    // toast.show({
    //       render: ({
    //                  id,
    //                }) => {
    //         return <ToastAlert id={id} {...item} />;
    //       },
    //     })
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} h={windowHeight - 80} _contentContainerStyle={{}}>
      <View style={styles.mainContainer}>
        <View style={styles.topContainer}>
          <Text style={styles.textTitle}>Hey there,</Text>
          <Heading style={styles.textSubTitle} size="lg">Create an Account</Heading>
        </View>

        <View style={{ alignSelf: "center" }}>
          <Stack space={4} w="100%" alignItems="center">

            <Input
              w={{
                base: "100%",
                md: "25%",
              }}
              InputLeftElement={<SimpleLineIcons style={{ marginStart: 15 }} name="user"
                                                 size={18} ml="2" color="#000" />}
              placeholder="First Name" />

            <Input
              w={{
                base: "100%",
                md: "25%",
              }}
              InputLeftElement={<SimpleLineIcons style={{ marginStart: 15 }} name="user"
                                                 size={18} ml="2" color="#000" />}
              placeholder="Last Name" />

            <Input
              w={{
                base: "100%",
                md: "25%",
              }}
              InputLeftElement={<SimpleLineIcons style={{ marginStart: 15 }} name="phone"
                                                 size={18} ml="2" color="#000" />}
              placeholder="Phone" />

            <Input
              w={{
                base: "100%",
                md: "25%",
              }}
              InputLeftElement={<SimpleLineIcons style={{ marginStart: 15 }} name="envelope"
                                                 size={18} ml="2" color="#000" />}
              placeholder="Email" />

            <Input

              w={{
                base: "100%",
                md: "25%",
              }}
              type={show ? "text" : "password"}
              InputLeftElement={<AntDesign style={{ marginStart: 15 }} name="lock1"
                                           size={18} ml="2" color="#000" />}
              placeholder="Password"

              InputRightElement={
                <Pressable onPress={() => setShow(!show)}>
                  <Feather style={{ marginEnd: 10, padding: 6 }} name={show ? "eye" : "eye-off"}
                           size={18} mr="2" color="#000" />
                </Pressable>
              }

            />

            <Input

              w={{
                base: "100%",
                md: "25%",
              }}
              type={show ? "text" : "password"}
              InputLeftElement={<AntDesign style={{ marginStart: 15 }} name="lock1"
                                           size={18} ml="2" color="#000" />}
              placeholder="Confirm Password"

              InputRightElement={
                <Pressable onPress={() => setShow(!show)}>
                  <Feather style={{ marginEnd: 10, padding: 6 }} name={show ? "eye" : "eye-off"}
                           size={18} mr="2" color="#000" />
                </Pressable>
              }

            />

          </Stack>

          <View style={{ marginTop: 20 }}>


            <Box width="99%">
              <Checkbox _text={{
                fontSize: "md",
                fontWeight: 700,
                _light: {
                  color: "grey",
                },
                color: "grey",
              }} shadow={2} value="agree" accessibilityLabel="Terms and conditions checkbox">
                <Text style={{ color: "grey" }}>By creating an account, you agree to our
                  <Text style={{ color: "rgba(255,255,255,0)" }}>
                    a</Text>

                  <Text
                    style={{ color: "grey", textDecorationLine: "underline", textDecorationColor: "grey" }}
                    onPress={() => {
                      Linking.openURL("http://www.example.com/").then(r => console.log("HAHA"));
                    }}
                  >
                    Conditions of Use
                  </Text>

                  <Text style={{ color: "rgba(255,255,255,0)" }}>
                    a</Text>
                  and
                  <Text style={{ color: "rgba(255,255,255,0)" }}>
                    a</Text>
                  <Text
                    style={{ color: "grey", textDecorationLine: "underline", textDecorationColor: "grey" }}
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

          <View style={{ marginTop: 20 }}>
            <Button onPress={SignUpUser} style={styles.btn} size={"lg"}
                    _text={{
                      color: "#fff",
                    }}>
              Register
            </Button>

          </View>

          <View style={{ marginTop: 10 }}>
            <Image

              alt={"Logo"}
              style={styles.logo}
              source={require("../assets/app_rs/my_shop_logo.png")}
            />

            <HStack style={{ alignSelf: "center" }}>
              <Text fontSize={"md"} mr={2}>Already have an account?</Text>
              <Link _text={{
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
