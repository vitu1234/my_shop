import React, { useContext } from "react";
import { AppContext } from "../../app_contexts/AppContext";
import { Dimensions, StyleSheet } from "react-native";
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
import { red } from "react-native-reanimated/lib/types/lib/reanimated2";
import { LinearGradient } from "react-native-svg";

const { width } = Dimensions.get("window");
const windowHeight = Dimensions.get("window").height;

function LoginScreen(props) {
  const [isLoggedIn, setLoggedInStatus] = useContext(AppContext);
  const [show, setShow] = React.useState(false);

  const goToForgetPassword = () => {
    props.navigation.navigate("ForgetPassword");
  };

  const goToRegister = () => {
    props.navigation.navigate("SignUp");
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} h={windowHeight - 80} _contentContainerStyle={{}}>
      <View style={styles.mainContainer}>
        <View style={styles.topContainer}>
          <Text style={styles.textTitle}>Hey there,</Text>
          <Heading style={styles.textSubTitle} size="lg">Welcome Back</Heading>
        </View>

        <View style={{ alignSelf: "center" }}>
          <Stack space={4} w="100%" alignItems="center">

            <Input
              w={{
                base: "100%",
                md: "25%",
              }}
              InputLeftElement={<SimpleLineIcons style={{ marginStart: 15 }} name="envelope"
                                                 size={18} ml="2" color="#000" />}
              placeholder="Username or email" />

            <Input
              mt={7}
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

          </Stack>

          <View style={{ marginTop: 30, alignSelf: "center", padding:5 }}>
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

          <View style={{ marginTop: 50 }}>
            <Button onPress={() => console.log("hahah")} style={styles.btn} size={"lg"}
                    _text={{
                      color: "#fff",
                    }}>
              Login
            </Button>

          </View>

          <View style={{ marginTop: 100 }}>
            <Image

              alt={"Logo"}
              style={styles.logo}
              source={require("../../assets/app_rs/my_shop_logo.png")}
            />

            <HStack style={{ alignSelf: "center" }}>
              <Text fontSize={"md"} mr={2}>Don't have an account yet?</Text>
              <Link onPress={goToRegister}  _text={{
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
    height: 100,
    width: 300,
    alignSelf: "center",
  },


});
export default LoginScreen;
