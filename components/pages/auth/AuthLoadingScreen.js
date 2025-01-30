import React, { useContext, useEffect, useRef, useState } from "react";
import { ToastAndroid, View } from "react-native";
import { AppContext } from "@/app_contexts/AppContext";
import { getUserAccount } from "../../config/API";
import ToastComponent from "../components/ToastComponent";

import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import ContentLoader from "react-native-easy-content-loader";
import { Divider } from "@/components/ui/divider";
import Toast from "react-native-toast-message";
import { useToast } from "@/components/ui/toast";
import { Spinner } from "@/components/ui/spinner";

import { SQLiteProvider, useSQLiteContext, SQLiteDatabase } from 'expo-sqlite';


function AuthLoadingScreen(props) {
    const [isLoadingScreen, setIsLoadingScreen] = useState(true);
    const [isLoggedIn, setLoggedInStatus] = useContext(AppContext);
    const db = useSQLiteContext();
    const mountedRef = useRef(true);

    const toast = useToast();

    useEffect(() => {
        getLoggedInUser();

    }, []);

    useEffect(() => {
        if (!isLoadingScreen) {
            props.navigation.replace("Drawer", { isLoggedIn: isLoggedIn }); //navigates by removing current screen from history stack
        }

    }, [isLoadingScreen]);


    //handle token status response
    const setIsTokenError = (isError, message) => {
        // if is error == true user is not logged in or token expired
        if (isError) {
            setIsLoadingScreen(false);
            setLoggedInStatus(false);
        } else {
            setIsLoadingScreen(false);
            setLoggedInStatus(true);
            // props.navigation.replace("Drawer", { isLoggedIn: true }); //navigates by removing current screen from history stack
        }
    };

    //get logged in user
    const getLoggedInUser = async () => {
        let allRows = db.getAllSync("SELECT * FROM user LIMIT 1")
        let user = [];
        for (const row of allRows) {
            user.push(row);
        }
        if (user.length === 0) {
            setIsLoadingScreen(false);
            setLoggedInStatus(false);
            // console.log("no user")

            // props.navigation.replace("Drawer", { isLoggedIn: false }); //navigates by removing current screen from history stack
        } else {
            // console.log("UUSER EXISTS")
            const data = {
                access_token: user[0].access_token,
                setIsTokenError: setIsTokenError,
            };
            getUserAccount(data);
        }
    };


    return (
        <View style={{
            padding: 16,
            marginTop: 5,

        }}>
            {
                isLoadingScreen ? <View>
                    <HStack style={{
                        alignItems: "center",
                        justifyContent: "center",
                    }} space={2} alignItems="center">
                        <Spinner size={'large'} accessibilityLabel="Loading..." />
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
