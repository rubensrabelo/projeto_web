const User = require("../models/User");

class UserService {
    async getUserById(id) {
        return await User.findById(id).select("-password");
    }

    async update(userId, data) {
    const user = await User.findById(userId);
    if (!user) 
        return null;

    const allowedFields = ["firstname", "lastname", "email", "password"];
    let updated = false;

    for (const field of allowedFields) {
      if (data[field] !== undefined && user[field] !== data[field]) {
        user[field] = data[field];
        updated = true;
      }
    }

    if (data.password && data.password.trim() !== "") {
      user.password = data.password;
      updated = true;
    }

    if (updated) {
      await user.save();
    }

    const { password, ...safeUser } = user.toObject();
    return safeUser;
  }
}

module.exports = new UserService();