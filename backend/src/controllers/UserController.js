const UserService = require("../services/UserService");

class UserController {
  async getProfile(req, res) {
    try {
      const user = await UserService.getUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json({ error: "Server error." });
    }
  }

  async update(req, res) {
    try {
      const updatedUser = await UserService.update(req.user.id, req.body);
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
