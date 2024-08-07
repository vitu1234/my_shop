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
    db
};
