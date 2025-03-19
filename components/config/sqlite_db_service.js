import "react-native-gesture-handler";

import * as SQLite from 'expo-sqlite';


export const createTables = async (db) => {

    await db.execAsync('DROP TABLE IF EXISTS product;');
    await db.execAsync(`
            CREATE TABLE IF NOT EXISTS product (
                product_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                product_name TEXT NOT NULL,
                likes INTEGER NOT NULL,
                cover TEXT NOT NULL,
                product_description TEXT
            );
        `);


    await db.execAsync('DROP TABLE IF EXISTS category;');
    await db.execAsync(`
            CREATE TABLE IF NOT EXISTS category (
                category_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                category_name TEXT NOT NULL,
                category_icon TEXT,
                category_description TEXT           
            );
        `);

    await db.execAsync('DROP TABLE IF EXISTS sub_category;');
    await db.execAsync(`
            CREATE TABLE IF NOT EXISTS sub_category (
                sub_category_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                category_id INTEGER NOT NULL,
                sub_category_name TEXT NOT NULL,
                sub_category_description TEXT           
            );
        `);

    await db.execAsync('DROP TABLE IF EXISTS product_sub_category;');
    await db.execAsync(`
            CREATE TABLE IF NOT EXISTS product_sub_category (
                product_sub_category_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                sub_category_id INTEGER NOT NULL,
                category_id INTEGER NOT NULL,
                product_id INTEGER NOT NULL,
                sub_category_name TEXT NOT NULL,
                category_name TEXT NOT NULL,
                sub_category_description TEXT           
            );
        `);

    await db.execAsync('DROP TABLE IF EXISTS product_attributes;');
    await db.execAsync(`
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

    await db.execAsync('DROP TABLE IF EXISTS product_images;');
    await db.execAsync(`
            CREATE TABLE IF NOT EXISTS product_images (
                product_images_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                product_id INTEGER NOT NULL,
                img_url TEXT NOT NULL
            );
        `);

    await db.execAsync('DROP TABLE IF EXISTS product_like;');
    await db.execAsync(`
            CREATE TABLE IF NOT EXISTS product_like (
                product_like_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                product_id INTEGER NOT NULL,
                user_id  INTEGER NOT NULL
            );
        `);

    await db.execAsync('DROP TABLE IF EXISTS cart;');
    await db.execAsync(`
            CREATE TABLE IF NOT EXISTS cart (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                product_attributes_id INTEGER NOT NULL,
                qty INTEGER NOT NULL,
                isChecked INTEGER DEFAULT 0 NOT NULL
            );
        `);

    // await db.execAsync(`
    //         CREATE TABLE IF NOT EXISTS shipping_company (
    //             shipping_company_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    //             shipping_company_name TEXT NOT NULL,
    //             shipping_company_address TEXT NULL
    //         );
    //     `);

    await db.execAsync(`
            CREATE TABLE IF NOT EXISTS product_shipping (
                product_shipping_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                product_id INTEGER NOT NULL,
                shipping_company_id INTEGER NOT NULL,
                shipping_type TEXT NOT NULL,
                shipping_amount TEXT NOT NULL,
                shipping_company_name TEXT NOT NULL,
                shipping_company_address TEXT NULL
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


    /*
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


     */



};


// Function to delete all products
const deleteProducts = async (db) => {
    try {
        const queries = [
            
            "DELETE FROM category",
            "DELETE FROM product_shipping",
            "DELETE FROM sub_category",
            "DELETE FROM product_images",
            "DELETE FROM product_attributes",
            "DELETE FROM product_sub_category",
            "DELETE FROM product",
            "DELETE FROM cart",
        ];
        for (const query of queries) {
            await db.execAsync(query);
        }
    } catch (error) {
        console.error("Error deleting products: ", error);
    }
};


//get product default attribute/item
const getProductDefaultAttribute = async (db, product_id) => {
    const firstRow = await db.getFirstAsync("SELECT * FROM product_attributesproduct_attributes WHERE product_id = $product_id AND product_attributes_default = 1", { $product_id: product_id });
    const data = {
        product_id: firstRow.product_id,
        product_attributes_default: firstRow.product_attributes_default,
        product_attributes_name: firstRow.product_attributes_name,
        product_attributes_value: firstRow.product_attributes_value,
        product_attributes_summary: firstRow.product_attributes_summary,
        product_attributes_price: firstRow.product_attributes_price,
        product_attributes_stock_qty: firstRow.product_attributes_stock_qty,

    }

    return data
    // return firstRow
};


// Function to get all categories
const getAllCategory = async (db, callback) => {
    await db.execAsync("SELECT * FROM category", [], (tx, results) => {
        const categories = [];
        for (let i = 0; i < results.rows.length; i++) {
            categories.push(results.rows.item(i));
        }
        callback(categories);
    });
};

// Function to get all products on the home screen
const getAllProductsHomeScreen = async (db, callback) => {
    await db.execAsync("SELECT * FROM product", [], (tx, results) => {
        const products = [];
        for (let i = 0; i < results.rows.length; i++) {
            products.push(results.rows.item(i));
        }
        callback(products);
    });
};

// Function to delete all user data
const deleteAllUserData = async (db) => {
    db.execAsync("DELETE FROM user");
};

// Function to save logged-in user data
const saveLoggedInUser = async (db, user_data) => {
    await deleteAllUserData(db);
    await db.prepareAsync(
        `INSERT INTO user (user_id, first_name, last_name, phone, email, profile_img, is_active, is_verified, access_token)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [user_data.user_id, user_data.first_name, user_data.last_name, user_data.phone, user_data.email, user_data.profile_img, user_data.is_active, user_data.is_verified, user_data.access_token]
    );
};

// Export functions
export {
    // db,
    saveLoggedInUser,
    getAllCategory,
    getAllProductsHomeScreen,
    deleteProducts,
    deleteAllUserData,
    getProductDefaultAttribute,
};

