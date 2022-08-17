import 'react-native-gesture-handler';
import React from 'react';

// require('dotenv/config');
const base_url = 'http://192.168.43.24/REACT%20TEMPLATES/my_shop/api/public/api';
// const base_url = 'https://netsoftmw-test.com/android_api/public';

const getProductCategories = async () => {
    try {
        console.log('GET CATEGORIES FROM API');

        fetch(`${base_url}/category`, {
            method: 'GET', // default, so we can ignore
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            })
            .catch((err) => {
                console.log(err.message);
            });
    } catch (error) {
        console.error(error.message);
        console.error('Error');
    }

};
export {base_url, getProductCategories};
