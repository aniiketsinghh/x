import express from "express"
const router = express.Router();
import {protectRoute} from "../middleware/protectRoute.middleware.js"

import {getUserProfile,followUnfollowUser,getSuggestedUsers,updateUser} from "../controllers/user.controller.js"

router.get("/profile/:username",protectRoute,getUserProfile)
router.get("/suggested",protectRoute,getSuggestedUsers)
router.post("/follow/:id",protectRoute,followUnfollowUser)
router.post("/update",protectRoute,updateUser)


export default router