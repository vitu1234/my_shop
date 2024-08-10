import "react-native-gesture-handler";

import * as SQLite from 'expo-sqlite';


// Function to get the database connection
export const connectToDatabase = async () => {

    return await SQLite.openDatabaseAsync('databaseNameaaa');

}

// const db = await connectToDatabase()
// Function to create tables
export const createTables = async (db) => {
    await db.withExclusiveTransactionAsync(async () => {
        await db.execSync(`
            CREATE TABLE IF NOT EXISTS product (
                product_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                product_name TEXT NOT NULL,
                likes INTEGER NOT NULL,
                cover TEXT NOT NULL,
                product_description TEXT
            );
        `);

        await db.execSync(`
            CREATE TABLE IF NOT EXISTS category (
                category_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                category_name TEXT NOT NULL,
                category_description TEXT           
            );
        `);
        await db.execSync(`
            CREATE TABLE IF NOT EXISTS sub_category (
                sub_category_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                category_id INTEGER NOT NULL,
                sub_category_name TEXT NOT NULL,
                sub_category_description TEXT           
            );
        `);
        await db.execSync(`
            CREATE TABLE IF NOT EXISTS product_sub_categories (
                product_sub_category_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                sub_category_id INTEGER NOT NULL,
                category_id INTEGER NOT NULL,
                product_id INTEGER NOT NULL,
                sub_category_name TEXT NOT NULL,
                category_name TEXT NOT NULL,
                sub_category_description TEXT           
            );
        `);

        await db.execSync(`
            CREATE TABLE IF NOT EXISTS product_attributes (
                product_attributes_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                product_id INTEGER NOT NULL,
                product_attributes_default INTEGER NOT NULL,
                product_attributes_name TEXT NOT NULL,
                product_attributes_value TEXT NOT NULL,
                product_attributes_price TEXT NOT NULL,
                product_attributes_stock_qty INTEGER NOT NULL,
                product_attributes_summary TEXT           
            );
        `);

        await db.execSync(`
            CREATE TABLE IF NOT EXISTS product_images (
                product_images_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                product_id INTEGER NOT NULL,
                img_url TEXT NOT NULL
            );
        `);

        
        await db.execSync(`
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

        // await db.execSync(`
        //     CREATE TABLE IF NOT EXISTS category (
        //         product_images_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        //         category_name TEXT NOT NULL,
        //         img_url TEXT
        //     );
        // `);
        /*
                await db.execSync(`
                    CREATE TABLE IF NOT EXISTS cart (
                        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                        product_id INTEGER NOT NULL,
                        product_name TEXT NOT NULL,
                        product_price TEXT NOT NULL,
                        qty INTEGER NOT NULL,
                        img_url TEXT NOT NULL
                    );
                `);

                await db.execSync(`
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


         */
    });


};
// Function to delete all home screen products
const deleteAllHomescreenProducts = async (db) => {
    await db.withExclusiveTransactionAsync((tx) => {
        tx.execSync("DELETE FROM category");
        tx.execSync("DELETE FROM products_homescreen");
    });
};

// Function to delete all products
const deleteAllProducts = async (db) => {
    await db.withExclusiveTransactionAsync((tx) => {
        tx.execSync("DELETE FROM category");
        tx.execSync("DELETE FROM product");
    });
};

// Function to get all categories
const getAllCategory = async (db, callback) => {
    await db.withExclusiveTransactionAsync((tx) => {
        tx.execSync("SELECT * FROM category", [], (tx, results) => {
            const categories = [];
            for (let i = 0; i < results.rows.length; i++) {
                categories.push(results.rows.item(i));
            }
            callback(categories);
        });
    });
};

// Function to get all products on the home screen
const getAllProductsHomeScreen = async (db, callback) => {
    await db.withExclusiveTransactionAsync((tx) => {
        tx.execSync("SELECT * FROM products_homescreen", [], (tx, results) => {
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
    db.execSync("DELETE FROM user");
};

// Function to save logged-in user data
const saveLoggedInUser = async (db, user_data) => {
    await deleteAllUserData(db);
    await db.withExclusiveTransactionAsync((tx) => {
        tx.prepareAsync(
            `INSERT INTO user (user_id, first_name, last_name, phone, email, profile_img, is_active, is_verified, access_token)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [user_data.user_id, user_data.first_name, user_data.last_name, user_data.phone, user_data.email, user_data.profile_img, user_data.is_active, user_data.is_verified, user_data.access_token]
        );
    });
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

