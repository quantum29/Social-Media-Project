import express from "express"; 
import bodyParser from "body-parser"; //url encoded in js
import mongoose from "mongoose";
import cors from "cors";      // cross origin request -> requesting from abc.com being at cde.com
import dotenv from "dotenv";  // wont be uploaded on github .env file
import multer from "multer";  //for image upload (refer documentation for revision)
import helmet from "helmet";  //secures url request by security headers
import morgan from "morgan";  //morgan logging middleware
import path from "path";  
import { fileURLToPath } from "url";
import { register } from "./controllers/auth.js";
import {createPost} from "./controllers/posts.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js" ;
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";
// authentication is basically when u register and login
// authorization is when u want to make sure someone is logged in so u can perform certain actions 
//middleware 
/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config() ;
const app = express();
// use(): This method is used to bind middleware functions to the application. Middleware functions in Express are functions that have access to the request (req) and response (res) objects and can perform actions on them or modify them before passing control to the next middleware in the chain.
app.use(express.json());
// express.json() is a built-in middleware provided by the Express framework. It's used to parse incoming JSON data in the request body. When a client sends data to your server with a Content-Type of application/json, this middleware will parse the JSON data and make it available in the req.body object for further processing.
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));

// Using body-parser middleware to parse URL-encoded and JSON bodies
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/* ROUTES WITH FILES */
// reason why register is not in the auth folder and its direct in index file as we need to use the middleware upload here , so thats why we have kept in the index file itself 
app.post("/auth/register", upload.single("picture"), register);
// upload.single("picture")  we're going to upload our picture
//  locally into the public/assets folder and this is what's called a middleware because it's in between and occurs before our actual logic of register
// so this is what's the logic of saving our
// user into our database and all the functionality relevant to register but this is a middleware function that we
// can run before it hits that endpoint so this is what we do

app.post("/posts" , verifyToken, upload.single("picture") , createPost) ;

/*ROUTES*/
app.use("/auth" ,authRoutes);
app.use("/users" , userRoutes) ;
app.use("/posts" , postRoutes) ;

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongoose Connected") ;
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));