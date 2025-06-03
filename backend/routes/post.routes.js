import express from 'express';
import { protectRoute } from '../middleware/protectRoute.middleware.js';
import { createPost,deletePost } from '../controllers/post.controller.js';
// import { createPost, deletePost, getAllPosts, getPostById, updatePost } from '../controllers/post.controller.js';

const router=express.Router();

router.post("/create",protectRoute, createPost);
// router.post("/like/:id",protectRoute, likeUnlikePost);
// router.post("/comment/:id", protectRoute, commentOnPost);
router.delete("/:id",protectRoute, deletePost);

export default router;