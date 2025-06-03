import express from "express";
import {getMe,signUpUser, loginUser, logoutUser} from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/protectRoute.middleware.js";

const router = express.Router();

router.get("/me", protectRoute,getMe)
router.post("/signup", signUpUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router;                   