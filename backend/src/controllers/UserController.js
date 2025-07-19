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

    async update(req, res) {
    const userId = req.user.id;
    const updateData = req.body;

    try {
      const updatedUser = await UserService.update(userId, updateData);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found." });
      }

      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({ error: "Error updating user." });
    }
  }
}

module.exports = new UserController();