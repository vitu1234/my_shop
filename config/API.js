import "react-native-gesture-handler";
import React from "react";
import { db, deleteAllHomescreenProducts, getAllCategory, getAllProductsHomeScreen } from "./sqlite_db_service";



// require('dotenv/config');
const base_url = "http://192.168.0.5/my_shop/my_shop_api/public/api";

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
        props.homeScreenLoading(false, 'Fetch data success')
      })
      .catch((err) => {
        props.homeScreenLoading(true, err.message)
      });
  } catch (error) {
    props.homeScreenLoading(true, error.message)
  }

};


export { base_url, getHomeScreen };
