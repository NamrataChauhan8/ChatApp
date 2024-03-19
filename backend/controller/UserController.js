// const user = require("../model/User");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const dotenv =require('dotenv') ;
// dotenv.config();
// const secretKey=process.env.SECRET_KEY;
const {user,jwt,dotenv,config,secretKey}=require("../config/Constant");

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userExist = await user.findOne({ email: req.body.email });
    if (userExist) {
      return res.status(400).json({ error: "Email is already exist" });
    } else {
      const hashPwd = await bcrypt.hash(password, 10);

      const newUser = new user({ username, email, password: hashPwd });
      await newUser.save();

      res.status(200).json({ message: "User Signed Up Successfully!!" });
    }
  } catch (error) {
    console.error("Error Signing Up the user please try again...", error);
    res.status(500).json({ error: "An error occurred while signing up" });
  }
};


const generateToken = (userId) => {
  return jwt.sign({ id: userId }, secretKey, { expiresIn: "1h" });
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await user.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ Message: "Email not found" });
    } else {
      const isMatch = await bcrypt.compare(password, userExist.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Password is invalid" });
      } else {
        const token = generateToken(userExist._id);

        res.header("Authorization", `Bearer ${token}`);
        res.status(200).json({ msg: "Login successful" });
      }
    }
  } catch (error) {
    console.error("Error logging in:", error.message);
    res.status(500).json({ error: "Unable to login, please try again!!!" });
  }
};

module.exports = { signup: signup, login: login };
