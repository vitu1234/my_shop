import React, { useEffect, useState } from "react";
import { ToastAndroid, View } from "react-native";
import { AppContext } from "../../app_contexts/AppContext";
import { db } from "../../config/sqlite_db_service";
import { getUserAccount } from "../../config/API";
import { Heading, HStack, Spinner, Text, useToast } from "native-base";
import ToastComponent from "../components/ToastComponent";


function AuthLoadingScreen(props) {
  const [isLoadingScreen, setIsLoadingScreen] = useState(true);
  const [loggedInUserAccount, setUserLoggedInUserAccount] = useState([]);

  const toast = useToast();

  useEffect(() => {
    getLoggedInUser();
    // checkTokenStatus();
  }, [isLoadingScreen]);

  //check for login
  const checkTokenStatus = async () => {

    const user = loggedInUserAccount;

    console.log("djdj");
    console.log(user);

    //not logged in | no token found
    if (user.length === 0) {
      console.log("DHDHDH not ");
      setIsLoadingScreen(false);
      props.navigation.replace("Drawer", { isAccessTokenValid: false }); //navigates by removing current screen from history stack
    } else {
      setIsLoadingScreen(true);

      const data = {
        access_token: user.access_token,
        setIsTokenError: setIsTokenError,
      };
      getUserAccount(data).then(r => console.log());
    }
  };

  //handle token status response
  const setIsTokenError = (isError, message) => {
    // if is error == true user is not logged in or token expired
    if (isError) {
      // const ToastDetails = {
      //   id: 14,
      //   title: "Not Logged In",
      //   variant: "left-accent",
      //   description: message,
      //   isClosable: false,
      //   status: "error",
      //   duration: 1000,
      // };
      // toast.show({
      //   render: () => {
      //     return <ToastComponent {...ToastDetails} />;
      //   },
      // });
      props.navigation.navigate("Drawer", { isAccessTokenValid: false });
    } else {
      // setIsLoadingScreen(false);
      props.navigation.replace("Drawer", { isAccessTokenValid: true }); //navigates by removing current screen from history stack
    }
  };

  //get logged in user
  const getLoggedInUser = async () => {
    await db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM user",
        [],
        (tx, results) => {
          const len = results.rows.length;
          let user = [];

          for (let i = 0; i < results.rows.length; ++i) {
            user.push(results.rows.item(i));
          }

          if (user.length === 0) {
            setIsLoadingScreen(false);
            props.navigation.replace("Drawer", { isAccessTokenValid: false }); //navigates by removing current screen from history stack
          } else {
            const data = {
              access_token: user[0].access_token,
              setIsTokenError: setIsTokenError,
            };
            getUserAccount(data);
          }
        },
      );
    });
  };


  return (
    <View>
      {
        isLoadingScreen ? <View>
          <HStack space={2} alignItems="center">
            <Spinner accessibilityLabel="Loading..." />
            <Heading color="primary.500" fontSize="md">
              Loading...
            </Heading>
          </HStack>
        </View> : <Text />
      }

    </View>
  );
}

export default AuthLoadingScreen;
