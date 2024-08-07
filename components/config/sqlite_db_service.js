import "react-native-gesture-handler";

import * as SQLite from 'expo-sqlite';


// Function to get the database connection
export const connectToDatabase = async () => {

    return await SQLite.openDatabaseAsync('databaseName');

}

// const db = await connectToDatabase()
// Function to create tables
export const createTables =  async (db) => {
     await db.withExclusiveTransactionAsync(async () => {
         await db.execAsync(`
            CREATE TABLE IF NOT EXISTS cart (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                product_id INTEGER NOT NULL,
                product_name TEXT NOT NULL,
                product_price TEXT NOT NULL,
                qty INTEGER NOT NULL,
                img_url TEXT NOT NULL
            );
        `);
         await db.execAsync(`
            CREATE TABLE IF NOT EXISTS category (
                category_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                category_name TEXT NOT NULL
            );
        `);
         await db.execAsync(`
            CREATE TABLE IF NOT EXISTS products_homescreen (
                product_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                category_id INTEGER NOT NULL,
                product_name TEXT NOT NULL,
                qty INTEGER NOT NULL,
                price TEXT NOT NULL,
                img_url TEXT NOT NULL DEFAULT "noimage.jpg",
                product_description TEXT
            );
        `);
         await db.execAsync(`
            CREATE TABLE IF NOT EXISTS product (
                product_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                category_id INTEGER NOT NULL,
                product_name TEXT NOT NULL,
                qty INTEGER NOT NULL,
                price TEXT NOT NULL,
                img_url TEXT NOT NULL DEFAULT "noimage.jpg",
                product_description TEXT,
                category_name TEXT NOT NULL
            );
        `);
         await db.execAsync(`
            CREATE TABLE IF NOT EXISTS user (
                user_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                phone TEXT NOT NULL,
                email TEXT NOT NULL,
                profile_img TEXT NOT NULL DEFAULT "noimage.jpg",
                access_token TEXT,
                is_active INTEGER NOT NULL DEFAULT 1,
                is_verified INTEGER NOT NULL DEFAULT 0
            );
        `);
     });
};
// Function to delete all home screen products
const deleteAllHomescreenProducts = async (db) => {
    db.transactionAsync((tx) => {
        tx.executeSqlAsync("DELETE FROM category");
        tx.executeSqlAsync("DELETE FROM products_homescreen");
    });
};

// Function to delete all products
const deleteAllProducts = async () => {
    // db.transaction((tx) => {
    //     tx.executeSql("DELETE FROM category");
    //     tx.executeSql("DELETE FROM product");
    // });
};

// Function to get all categories
const getAllCategory = (callback) => {
    // db.transaction((tx) => {
    //     tx.executeSql("SELECT * FROM category", [], (tx, results) => {
    //         const categories = [];
    //         for (let i = 0; i < results.rows.length; i++) {
    //             categories.push(results.rows.item(i));
    //         }
    //         callback(categories);
    //     });
    // });
};

// Function to get all products on the home screen
const getAllProductsHomeScreen = (callback) => {
    // db.transaction((tx) => {
    //     tx.executeSql("SELECT * FROM products_homescreen", [], (tx, results) => {
    //         const products = [];
    //         for (let i = 0; i < results.rows.length; i++) {
    //             products.push(results.rows.item(i));
    //         }
    //         callback(products);
    //     });
    // });
};

// Function to delete all user data
const deleteAllUserData = async () => {
    // db.transaction((tx) => {
    //     tx.executeSql("DELETE FROM user");
    // });
};

// Function to save logged-in user data
const saveLoggedInUser = async (user_data) => {
    await deleteAllUserData();
    // db.transaction((tx) => {
    //     tx.executeSql(
    //         `INSERT INTO user (user_id, first_name, last_name, phone, email, profile_img, is_active, is_verified, access_token)
    //   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    //         [user_data.user_id, user_data.first_name, user_data.last_name, user_data.phone, user_data.email, user_data.profile_img, user_data.is_active, user_data.is_verified, user_data.access_token]
    //     );
    // });
};

// Export functions
export {
    // db,
    saveLoggedInUser,
    getAllCategory,
    getAllProductsHomeScreen,
    deleteAllProducts,
    deleteAllHomescreenProducts,
    deleteAllUserData,
};

