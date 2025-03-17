import "react-native-gesture-handler";
import React from "react";
import {connectToDatabase, deleteProducts, deleteAllProducts} from "@/components/config/sqlite_db_service";

// require('dotenv/config');
const base_url = "http://192.168.219.105:8000/api";
const base_urlImages = "http://192.168.0.5/my_shop/my_shop_api/public/storage";

//===================================================================
//GET METHODS
//===================================================================
const getHomeScreen = async (props) => {
    try {
        const response = await fetch(`${base_url}/homescreen`, { method: "GET" });
        const data = await response.json();
        const db = props.db;

        if (db == null) {
            throw new Error('Database connection is not initialized.');
        }

        // Delete old data
        await deleteProducts(db);

        // console.log("HERE2")
        const  results = await db.getAllAsync("PRAGMA table_info(category);")
        // console.log(data)
        // Use Promise.all to wait for all insert operations to complete
        await Promise.all([
            ...data.categories.map(category => db.runAsync("INSERT INTO category(category_id,category_name,category_description) VALUES (?,?,?);", [category.category_id, category.category_name, category.category_description])),
            ...data.sub_categories.map(sub_category => db.runAsync("INSERT INTO sub_category(sub_category_id,category_id,sub_category_name,sub_category_description) VALUES (?,?,?,?);", [sub_category.sub_category_id, sub_category.category_id, sub_category.sub_category_name, sub_category.sub_category_description])),
            ...data.products.map(async (product) => {
                await db.runAsync("INSERT INTO product(product_id,product_name,likes,cover,product_description) VALUES (?,?,?,?,?);", [product.product_id, product.product_name, product.likes, product.cover, product.product_description]);

                // Insert product subcategories
                await Promise.all(
                    product.product_sub_categories.map(product_sub_category =>
                        db.runAsync("INSERT INTO product_sub_category(product_sub_category_id,sub_category_id,category_id,product_id,sub_category_name,category_name,sub_category_description) VALUES (?,?,?,?,?,?,?);", [product_sub_category.product_sub_category_id, product_sub_category.sub_category_id, product_sub_category.category_id, product_sub_category.product_id, product_sub_category.sub_category_name, product_sub_category.category_name, product_sub_category.sub_category_description])
                    )
                );

                // Insert product attributes
                await Promise.all(
                    product.product_attributes.map(product_attribute =>
                        db.runAsync("INSERT INTO product_attributes(product_attributes_id,product_id,product_attributes_default,product_attributes_name,product_attributes_value,product_attributes_price,product_attributes_stock_qty,product_attributes_summary) VALUES (?,?,?,?,?,?,?,?);", [product_attribute.product_attributes_id, product_attribute.product_id, product_attribute.product_attributes_default, product_attribute.product_attributes_name, product_attribute.product_attributes_value, product_attribute.product_attributes_price, product_attribute.product_attributes_stock_qty, product_attribute.product_attributes_summary])
                    )
                );

                // Insert product images
                await Promise.all(
                    product.product_images.map(product_image =>
                        db.runAsync("INSERT INTO product_images(product_images_id,product_id,img_url) VALUES (?,?,?);", [product_image.product_images_id, product_image.product_id, product_image.img_url])
                    )
                );

                // // Shipping information
                await Promise.all(
                    product.product_shipping.map(shipping =>
                        db.runAsync("INSERT INTO product_shipping(product_shipping_id,product_id,shipping_company_id,shipping_type,shipping_amount,shipping_company_name,shipping_company_address) VALUES (?,?,?,?,?,?,?);",
                            [shipping.product_shipping_id, shipping.product_id, shipping.shipping_company_id,shipping.shipping_type,shipping.shipping_amount,shipping.shipping_company_name, shipping.shipping_company_address])
                    )
                );

                // console.log( product.product_shipping);
            })
        ]);

        // Notify success
        console.log("before props push")
        await props.homeScreenLoading(false, "Fetch data success");

    } catch (error) {
        // Handle error
        await props.homeScreenLoading(true, error.message);
        // console.error(error.message)
    }
};

