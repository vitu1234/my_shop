import "react-native-gesture-handler";
import React from "react";
import SQLite from "react-native-sqlite-storage";
import {openDatabaseSync} from "expo-sqlite";

// Initialize a variable to hold the database connection
let db = null;

// Function to get the database connection
const connectToDatabase = async (databaseName, options) => {
    try {
        // Use the provided databaseName and options
        const db = openDatabaseSync("dbname.db");
        console.log("CONNECTED DB");
        // Return the connected database
        return db;
    } catch (error) {
        console.error("Could not connect to database", error);
        throw new Error("Could not connect to database");
    }
};

// Function to create tables
const createTables = (db) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS cart (
                    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                    product_id INTEGER NOT NULL,
                    product_name TEXT NOT NULL,
                    product_price TEXT NOT NULL,
                    qty INTEGER NOT NULL,
                    img_url TEXT NOT NULL
                );`,
                [],
                () => {
                    tx.executeSql(
                        `CREATE TABLE IF NOT EXISTS category (
                            category_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                            category_name TEXT NOT NULL
                        );`,
                        [],
                        () => {
                            tx.executeSql(
                                `CREATE TABLE IF NOT EXISTS products_homescreen (
                                    product_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                                    category_id INTEGER NOT NULL,
                                    product_name TEXT NOT NULL,
                                    qty INTEGER NOT NULL,
                                    price TEXT NOT NULL,
                                    img_url TEXT NOT NULL DEFAULT "noimage.jpg",
                                    product_description TEXT
                                );`,
                                [],
                                () => {
                                    tx.executeSql(
                                        `CREATE TABLE IF NOT EXISTS product (
                                            product_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                                            category_id INTEGER NOT NULL,
                                            product_name TEXT NOT NULL,
                                            qty INTEGER NOT NULL,
                                            price TEXT NOT NULL,
                                            img_url TEXT NOT NULL DEFAULT "noimage.jpg",
                                            product_description TEXT,
                                            category_name TEXT NOT NULL
                                        );`,
                                        [],
                                        () => {
                                            tx.executeSql(
                                                `CREATE TABLE IF NOT EXISTS user (
                                                    user_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                                                    first_name TEXT NOT NULL,
                                                    last_name TEXT NOT NULL,
                                                    phone TEXT NOT NULL,
                                                    email TEXT NOT NULL,
                                                    profile_img TEXT NOT NULL DEFAULT "noimage.jpg",
                                                    access_token TEXT,
                                                    is_active INTEGER NOT NULL DEFAULT 1,
                                                    is_verified INTEGER NOT NULL DEFAULT 0
                                                );`,
                                                [],
                                                () => resolve(),
                                                (error) => {
                                                    console.error("Error creating user table", error);
                                                    reject(new Error("Error creating tables"));
                                                }
                                            );
                                        },
                                        (error) => {
                                            console.error("Error creating product table", error);
                                            reject(new Error("Error creating tables"));
                                        }
                                    );
                                },
                                (error) => {
                                    console.error("Error creating products_homescreen table", error);
                                    reject(new Error("Error creating tables"));
                                }
                            );
                        },
                        (error) => {
                            console.error("Error creating category table", error);
                            reject(new Error("Error creating tables"));
                        }
                    );
                },
                (error) => {
                    console.error("Error creating cart table", error);
                    reject(new Error("Error creating tables"));
                }
            );
        });
    });
};

// Function to delete all home screen products
const deleteAllHomescreenProducts = async (db) => {

    if (db == null) {
        throw new Error('Database connection is not initialized.');
    }
    console.log("1deleting in deleteAllHomescreenProducts")
    await db.executeSql("DELETE FROM category");
    console.log("2deleting in deleteAllHomescreenProducts")
    db.executeSql("DELETE FROM products_homescreen");

    console.log("ddddddeleting in deleteAllHomescreenProducts")
};

// Function to delete all products
const deleteAllProducts = async (db) => {
    await db.transaction((tx) => {
        tx.executeSql("DELETE FROM category");
        tx.executeSql("DELETE FROM product");
    });
};

// Function to get all categories
const getAllCategory = (db,callback) => {
    db.transaction((tx) => {
        tx.executeSql("SELECT * FROM category", [], (tx, results) => {
            const categories = [];
            for (let i = 0; i < results.rows.length; i++) {
                categories.push(results.rows.item(i));
            }
            callback(categories);
        });
    });
};

// Function to get all products on the home screen
const getAllProductsHomeScreen = (db, callback) => {
    db.transaction((tx) => {
        tx.executeSql("SELECT * FROM products_homescreen", [], (tx, results) => {
            const products = [];
            for (let i = 0; i < results.rows.length; i++) {
                products.push(results.rows.item(i));
            }
            callback(products);
        });
    });
};

// Function to delete all user data
const deleteAllUserData = async (db) => {
    db.transaction((tx) => {
        tx.executeSql("DELETE FROM user");
    });
};

// Function to save logged-in user data
const saveLoggedInUser = async (db, user_data) => {
    await deleteAllUserData();
    db.transaction((tx) => {
        tx.executeSql(
            `INSERT INTO user (user_id, first_name, last_name, phone, email, profile_img, is_active, is_verified, access_token)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [user_data.user_id, user_data.first_name, user_data.last_name, user_data.phone, user_data.email, user_data.profile_img, user_data.is_active, user_data.is_verified, user_data.access_token]
        );
    });
};



// Initialize the database and create tables
const initializeDatabase = async () => {
    try {
        await connectToDatabase();
        if (db) {
            await createTables(db);
            console.log("Database initialized and tables created.");
        }

    } catch (error) {
        console.error("Error initializing database", error);
    }
};

// Export functions and variables
export {
    initializeDatabase,
    db,
    saveLoggedInUser,
    getAllCategory,
    getAllProductsHomeScreen,
    deleteAllProducts,
    deleteAllHomescreenProducts,
    deleteAllUserData
};
