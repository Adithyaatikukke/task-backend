const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const registerUser = async(req,res)=>{
    try {
        const {name,email,password,role} = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please provide name, email and password" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User with this email already exists" });
        }
        const user = await User.create({ name, email, password, role });

        res.status(201).json({
            message: "User registered successfully",
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        res.status(200).json({
            message: "Login successful",
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Login failed", error: error.message });
    }
};

const getMe = async (req, res) => {
    res.status(200).json({ user: req.user });
};

const getUsers = async (req,res)=>{
    try {
        const users = await User.find().select("name email role").sort({ name: 1 });
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: "Users not found", error: error.message });
    }
}

const createUser = async(req,res)=>{
    try {
        const {name,email,password,role} = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please provide name, email and password" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User with this email already exists" });
        }
        const user = await User.create({ name, email, password, role });

        res.status(201).json({
            message: "User registered successfully",
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const {name,email,role} = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (name !== undefined) user.name = name;
        if (email !== undefined) user.email = email;
        // if (password !== undefined) user.password = password;
        if (role !== undefined) user.role = role;

        await user.save();
        res.status(200).json({
            message: "User updated successfully",
            user
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to update project", error: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.deleteOne();

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete user", error: error.message });
    }
};

module.exports = { registerUser, loginUser, getMe, getUsers, createUser, updateUser, deleteTask };