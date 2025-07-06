import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    id: String,
    name: String,
    emaill: String,
    walledAddress: String
});

const User = mongoose.model('User', userSchema);

export default User;