import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

/**
 * ES6 module for interacting with MongoDB
 * @returns {Object} An object containing functions to interact with MongoDB, such as connect, close, insert, find, and update.
 */
const mongo = () => {
    // load the environment variables from the .env file
    dotenv.config();

    const { DB_USER, DB_PASSWORD, DB_URL, DB_NAME } = process.env;
    const mongoURL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_URL}/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

    let client;
    let db;

    /**
     * Opens a connection to the MongoDB Atlas database
     * @returns {Promise<void>} resolves once the connection is established
     */
    async function connect() {
        try {
            client = new MongoClient(mongoURL);
            await client.connect();
            db = client.db();

            console.log('Connected to MongoDB');
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Closes the connection to the MongoDB Atlas database
     * @returns {Promise<void>} Resolves once the connection is closed
     */
    async function close() {
        try {
            await client.close();

            console.log('Closed connection to MongoDB');
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Inserts a new document into the specified collection
     * @param {string} collectionName - The name of the collection where data will be inserted
     * @param {Object} data - The data to be inserted into the collection
     * @returns {Promise<void>} Resolves once the document is inserted
     */
    async function insert(collectionName, data) {
        try {
            const collection = db.collection(collectionName);
            await collection.insertOne(data);
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Finds documents in the specified collection based on a query
     * @async
     * @function find
     * @param {string} collectionName - The name of the collection to query
     * @param {Object} [query] - The query object used to filter documents (optional)
     * @returns {Cursor} A MongoDB Cursor object used to iterate over query results
     */
    async function find(collectionName, query) {
        try {
            const collection = db.collection(collectionName);

            if (query) {
                const cursor = await collection.find(query);
                return cursor;
            } else {
                const cursor = await collection.find({});
                return cursor;
            }
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Updates documents in the specified collection
     * @async
     * @function update
     * @param {string} collectionName - The name of the collection to update
     * @param {string} deckIdentifier - The identifier used to find the document to update
     * @param {Object} data - The data to update the document with
     * @returns {Promise<void>} Resolves once the document is updated
     */
    async function update(collectionName, deckIdentifier, data) {
        try {
            const collection = db.collection(collectionName);
            await collection.updateOne(
                { deckId: deckIdentifier },
                { $set: data }
            );
        } catch (err) {
            console.error(err);
        }
    }

    return {
        connect,
        close,
        insert,
        find,
        update
    };
};

export default mongo();
