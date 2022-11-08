import React, { useEffect, useState } from "react";
import { ToastAndroid, View } from "react-native";
import { AppContext } from "../../app_contexts/AppContext";
import { db, getLoggedInUser } from "../../config/sqlite_db_service";
import { getUserAccount } from "../../config/API";
import { Heading, HStack, Spinner, useToast } from "native-base";
import ToastComponent from "../components/ToastComponent";


function AuthLoadingScreen(props) {
  const [isLoadingScreen, setIsLoadingScreen] = useState(true);

  const toast = useToast();

  useEffect(() => {
    checkTokenStatus();
  }, [isLoadingScreen]);

  //check for login
  const checkTokenStatus = () => {
    const user = getLoggedInUser();
    //not logged in | no token found
    if (user.length === 0) {
      setIsLoadingScreen(false);
      props.navigation.navigate("Drawer", { isAccessTokenValid: false });
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
      const ToastDetails = {
        id: 14,
        title: "Not Logged In",
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
      props.navigation.navigate("Drawer", { isAccessTokenValid: false });
    } else {
      setIsLoadingScreen(false);
      props.navigation.navigate("Drawer", { isAccessTokenValid: true });
    }
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
        </View> : null
      }

    </View>
  );
}

export default AuthLoadingScreen;
