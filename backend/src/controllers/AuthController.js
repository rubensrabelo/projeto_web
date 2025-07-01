const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

class AuthController{
    async register(req, res) {
        const { name, email, password, role } = req.body;

        try{
            const existingUser = await User.findOne({ email });
            
            if(existingUser)
                return res.status(400).json({ error: "Email is already in use." });

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({ name, email, password: hashedPassword, role });

            res.status(201).json({
                message: "User created successfully.",
                user: { id: user._id, name: user.name, email: user.email, role: user.role }
            });
        } catch{
            res.status(500).json({ error: "Error registering user" });
        }
    }

    async login(req, res) {
        const { email, password } = req.body;

        try{
            const user = await User.findOne({ email });
            if (!user)
                return res.status(401).json({ error: "Invalid credentials" });

            if (!user.password) 
                return res.status(500).json({ error: "Password is not saved in user." });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch)
                return res.status(401).json({ error: "Incorrect password" });

            const token = jwt.sign(
                { id: user._id, role: user.role },
                JWT_SECRET,
                { expiresIn: '1d' }
            );

            res.json({
                message: "Successful login.",
                token,
                user: { id: user._id, name: user.name, email: user.email, role: user.role }
            });
        } catch(err) {
            console.error('[LOGIN ERROR]', err);
            res.status(500).json({ error: "Login error." });
        }
    }
}

module.exports = new AuthController();