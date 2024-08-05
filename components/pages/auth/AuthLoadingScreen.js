import React, {useContext, useEffect, useRef, useState} from "react";
import {ToastAndroid, View} from "react-native";
import {AppContext} from "@/app_contexts/AppContext";
import {getUserAccount} from "../../config/API";

import {Center} from "@/components/ui/center"
import {Button} from "@/components/ui/button"
import {HStack} from "@/components/ui/hstack"
import {VStack} from "@/components/ui/vstack"
import {Text} from "@/components/ui/text"
import {Image} from "@/components/ui/image"
import {useToast, Toast} from "@/components/ui/toast"
import {Spinner} from "@/components/ui/spinner"
import {Heading} from "@/components/ui/heading"


function AuthLoadingScreen(props) {
    const [isLoadingScreen, setIsLoadingScreen] = useState(true);
    const [isLoggedIn, setLoggedInStatus] = useContext(AppContext);

    const mountedRef = useRef(true);

    const toast = useToast();

    useEffect(() => {
        getLoggedInUser();
        console.log("VITU")

    }, []);

    useEffect(() => {
        if (!isLoadingScreen) {
            props.navigation.replace("Drawer", {isLoggedIn: isLoggedIn}); //navigates by removing current screen from history stack
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
        await db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM user LIMIT 1",
                [],
                (tx, results) => {
                    const len = results.rows.length;
                    let user = [];

                    for (let i = 0; i < results.rows.length; ++i) {
                        user.push(results.rows.item(i));
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
                },
            );
        });
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
                        <Spinner accessibilityLabel="Loading..."/>
                        <Heading color="primary.500" fontSize="md">
                            Loading...
                        </Heading>
                    </HStack>
                </View> : <Text/>
            }

        </View>
    );
}

export default AuthLoadingScreen;
