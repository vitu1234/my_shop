import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {ChevronRight,CircleDollarSign, Truck} from "lucide-react-native";

import * as Location from 'expo-location';

const ShippingDetails = (props) => {
    console.log('Shipping Details');
    console.log(props)
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [displayCurrentAddress, setDisplayCurrentAddress] = useState('Location Loading.....');

    useEffect(() => {
        (async () => {

            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getLastKnownPositionAsync({});
            // let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            await getCurrentLocation();
        })();


    }, []);

    //get current location
    const getCurrentLocation = async () => {
        let {status} = await Location.requestForegroundPermissionsAsync();  //used for the pop up box where we give permission to use location
        console.log(status);
        if (status !== 'granted') {
            Alert.alert('Permission denied', 'Allow the app to use the location services', [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {text: 'OK', onPress: () => console.log('OK Pressed')},
            ]);
        }

        //get current position lat and long
        const {coords} = await Location.getLastKnownPositionAsync();
        console.log(coords)

        if (coords) {
            const {latitude, longitude} = coords;
            console.log(latitude, longitude);

            //provide lat and long to get the the actual address
            let responce = await Location.reverseGeocodeAsync({
                latitude,
                longitude
            });
            console.log(responce);
            //loop on the responce to get the actual result
            for (let item of responce) {
                let address = `${item.name} ${item.city} ${item.postalCode}`
                setDisplayCurrentAddress(address)
            }
        }
    }


    return (

        <View style={styles.container}>
            <TouchableOpacity>
                <View style={styles.subcontainer}>

                    <View style={{flex: 4}}>
                        <Text numberOfLines={1} style={styles.title}>Ship to {displayCurrentAddress}</Text>
                        <View style={styles.shippingContainer}>
                            <Truck color={'#5d5d5d'} style={{marginEnd: 10}} size={30}/>

                            <View>
                                <Text style={styles.textsDesc}>Free shipping</Text>
                                <Text style={styles.textsDesc}>Estimated Delivery Date is 27/11/2024 - 05/12/2024</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{flex: 0, alignItems: "flex-end", justifyContent: "center"}}>
                        <ChevronRight style={{alignItems: "flex-end", justifyContent: "center"}}/>
                    </View>

                </View>
            </TouchableOpacity>
            <View style={{backgroundColor: '#e8e8e8', marginTop: 10, paddingTop: 1}}></View>
            <TouchableOpacity>
                <View style={[{marginTop: 10},styles.subcontainer]}>

                    <CircleDollarSign strokeWidth={3} color={'#5d5d5d'} style={{marginEnd: 3}} size={20}/>
                    <View style={{flex: 4}}>
                        <Text numberOfLines={1} style={[{marginTop:2 ,textAlign :'left', color: '#5d5d5d', fontWeight: 'bold'}, styles.title]}>Return Policy</Text>
                    </View>
                    <View style={{flex: 0, alignItems: "flex-end", justifyContent: "center"}}>
                        <ChevronRight style={{alignItems: "flex-end", justifyContent: "center"}}/>
                    </View>

                </View>
            </TouchableOpacity>
        </View>

    );
};
const styles = StyleSheet.create({
    container: {

        backgroundColor: '#fff',

    },
    subcontainer: {
        flexDirection: 'row'
    },
    title: {
        // fontSize: 18,
        // textAlign: 'center',
        fontWeight: 'bold'
    },
    shippingContainer: {
        marginTop: 7,
        flexDirection: 'row',
    },
    textsDesc: {
        fontSize: 13
    }
});

export default ShippingDetails;
