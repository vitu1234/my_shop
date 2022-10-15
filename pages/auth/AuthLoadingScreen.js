import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { AppContext } from "../../app_contexts/AppContext";
import { db } from "../../config/sqlite_db_service";


function AuthLoadingScreen(props) {
  const [isLoadingScreen, setIsLoadingScreen] = useEffect(true);


  //check for login
  const checkTokenStatus = () => {

  };

  useEffect(() => {
    setCartCounterNumber();
  }, [isLoadingScreen]);
  return (
    <View></View>
  );
}

export default AuthLoadingScreen;
