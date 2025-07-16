import "react-native-gesture-handler";
import React from "react";
import { connectToDatabase, deleteProducts, deleteAllProducts } from "@/components/config/sqlite_db_service";

// require('dotenv/config');
const base_url = "http://192.168.3.200:8000/api";

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
        // const results = await db.getAllAsync("PRAGMA table_info(category);")
        // console.log(data)
        // Use Promise.all to wait for all insert operations to complete
        await Promise.all([
            ...data.categories.map(category => db.runAsync("INSERT INTO category(category_id,category_name,category_icon,category_description) VALUES (?,?,?,?);", [category.category_id, category.category_name, category.category_icon, category.category_description])),
            ...data.sub_categories.map(sub_category => db.runAsync("INSERT INTO sub_category(sub_category_id,category_id,sub_category_name,sub_category_description) VALUES (?,?,?,?);", [sub_category.sub_category_id, sub_category.category_id, sub_category.sub_category_name, sub_category.sub_category_description])),
            ...data.products.map(async (product) => {
                await db.runAsync("INSERT INTO product(product_id,product_name,likes,cover,product_description, product_variant_id,is_default, sku, price,stock_qty ) VALUES (?,?,?,?,?,?,?,?,?,?);", [product.product_id, product.product_name, product.likes, product.cover, product.product_description, product.product_variant_id, product.is_default, product.sku, product.price, product.stock_qty]);

                // Insert product subcategories
                await Promise.all(
                    product.product_sub_categories.map(product_sub_category =>
                        db.runAsync("INSERT INTO product_sub_category(product_sub_category_id,sub_category_id,category_id,product_id,sub_category_name,category_name,sub_category_description) VALUES (?,?,?,?,?,?,?);", [product_sub_category.product_sub_category_id, product_sub_category.sub_category_id, product_sub_category.category_id, product_sub_category.product_id, product_sub_category.sub_category_name, product_sub_category.category_name, product_sub_category.sub_category_description])
                    )
                );

                // // Insert product attributes
                // await Promise.all(
                //     product.product_attributes.map(product_attribute =>
                //         db.runAsync("INSERT INTO product_attributes(product_attributes_id,product_id,product_attributes_default,product_attributes_name,product_attributes_value,product_attributes_price,product_attributes_stock_qty,product_attributes_summary) VALUES (?,?,?,?,?,?,?,?);", [product_attribute.product_attributes_id, product_attribute.product_id, product_attribute.product_attributes_default, product_attribute.product_attributes_name, product_attribute.product_attributes_value, product_attribute.product_attributes_price, product_attribute.product_attributes_stock_qty, product_attribute.product_attributes_summary])
                //     )
                // );

                // Insert product images
                await Promise.all(
                    product.product_images.map(product_image =>
                        db.runAsync("INSERT INTO product_images(product_images_id,product_id,img_url) VALUES (?,?,?);", [product_image.product_images_id, product_image.product_id, product_image.img_url])
                    )
                );

                // // Shipping information
                // await Promise.all(
                //     product.product_shipping.map(shipping =>
                //         db.runAsync("INSERT INTO product_shipping(product_shipping_id,product_id,shipping_company_id,shipping_type,shipping_amount,shipping_company_name,shipping_company_address) VALUES (?,?,?,?,?,?,?);",
                //             [shipping.product_shipping_id, shipping.product_id, shipping.shipping_company_id, shipping.shipping_type, shipping.shipping_amount, shipping.shipping_company_name, shipping.shipping_company_address])
                //     )
                // );

                // console.log( product.product_shipping);
            }),
            ...data.categories.flatMap(category =>
                category.filters.flatMap(filter =>
                    filter.filter_options.map(filter_option =>
                        db.runAsync(
                            "INSERT INTO filters(filter_id, category_id, filter_name, is_default, filter_option_id, option_label) VALUES (?, ?, ?, ?, ?, ?);",
                            [filter.filter_id, category.category_id, filter.filter_name, filter.is_default, filter_option.filter_option_id, filter_option.option_label]
                        )
                    )
                )
            ),
        ]);

        // Notify success
        // console.log("before props push")
        await props.homeScreenLoading(false, "Fetch data success");

    } catch (error) {
        // Handle error
        await props.homeScreenLoading(true, error.message);
        // console.error(error.message)
    }
};