const getProductsScreen = async (props) => {

    try {
        // console.log(props.categoryActive)
        if (props.categoryActive === -1) {
            fetch(`${base_url}/product`, {
                method: "GET", // default, so we can ignore
            })
                .then((response) => response.json())
                .then(async (data) => {
                    // console.log(data.products_homescreen);
                    //delete old data
                    const db = await connectToDatabase()
                    await deleteAllProducts();

                    //loop through all categories and insert into database
                    data.categories.map(async (category) => {
                        //insert in database
                        const result = await db.runAsync("INSERT INTO category (category_id, category_name) VALUES (?,?)", [category.category_id, category.category_name]);

                    });

                    data.products.map(async (product) => {
                        //insert in database
                        const result = await db.runAsync("INSERT INTO product(product_id,category_id,product_name,qty,price,img_url,product_description, category_name) VALUES (?,?,?,?,?,?,?,?);", [product.product_id, product.category_id, product.product_name, product.qty, product.price, product.img_url, product.product_description, product.category_name],);

                    });
                    props.productsScreenLoading(false, "Fetch data success");
                })
                .catch((err) => {
                    props.productsScreenLoading(true, err.message);
                });
        } else if (props.category_id === -1) {
            fetch(`${base_url}/product`, {
                method: "GET", // default, so we can ignore
            })
                .then((response) => response.json())
                .then(async (data) => {
                    // console.log(data.products_homescreen);
                    //delete old data
                    const db = await connectToDatabase()
                    await deleteAllProducts(db);

                    //loop through all categories and insert into database
                    data.categories.map(async (category) => {
                        //insert in database
                        const result = await db.runAsync("INSERT INTO category (category_id, category_name) VALUES (?,?)", [category.category_id, category.category_name]);

                    });

                    data.products.map(async (product) => {
                        //insert in database
                        const result = await db.runAsync("INSERT INTO product(product_id,category_id,product_name,qty,price,img_url,product_description, category_name) VALUES (?,?,?,?,?,?,?,?);", [product.product_id, product.category_id, product.product_name, product.qty, product.price, product.img_url, product.product_description, product.category_name]);

                    });
                    props.productsScreenLoading(false, "Fetch data success");
                })
                .catch((err) => {
                    props.productsScreenLoading(true, err.message);
                });
        } else {
            fetch(`${base_url}/product/product_by_category/${props.category_id}`, {
                method: "GET", // default, so we can ignore
            })
                .then((response) => response.json())
                .then(async (data) => {
                    // console.log(data.products_homescreen);
                    //delete old data
                    const db = await connectToDatabase()
                    await deleteAllProducts(db);

                    //loop through all categories and insert into database
                    data.categories.map(async (category) => {
                        //insert in database
                        const result = await db.runAsync("INSERT INTO category (category_id, category_name) VALUES (?,?)", [category.category_id, category.category_name],);

                    });

                    data.products.map(async (product) => {
                        //insert in database
                        const result = await db.runAsync("INSERT INTO product(product_id,category_id,product_name,qty,price,img_url,product_description, category_name) VALUES (?,?,?,?,?,?,?,?);", [product.product_id, product.category_id, product.product_name, product.qty, product.price, product.img_url, product.product_description, product.category_name],);


                    });
                    props.productsScreenLoading(false, "Fetch data success");
                })
                .catch((err) => {
                    props.productsScreenLoading(true, err.message);
                });
        }
    } catch (error) {
        props.productsScreenLoading(true, error.message);
    }

};

//get registered user account | checks user token validity
const getUserAccount = async (props) => {
    // console.log(`${props.access_token}:ACCESS TOKEN`)
    // Default options are marked with *
    const response = await fetch(`${base_url}/auth/profile`, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${props.access_token}`, // 'Content-Type': 'application/x-www-form-urlencoded',
        }, redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        // body: JSON.stringify(props), // body data type must match "Content-Type" header
    }).then((response) => response.json())
        .then((data) => {
            console.log("data ACCESS");
            console.log(data);
            // console.log("data");
            props.setIsTokenError(data.isError, data.message);
        })
        .catch((err) => {
            // console.log(err);
            props.setIsTokenError(true, err.message);
        });

};

//=======================================================================
//POST METHODS
//=======================================================================
//register user account
const registerUserAccount = async (props) => {
    // console.log(props);
    // Example POST method implementation:

    // Default options are marked with *
    const response = await fetch(`${base_url}/user`, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json", // 'Content-Type': 'application/x-www-form-urlencoded',
        }, redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(props), // body data type must match "Content-Type" header
    }).then((response) => response.json())
        .then((data) => {
            // console.log("data");
            // console.log(data);
            // console.log("data");
            props.setIsSignUpError(data.isError, data.message);
        })
        .catch((err) => {
            // console.log(err);
            props.setIsSignUpError(true, err.message);
        });

    // return response.json(); // parses JSON response into native JavaScript objects


};

//verify code sent to user after register
const registerVerifyCodeUserAccount = async (props) => {
    // console.log(props);
    // Example POST method implementation:

    // Default options are marked with *
    const response = await fetch(`${base_url}/user/verify_email_phone_code`, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json", // 'Content-Type': 'application/x-www-form-urlencoded',
        }, redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(props), // body data type must match "Content-Type" header
    }).then((response) => response.json())
        .then((data) => {
            // console.log("data");
            // console.log(data);
            // console.log("data");
            props.setIsVerifyAccountError(data.isError, data.message);
        })
        .catch((err) => {
            // console.log(err);
            props.setIsVerifyAccountError(true, err.message);
        });

    // return response.json(); // parses JSON response into native JavaScript objects


};

//login user account
const userLogin = async (props) => {
    // console.log(props);
    // Example POST method implementation:

    // Default options are marked with *
    const response = await fetch(`${base_url}/auth/login`, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json", // 'Content-Type': 'application/x-www-form-urlencoded',
        }, redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(props), // body data type must match "Content-Type" header
    }).then((response) => response.json())
        .then((data) => {

            //if user logged in save into localdb
            if (!data.isError) {
                saveLoggedInUser(data.user_data);
            }
            props.setIsLoginError(data.isError, data.message);
        })
        .catch((err) => {
            // console.log(err);
            props.setIsLoginError(true, err.message);
        });

    // return response.json(); // parses JSON response into native JavaScript objects


};


export {
    base_url,
    base_urlImages,
    getProductsScreen,
    getHomeScreen,
    getUserAccount,
    registerUserAccount,
    registerVerifyCodeUserAccount,
    userLogin, // userLogout,
};
