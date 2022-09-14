import React, { useContext } from "react";
import { AppContext } from "../app_contexts/AppContext";
import { db } from "../config/sqlite_db_service";
import { Dimensions, StyleSheet } from "react-native";
import { Button, Center, Heading, HStack, Image, ScrollView, Text, View, VStack } from "native-base";
import { base_urlImages } from "../config/API";
import numbro from "numbro";
import Icon from "react-native-vector-icons/AntDesign";
import CollapsibleView from "@eliav2/react-native-collapsible-view";

const { width } = Dimensions.get("window");
const windowHeight = Dimensions.get("window").height;

function LoginScreen(props) {
  const [isLoggedIn, setLoggedInStatus] = useContext(AppContext);

  return (
    <ScrollView showsVerticalScrollIndicator={false} h={windowHeight - 80} _contentContainerStyle={{}}>

      <Center>
        <View>
          <Text>Hey there,</Text>
          <Heading size="lg">Welcome Back</Heading>
        </View>
      </Center>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    alignSelf: "center",
  },
  textTitle: {
    color: "#424242",
  },
  textSubTitle: {
    color: "black",
    marginBottom: 8,
    padding: 10,
    textAlign: "justify",
    fontSize: 16,
    fontWeight: "900",

  },

});
export default LoginScreen;
