const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

class AuthService {
  async register({ firstname, lastname, email, password, role }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("Email is already in use.");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ firstname, lastname, email, password: hashedPassword, role });

    return {
      message: "User created successfully.",
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    };
  }

  async login({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid credentials.");

    if (!user.password) throw new Error("Password is not saved in user.");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Incorrect password.");

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    return {
      message: "Successful login.",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    };
  }
}

module.exports = new AuthService();
