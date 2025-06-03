import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import { v2 as cloudinary } from 'cloudinary';

export const createPost= async (req, res) => {
    try {
        const { text } = req.body;
        let { img } = req.body;
        const userId = req.user.id.toString(); // Assuming user ID is stored in req.user by protectRoute middleware
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!text && !img) {
            return res.status(400).json({ message: "Text or image is required" });
        }
        if (img) {
            const uploadResponse = await cloudinary.uploader.upload(img);
            img = uploadResponse.secure_url; // Get the secure URL of the uploaded image
        }
        const newPost = new Post({
            user: userId,
            text,
            img,
        });
        await newPost.save();

        res.status(201).json(newPost);

    } catch (error) {
        console.error("Error creating post:", error);
        return res.status(500).json({ message: "error in create post controller" });    
    }
}

export const deletePost = async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (post.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this post" });
        }

        if (post.img) {
            const imgId= post.img.split('/').pop().split('.')[0]; // Extract the public ID from the image URL
            await cloudinary.uploader.destroy(imgId); // Delete the image from Cloudinary
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post deleted successfully" });
    }
    catch(error){
        console.error("Error deleting post:", error);
        return res.status(500).json({ message: "error in delete post controller" });
    }
}