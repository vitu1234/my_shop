import "react-native-gesture-handler";
import React from "react";
import SQLite from "react-native-sqlite-storage";

const db = SQLite.openDatabase(
  {
    name: "my_shop_db",
    location: "default",
    version: 2.1,
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

    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS \"user\" ( user_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, first_name TEXT NOT NULL, last_name TEXT NOT NULL, phone TEXT NOT NULL, email TEXT NOT NULL, profile_img TEXT NOT NULL DEFAULT \"noimage.jpg\",access_token TEXT NULL, is_active INTEGER NOT NULL DEFAULT 1, is_verified INTEGER NOT NULL DEFAULT 0)");
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

//delete user related data for logout
const deleteAllUserData = async () => {
  db.transaction((tx) => {
    tx.executeSql(
      "DELETE FROM user",
      [],
      (tx, results) => {
        if (results.rowsAffected > 0) {

        }
      });
  });
};

const saveLoggedInUser = async (user_data) => {
  console.log("Saved USer");
  console.log(user_data);
  deleteAllUserData();
  db.transaction(async (tx) => {
    await tx.executeSql(
      "INSERT INTO user(user_id,first_name,last_name,phone,email,profile_img,is_active,is_verified,access_token) VALUES (?,?,?,?,?,?,?,?,?);",
      [user_data.user_id, user_data.first_name, user_data.last_name, user_data.phone, user_data.email, user_data.profile_img, user_data.is_active, user_data.is_verified, user_data.access_token],
    );
  });


};

//get logged in user
const getLoggedInUser = () => {
  const temp = [];
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM user",
      [],
      (tx, results) => {
        // const len = results.rows.length;
        // console.log(len);
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
      },
    );
  });
  // console.log('taDaa!')
  // console.log(temp)
  return temp;
};


export {
  db,
  saveLoggedInUser,
  getAllCategory,
  getAllProductsHomeScreen,
  deleteAllProducts,
  deleteAllHomescreenProducts,
  deleteAllUserData,
  getLoggedInUser,
};
