const UserService = require("../services/UserService");

class UserController {
    async getProfile(req, res) {
        try {
            const user = await UserService.getUserById(req.user.id);
            if(!user) return res.status(404).json({ error: "User not found." });

            res.json(user);
        } catch(err) {
            res.status(500).json({ error: "Server error" });
        }
    }
}

module.exports = new UserController();