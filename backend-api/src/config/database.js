import * as mongodb from "mongodb";
import mongoose from "mongoose";

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 27017;
const database = process.env.DB_DATABASE || 'ticquette';
const uri = `mongodb://${host}:${port}/`;

const client = mongodb.MongoClient;

class DBClient {
    constructor() {
        this.db = null;
        console.log(uri);

        client.connect(uri, {}, (err, client) => {
            if (err) console.log(`Mongodb client not connected ${err}`);
            console.log("Mongo client connected");
            this.db = client.db(database);
            this.db.createCollection('users');
        });
    }
}

const dbClient = new DBClient();
export default dbClient;