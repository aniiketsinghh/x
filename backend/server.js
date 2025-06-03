import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./lib/db.js";
import cookieParser from "cookie-parser";
import {v2 as cloudinary} from "cloudinary";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";


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
app.use("/api/posts",postRoutes);
app.use("/api/notifications", notificationRoutes);

connectDB().then(() => {
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
})