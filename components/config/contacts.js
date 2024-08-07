export const addContact = async (db, contact) => {
    const insertQuery = `
   INSERT INTO Contacts (firstName, name, phoneNumber)
   VALUES (?, ?, ?)
 `
    const values = [
        contact.firstName,
        contact.name,
        contact.phoneNumber,
    ]
    try {
        return db.executeSql(insertQuery, values)
    } catch (error) {
        console.error(error)
        throw Error("Failed to add contact")
    }
}


export const getContacts = async (db) => {
    try {
        const contacts = []
        const results = await db.executeSql("SELECT * FROM Contacts")
        results?.forEach((result) => {
            for (let index = 0; index < result.rows.length; index++) {
                contacts.push(result.rows.item(index))
            }
        })
        return contacts
    } catch (error) {
        console.error(error)
        throw Error("Failed to get Contacts from database")
    }
}



export const updateContact = async (
    db,
    updatedContact
) => {
    const updateQuery = `
    UPDATE Contacts
    SET firstName = ?, name = ?, phoneNumber = ?
    WHERE id = ?
  `
    const values = [
        updatedContact.firstName,
        updatedContact.name,
        updatedContact.phoneNumber,
        updatedContact.id,
    ]
    try {
        return db.executeSql(updateQuery, values)
    } catch (error) {
        console.error(error)
        throw Error("Failed to update contact")
    }
}
export const deleteContact = async (db, contact) => {
    const deleteQuery = `
    DELETE FROM Contacts
    WHERE id = ?
  `
    const values = [contact.id]
    try {
        return db.executeSql(deleteQuery, values)
    } catch (error) {
        console.error(error)
        throw Error("Failed to remove contact")
    }
}
