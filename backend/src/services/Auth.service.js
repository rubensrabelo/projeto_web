const User = require("../models/User");


class UserService {
    async findAll() {
        return await User.find();
    }

    async create(data) {
        const newUser = new User(data);
        
        return await newUser.save();
    }

    async findById(id) {
        return await User.findById(id);
    }
    
    async update(id, data) {
        return await User.findByIdAndUpdate(id, data, { new: true });
    }
};

module.exports = new UserService();