const getAllProducts = async (props) => {
    limit = props.limit;
    offset = props.offset;
    filters = props.filters;
    console.log("SENDING..............")

    console.log(JSON.stringify({
        filters: filters || {}, // Only include if filters are passed
    }))
    try {
        // console.log(props.categoryActive)
        fetch(`${base_url}/product/${limit}/${offset}`, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json", // 'Content-Type': 'application/x-www-form-urlencoded',
            }, redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify({
                filters: filters || {}, // Only include if filters are passed
            }), // body data type must match "Content-Type" header
        })
            .then((response) => response.json())
            .then(async (data) => {
                // console.log(data.products);
                const products = data.products;
                //delete old data
                // const db = await connectToDatabase()
                // await deleteAllProducts();

                // //loop through all categories and insert into database
                // data.categories.map(async (category) => {
                //     //insert in database
                //     const result = await db.runAsync("INSERT INTO category (category_id, category_name) VALUES (?,?)", [category.category_id, category.category_name]);

                // });

                // data.products.map(async (product) => {
                //     //insert in database
                //     const result = await db.runAsync("INSERT INTO product(product_id,category_id,product_name,qty,price,img_url,product_description, category_name) VALUES (?,?,?,?,?,?,?,?);", [product.product_id, product.category_id, product.product_name, product.qty, product.price, product.img_url, product.product_description, product.category_name],);

                // });
                // props.productsScreenLoading(false, "Fetch data success");
                props.productsScreenLoading(false, "", products);
            })
            .catch((err) => {
                props.productsScreenLoading(true, err.message);
            });

    } catch (error) {
        props.productsScreenLoading(true, error.message);
    }

};

//get all products by category
const getAllProductsByCategory = async (props) => {
    limit = props.limit;
    category_id = props.category_id;
    offset = props.offset;
    filters = props.filters;
    // console.log("SENDING BYd CATEGORY..............")
    if (category_id == undefined) {
        category_id = -1; // Default to -1 if no category is selected
    }

    // console.log(JSON.stringify({
    //     filters: filters || {}, // Only include if filters are passed
    // }))

    // console.log("CATEGORY ID: " + category_id)


    try {
        // console.log(props.categoryActive)
        fetch(`${base_url}/product/product_by_category/${category_id}/${limit}/${offset}`, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json", // 'Content-Type': 'application/x-www-form-urlencoded',
            }, redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify({
                filters: filters || {}, // Only include if filters are passed
            }), // body data type must match "Content-Type" header
        })
            .then((response) => response.json())
            .then(async (data) => {
                // console.log(data.products);
                const products = data.products;
                //delete old data
                // const db = await connectToDatabase()
                // await deleteAllProducts();

                // //loop through all categories and insert into database
                // data.categories.map(async (category) => {
                //     //insert in database
                //     const result = await db.runAsync("INSERT INTO category (category_id, category_name) VALUES (?,?)", [category.category_id, category.category_name]);

                // });

                // data.products.map(async (product) => {
                //     //insert in database
                //     const result = await db.runAsync("INSERT INTO product(product_id,category_id,product_name,qty,price,img_url,product_description, category_name) VALUES (?,?,?,?,?,?,?,?);", [product.product_id, product.category_id, product.product_name, product.qty, product.price, product.img_url, product.product_description, product.category_name],);

                // });
                // props.productsScreenLoading(false, "Fetch data success");
                props.productsScreenLoading(false, "", products);
            })
            .catch((err) => {
                props.productsScreenLoading(true, err.message);
            });

    } catch (error) {
        props.productsScreenLoading(true, error.message);
    }

};


