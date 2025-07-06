import mongo from "mongodb";
import mongoose from "mongoose";

const host = process.env.DB_HOST || '127.0.0.1';
const port = process.env.DB_PORT || 27017;
const database = process.env.DB_DATABASE || 'ticquette';
const uri = `mongodb://${host}:${port}/${database}`;
// const mclient = new mongodb.MongoClient(uri);
// console.log(mclient.connect());

class DBClient {
    constructor() {
        try {
            mongoose.connect(uri);
            console.log("Mongodb connected")
        } catch (error) {
            console.log(`Mongodb not connected: ${error}`);
        }
  
    }
}

const dbClient = new DBClient();
export default dbClient;