import dbClient from "../config/database.js";
import User from "../models/User.js";

class UsersController {
    async getUsers(req, res){
        // Get all users
        // No authentication check yet
        const users = await User.find();
        return res.status(200).json({ "users": users });
    }

    async getUserById(req, res) {
        // Get a user by Id
        // No authorization check yet
        const { id } = req.params;
        try {
            const user = await User.findById(id);
            return res.status(200).json({ "User": user })   
        } catch (error) {
            console.log(error);
            res.status(504).json({ "error": "Internal server error" });
        }
    }
}

const userController = new UsersController();

export default userController;