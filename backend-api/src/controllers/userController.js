import dbClient from "../config/database.js";

class UsersController {
    async getUsers(req, res){
        // console.log(dbClient.db);
        const users = await dbClient.db.collection('users').find();
        return res.status(200).json({"users": users });
    }

    async getUserById(req, res) {
        const { id } = req.params
        return res.status(200).json({ "User": id })
    }
}

const userController = new UsersController();

export default userController;