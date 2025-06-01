import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import connectDB from "./lib/db.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import {v2 as cloudinary} from "cloudinary";

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const app = express();
const PORT= process.env.PORT || 5001;


//full stack connector
app.use(cors());

//for take data from user
app.use(express.json());

//postman meh urlencoded use krne ke liye use kiya
app.use(express.urlencoded({extended: true}));

// used cookie parser for middleware..beacuse in middleware we use requestAnimationFrame.cookie.jwt
app.use(cookieParser());


app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);

connectDB().then(() => {
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
})