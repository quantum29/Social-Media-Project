import express from "express";
import { login } from "../controllers/auth.js";

const router = express.Router();
// A router is like a mini Express application that you can use to define routes, middleware, and handle HTTP requests independently
router.post("/login", login);

export default router;
// yeh router hi udhar authRoutes hai (index page pe)