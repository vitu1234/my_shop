import React, { useContext } from "react";
import {Dimensions, ScrollView, StyleSheet, View} from "react-native";
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

const { width } = Dimensions.get("window");
const windowHeight = Dimensions.get("window").height;

function ForgetPasswordScreen(props) {
  const [show, setShow] = React.useState(false);

  return (
    <ScrollView showsVerticalScrollIndicator={false} h={windowHeight - 80} _contentContainerStyle={{}}>
      <View style={styles.mainContainer}>
        <View style={styles.topContainer}>
          <Heading style={styles.textSubTitle} size="lg">Reset Password</Heading>
          <Text style={styles.textTitle}>Forgot your password? Don't worry, that's okay, It happens to everyone!</Text>
          <Text style={styles.textTitle}>Please provide your email or phone number you used for signup to reset your
            password!</Text>
        </View>

        <View style={{ alignSelf: "center" }}>
          <VStack space={4} w="100%" alignItems="center">

            <Input
              w={{
                base: "100%",
                md: "25%",
              }}
              InputLeftElement={<SimpleLineIcons style={{ marginStart: 15 }} name="envelope"
                                                 size={18} ml="2" color="#000" />}
              placeholder="Phone or email" />

          </VStack>

          <View style={{ marginTop: 20 }}>
            <Button onPress={() => console.log("hahah")} style={styles.btn} size={"lg"}
                    _text={{
                      color: "#fff",
                    }}>
              Send Reset Instructions
            </Button>

          </View>

          <View style={{ marginTop: 100 }}>
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
    marginTop: 10,
    marginBottom: 15,
    // backgroundColor:"red",
    width: "100%",

  },
  textTitle: {
    marginTop:2,
    paddingStart: 7,
    paddingEnd: 7,
    color: "grey",
    textAlign: "left",
    // fontSize: 18,
    fontWeight:"600"
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
export default ForgetPasswordScreen;