//get all products by sub_category
const getAllProductsBySubCategory = async (props) => {

    category_id = props.category_id;
    sub_category_id = props.sub_category_id;

    if (category_id == undefined) {
        category_id = -1; // Default to -1 if no category is selected
    }
    if (sub_category_id == undefined) {
        sub_category_id = -1; // Default to -1 if no category is selected
    }

    limit = props.limit;
    offset = props.offset;
    filters = props.filters;
    // console.log("SENDING BY SUBCATEGORY..............")
    // console.log("CATEGORY ID: " + category_id)
    // console.log("SUB CATEGORY ID: " + sub_category_id)  

    // console.log(JSON.stringify({
    //     filters: filters || {}, // Only include if filters are passed
    // }))
    try {
        // console.log(props.categoryActive)
        fetch(`${base_url}/product/product_by_sub_category/${category_id}/${sub_category_id}/${limit}/${offset}`, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json", // 'Content-Type': 'application/x-www-form-urlencoded',
            }, redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify({
                filters: filters || {}, // Only include if filters are passed
            }), // body data type must match "Content-Type" header
        })
            .then((response) => response.json())
            .then(async (data) => {
                // console.log(data.products);
                const products = data.products;
                //delete old data
                // const db = await connectToDatabase()
                // await deleteAllProducts();

                // //loop through all categories and insert into database
                // data.categories.map(async (category) => {
                //     //insert in database
                //     const result = await db.runAsync("INSERT INTO category (category_id, category_name) VALUES (?,?)", [category.category_id, category.category_name]);

                // });

                // data.products.map(async (product) => {
                //     //insert in database
                //     const result = await db.runAsync("INSERT INTO product(product_id,category_id,product_name,qty,price,img_url,product_description, category_name) VALUES (?,?,?,?,?,?,?,?);", [product.product_id, product.category_id, product.product_name, product.qty, product.price, product.img_url, product.product_description, product.category_name],);

                // });
                // props.productsScreenLoading(false, "Fetch data success");
                props.productsScreenLoading(false, "", products);
            })
            .catch((err) => {
                props.productsScreenLoading(true, err.message);
            });

    } catch (error) {
        props.productsScreenLoading(true, error.message);
    }

};



//search suggestions
const getSearchSuggestions = async (props) => {

    const searchQuery = props.searchText;
    try {
        // console.log(props.categoryActive)
        fetch(`${base_url}/product/search/suggestions/${encodeURIComponent(searchQuery)}`, {
            method: "GET", // default, so we can ignore
        })
            .then((response) => response.json())
            .then(async (data) => {
                // console.log("RESYKRS")
                // console.log(data);
                const products = data.searchSuggestions;
                //delete old data
                // const db = await connectToDatabase()
                // await deleteAllProducts();

                // //loop through all categories and insert into database
                // data.categories.map(async (category) => {
                //     //insert in database
                //     const result = await db.runAsync("INSERT INTO category (category_id, category_name) VALUES (?,?)", [category.category_id, category.category_name]);

                // });

                // data.products.map(async (product) => {
                //     //insert in database
                //     const result = await db.runAsync("INSERT INTO product(product_id,category_id,product_name,qty,price,img_url,product_description, category_name) VALUES (?,?,?,?,?,?,?,?);", [product.product_id, product.category_id, product.product_name, product.qty, product.price, product.img_url, product.product_description, product.category_name],);

                // });
                // props.productsScreenLoading(false, "Fetch data success");
                props.productsSearchSuggestionsLoading(false, "", products);
            })
            .catch((err) => {
                props.productsSearchSuggestionsLoading(true, err.message);

            });

    } catch (error) {
        props.productsSearchSuggestionsLoading(true, error.message);
    }

};

