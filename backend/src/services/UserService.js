const User = require("../models/User");

class UserService {
    async getUserById(id) {
        return await User.findById(id).select("-password");
    }
}

module.exports = new UserService();