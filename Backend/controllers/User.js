import User from '../model/User.js'
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "No User exists" });

        }
        // Compare plain password with hashed password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid password",
            });
        }
        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        return res.status(201).json({
            message: "User login successfully",
            token,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" })

    }

}

const signup = async (req, res) => {
    try {
        const { name,email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (user) {
            return res.json({ message: "User already exist" });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const usercreated = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Create JWT token
        const token = jwt.sign(
            {
                id: usercreated._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        return res.status(201).json({
            message: "User created successfully",
            token,
        });




    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" })

    }

}
export {
    login,
    signup
};