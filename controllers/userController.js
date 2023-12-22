const User = require("../models/user");
const bcrypt = require("bcryptjs");
const generateToken = require("../middlewares/auth");


// register
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const userExist = await User.findOne({ email: email });

        if (userExist) {
            return res.status(400).json({ msg: "Email already exists" });
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const userCreated = await User.create({
            username,
            email,
            password: encryptedPassword,
        });

        res.status(201).json({
            msg: "Registration Successful",
            token: generateToken.generateAuthToken(userCreated), 
            userId: userCreated._id.toString(),
            userName:user.username
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user with the provided email exists
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(401).json({ msg: "Invalid email or password" });
        }

        // Check if the provided password matches the hashed password stored in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ msg: "Invalid email or password" });
        }

        // Generate and return a JWT token upon successful login
        const token = generateToken.generateAuthToken(user);
        res.status(200).json({
            msg: "Login Successful",
            token: token,
            userId: user._id.toString(),
            userName:user.username
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { register,login };
