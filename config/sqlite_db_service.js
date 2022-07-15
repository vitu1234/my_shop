import SQLite, {enablePromise, openDatabase, SQLiteDatabase} from 'react-native-sqlite-storage';

// enablePromise(true);

export const getDatabaseConnection = async () => {
    const db = await SQLite.openDatabase(
        {
            name: 'MainDB',
            location: 'default',
        },
        () => {
        },
        error => {
            console.log(error);
        },
    );

    return db;
};

export const createCartTable = (db) => {
    db.transaction((tx) => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS "cart" (\n' +
            '\t"id"\tINTEGER NOT NULL,\n' +
            '\t"product_id"\tINTEGER NOT NULL,\n' +
            '\t"product_name"\tTEXT NOT NULL,\n' +
            '\t"img_url"\tTEXT NOT NULL,\n' +
            '\t"product_price"\tTEXT NOT NULL,\n' +
            '\t"qty"\tINTEGER NOT NULL,\n' +
            '\tPRIMARY KEY("id" AUTOINCREMENT)\n' +
            ');',
        );
    });
};

export const cartCartCounter = (db) => {
    //update cart counter
    db.transaction((tx) => {
        tx.executeSql(
            'SELECT * FROM cart',
            [],
            (tx, results) => {
                return results.rows.length;
            },
        );
    });
};


export const allCartProducts = (db) => {
    db.transaction(function (txn) {
        txn.executeSql(
            'SELECT name FROM sqlite_master WHERE type=\'table\' AND name=\'table_user\'',
            [],
            function (tx, res) {
                console.log('item:', res.rows.length);
                if (res.rows.length === 0) {
                    txn.executeSql('DROP TABLE IF EXISTS table_user', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS table_user(user_id INTEGER PRIMARY KEY AUTOINCREMENT, user_name VARCHAR(20), user_contact INT(10), user_address VARCHAR(255))',
                        [],
                    );
                }
            },
        );
    });

};