//search 
const getSearch = async (props) => {

    const searchQuery = props.searchText;
    const limit = props.limit;
    const offset = props.offset;


    let url_params = '';

    if (props.category_id != -1 && props.category_id != undefined) {
        // console.log("CATEGORY ID: " + props.category_id)
        url_params = `${encodeURIComponent(searchQuery)}/${limit}/${offset}/${props.category_id}/-1/-1`
    } else if (props.sub_category_id != -1 && props.sub_category_id != undefined) {
        // console.log("SUB CATEGORY ID: " + props.sub_category_id)
        url_params = `${encodeURIComponent(searchQuery)}/${limit}/${offset}/-1/${props.sub_category_id}/-1`
    } else if (props.product_id != -1 && props.product_id != undefined) {
        // console.log("PRODUCT ID: " + props.product_id)
        url_params = `${encodeURIComponent(searchQuery)}/${limit}/${offset}/-1/-1/${props.product_id}`
    } else {
        // console.log("NO CATEGORY ID")
        url_params = `${encodeURIComponent(searchQuery)}/${limit}/${offset}`
    }
    // console.log("URL PARAMS: " + url_params)

    // console.log("SEARCH URL: " + `${base_url}/product/search/all/${url_params}`)

    // all/{searchQuery}/{limit}/{offset}/{category_id?}/{sub_category_id?}/{product_id?}
    try {
        // console.log(props.categoryActive)
        fetch(`${base_url}/product/search/all/${url_params}`, {
            method: "GET", // default, so we can ignore
        })
            .then((response) => response.json())
            .then(async (data) => {
                // console.log("RESYKRS")
                // console.log(data);
                const products = data.search_results;
                const totalResults = data.total_results;
                // console.log("TOTAL RESULTS: " + totalResults)
                //delete old data
                // const db = await connectToDatabase()
                // await deleteAllProducts();

                // //loop through all categories and insert into database
                // data.categories.map(async (category) => {
                //     //insert in database
                //     const result = await db.runAsync("INSERT INTO category (category_id, category_name) VALUES (?,?)", [category.category_id, category.category_name]);

                // });

                // data.products.map(async (product) => {
                //     //insert in database
                //     const result = await db.runAsync("INSERT INTO product(product_id,category_id,product_name,qty,price,img_url,product_description, category_name) VALUES (?,?,?,?,?,?,?,?);", [product.product_id, product.category_id, product.product_name, product.qty, product.price, product.img_url, product.product_description, product.category_name],);

                // });
                // props.productsScreenLoading(false, "Fetch data success");
                props.productsSearchResultsLoading(false, "", products);
            })
            .catch((err) => {
                // console.log("ERROR: " + err.message)
                props.productsSearchResultsLoading(true, err.message);

            });

    } catch (error) {
        // console.log("ERROR2: " + error.message)
        props.productsSearchResultsLoading(true, error.message);
    }

};


//get product details by product_id
const getProductDetailsByProductID = async ({ product_id, productDetailsLoading }) => {
    console.log("GETTING PRODUCT DETAILS FOR PRODUCT ID: " + product_id);
    try {
        const response = await fetch(`${base_url}/product/details/${product_id}`, { method: "GET" });

        if (!response.ok) {
            console.error("Error fetching product details:", response.statusText);
            await productDetailsLoading(true, `Error fetching product details: ${response.statusText}`);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const product_details = data.product_details;

        console.log("Product Details:", product_details);

        await productDetailsLoading(false, "", product_details);
    } catch (error) {
        console.error("Error fetching product details:", error);
        await productDetailsLoading(true, "", error.message);
    }
};

//push post request cart online
const SyncCartOnline = async (props) => {

    const cartItems = props.cartItems || [];

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
        console.warn("No cart items to push online.");
        return;
    }

    console.log("Cart items to push online:", cartItems);

    try {
        const response = await fetch(`${base_url}/cart/push`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(cartItems), // Ensure cartItems is an array of objects
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Cart pushed online successfully:", data);
    } catch (error) {
        console.error("Error pushing cart online:", error);
    }
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
    // base_urlImages,
    getAllProducts,
    getAllProductsByCategory,
    getAllProductsBySubCategory,
    getSearch,
    getSearchSuggestions,
    getHomeScreen,
    getProductDetailsByProductID,
    SyncCartOnline,
    // getUserAccount,
    // registerUserAccount,
    // registerVerifyCodeUserAccount,
    userLogin, // userLogout,
};
