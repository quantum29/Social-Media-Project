import bcrypt from "bcrypt";
// bcrypt used for encrypting the password
import jwt from "jsonwebtoken";
// jwt gives a way to send user a web token that they can use for authorization
import User from "../models/User.js";
// from the frontend we are going to have to send an object that has these parameters 
export const register = async (req, res) => {
  
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        picturePath,
        friends,
        location,
        occupation,
      } = req.body;
  
      const salt = await bcrypt.genSalt();
      // create a random salt provided by bcrypt
      const passwordHash = await bcrypt.hash(password, salt);
  
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: passwordHash,
        picturePath,
        friends,
        location,
        occupation,
        viewedProfile: Math.floor(Math.random() * 10000),
        impressions: Math.floor(Math.random() * 10000),
      });
      const savedUser = await newUser.save();
    //   .save comes from mongoDB 
    console.log("New User Saved") ;
      res.status(201).json(savedUser);
    //   In Express.js, the res.json() method is used to send a JSON response to an HTTP request. It takes an //object// as an argument, serializes it to JSON, and sends it as the response to the client.
      // note while writing res.json it automatically sets to status respsone to 200 to avoid that we can chain as .status(some other http code)
    } catch (err) {
      res.status(500).json({ error: err.message });
      // this err.message is the error message tha the mongoDB has returned 
    }
  };
// flow of register function 
// we will encrypt the password , we are going to save it and after we save it  
// and when the user tries to log in they're going to provide the password we are going to salt it again and
// we're going to make sure that's the
// correct one and after that we're going to give them a Json web token

/* LOGGING IN */
export const login = async (req, res) => {
  // console.log("here");
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });
      if (!user) return res.status(400).json({ msg: "User does not exist. " });
  
      const isMatch = await bcrypt.compare(password, user.password);
      // they gonna use the same salt to compare whether those two turned out to be the same hash 
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      delete user.password;
      res.status(200).json({ token, user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };