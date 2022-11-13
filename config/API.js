import "react-native-gesture-handler";
import React from "react";
import {
  db,
  deleteAllHomescreenProducts,
  deleteAllProducts,
  deleteAllUserData,
  saveLoggedInUser,
} from "./sqlite_db_service";


// require('dotenv/config');
const base_url = "http://192.168.0.5/my_shop/my_shop_api/public/api";
const base_urlImages = "http://192.168.0.5/my_shop/my_shop_api/public/storage";

//===================================================================
//GET METHODS
//===================================================================
const getHomeScreen = async (props) => {

  try {

    fetch(`${base_url}/homescreen`, {
      method: "GET", // default, so we can ignore
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data.products_homescreen);
        //delete old data
        deleteAllHomescreenProducts();

        //loop through all categories and insert into database
        data.categories.map(async (category) => {
          //insert in database
          await db.transaction(async (tx) => {
            await tx.executeSql(
              "INSERT INTO category (category_id, category_name) VALUES (?,?)",
              [category.category_id, category.category_name],
            );
          });
        });

        data.products_homescreen.map(async (product) => {
          //insert in database

          db.transaction(async (tx) => {

            await tx.executeSql(
              "INSERT INTO products_homescreen(product_id,category_id,product_name,qty,price,img_url,product_description) VALUES (?,?,?,?,?,?,?);",
              [product.product_id, product.category_id, product.product_name, product.qty, product.price, product.img_url, product.product_description],
            );
          });
        });
        props.homeScreenLoading(false, "Fetch data success");
      })
      .catch((err) => {
        props.homeScreenLoading(true, err.message);
      });
  } catch (error) {
    props.homeScreenLoading(true, error.message);
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
        .then((data) => {
          // console.log(data.products_homescreen);
          //delete old data
          deleteAllProducts();

          //loop through all categories and insert into database
          data.categories.map(async (category) => {
            //insert in database
            await db.transaction(async (tx) => {
              await tx.executeSql(
                "INSERT INTO category (category_id, category_name) VALUES (?,?)",
                [category.category_id, category.category_name],
              );
            });
          });

          data.products.map(async (product) => {
            //insert in database

            db.transaction(async (tx) => {

              await tx.executeSql(
                "INSERT INTO product(product_id,category_id,product_name,qty,price,img_url,product_description, category_name) VALUES (?,?,?,?,?,?,?,?);",
                [product.product_id, product.category_id, product.product_name, product.qty, product.price, product.img_url, product.product_description, product.category_name],
              );
            });
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
        .then((data) => {
          // console.log(data.products_homescreen);
          //delete old data
          deleteAllProducts();

          //loop through all categories and insert into database
          data.categories.map(async (category) => {
            //insert in database
            await db.transaction(async (tx) => {
              await tx.executeSql(
                "INSERT INTO category (category_id, category_name) VALUES (?,?)",
                [category.category_id, category.category_name],
              );
            });
          });

          data.products.map(async (product) => {
            //insert in database

            db.transaction(async (tx) => {

              await tx.executeSql(
                "INSERT INTO product(product_id,category_id,product_name,qty,price,img_url,product_description, category_name) VALUES (?,?,?,?,?,?,?,?);",
                [product.product_id, product.category_id, product.product_name, product.qty, product.price, product.img_url, product.product_description, product.category_name],
              );
            });
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
        .then((data) => {
          // console.log(data.products_homescreen);
          //delete old data
          deleteAllProducts();

          //loop through all categories and insert into database
          data.categories.map(async (category) => {
            //insert in database
            await db.transaction(async (tx) => {
              await tx.executeSql(
                "INSERT INTO category (category_id, category_name) VALUES (?,?)",
                [category.category_id, category.category_name],
              );
            });
          });

          data.products.map(async (product) => {
            //insert in database

            db.transaction(async (tx) => {

              await tx.executeSql(
                "INSERT INTO product(product_id,category_id,product_name,qty,price,img_url,product_description, category_name) VALUES (?,?,?,?,?,?,?,?);",
                [product.product_id, product.category_id, product.product_name, product.qty, product.price, product.img_url, product.product_description, product.category_name],
              );
            });
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
      "Authorization": `Bearer ${props.access_token}`,
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    // body: JSON.stringify(props), // body data type must match "Content-Type" header
  }).then((response) => response.json())
    .then((data) => {
      // console.log("data ACCESS");
      // console.log(data);
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
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
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
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
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
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
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
  userLogin,
  // userLogout,
};
