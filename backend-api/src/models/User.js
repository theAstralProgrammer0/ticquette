<<<<<<< HEAD
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
=======
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;

>>>>>>> master
