import "react-native-gesture-handler";
import React from "react";
import SQLite from "react-native-sqlite-storage";

const db = SQLite.openDatabase(
  {
    name: "MainDB1",
    location: "default",
    version: 2,
  },
  () => {
    // console.log("DB CREATED");
    createTables();
  },
  error => {
    // console.log(error);
  },
);

const createTables = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS \"cart\" (id	INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,product_id	INTEGER NOT NULL,product_name	TEXT NOT NULL,product_price	TEXT NOT NULL,qty INTEGER NOT NULL, img_url INTEGER NOT NULL)",
    );
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS \"category\" (category_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,category_name	TEXT NOT NULL)",
      );
    });

    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS \"products_homescreen\" ( product_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, category_id INTEGER NOT NULL,product_name TEXT NOT NULL,qty INTEGER NOT NULL,price TEXT NOT NULL,img_url TEXT NOT NULL DEFAULT \"noimage.jpg\",product_description TEXT NULL)");
    });

    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS \"product\" ( product_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, category_id INTEGER NOT NULL,product_name TEXT NOT NULL,qty INTEGER NOT NULL,price TEXT NOT NULL,img_url TEXT NOT NULL DEFAULT \"noimage.jpg\",product_description TEXT NULL,category_name TEXT NOT NULL)");
    });
  });

  // console.log("TABLES CREATED");
};

const deleteAllHomescreenProducts = async () => {
  //delete category
  db.transaction((tx) => {
    tx.executeSql(
      "DELETE FROM category",
      [],
      (tx, results) => {
        if (results.rowsAffected > 0) {

        }
      });
  });

  //delete products homescreen
  db.transaction((tx) => {
    tx.executeSql(
      "DELETE FROM products_homescreen",
      [],
      (tx, results) => {
        if (results.rowsAffected > 0) {

        }
      });
  });
};

const deleteAllProducts = async () => {
  //delete category
  db.transaction((tx) => {
    tx.executeSql(
      "DELETE FROM category",
      [],
      (tx, results) => {
        if (results.rowsAffected > 0) {

        }
      });
  });

  //delete products
  db.transaction((tx) => {
    tx.executeSql(
      "DELETE FROM product",
      [],
      (tx, results) => {
        if (results.rowsAffected > 0) {

        }
      });
  });
};

const getAllCategory = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM category",
      [],
      (tx, results) => {
        const len = results.rows.length;
        // console.log(len)
      },
    );
  });
};

const getAllProductsHomeScreen = () => {

  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM products_homescreen",
      [],
      (tx, results) => {

        // console.log("len");
        const len = results.rows.length;
        // console.log(len);
      },
    );
  });
};

export { db, deleteAllHomescreenProducts, getAllCategory, getAllProductsHomeScreen, deleteAllProducts };
