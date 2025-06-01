import User from "../models/user.model.js";


//this is for when authentication completed you can get user profile
export const getUserProfile = async (req,res)=>{
    try {
        //i am not using name becuase i want name but i amusing it bcz
        //in routes where we pass id i passed username
        const {username}=req.params
        const user=await User.findOne({username}).select("-password");
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        return res.status(200).json(user);
    } catch (error) {
        console.log("get user profile error",error);
        res.status(500).json({message:"Internal get user profile server error"});
    
    }
}

export const followUnfollowUser=async (req,res)=>{
    try {
		const { id } = req.params;
		const userToModify = await User.findById(id);
		const currentUser = await User.findById(req.user._id);

		if (id === req.user._id.toString()) {
			return res.status(400).json({ error: "You can't follow/unfollow yourself" });
		}

		if (!userToModify || !currentUser) return res.status(400).json({ error: "User not found" });

		const isFollowing = currentUser.following.includes(id);

		if (isFollowing) {
			// Unfollow the user
			await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

			res.status(200).json({ message: "User unfollowed successfully" });
		} else {
			// Follow the user
			await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
			// Send notification to the user
			const newNotification = new Notification({
				type: "follow",
				from: req.user._id,
				to: userToModify._id,
			});

			await newNotification.save();

			res.status(200).json({ message: "User followed successfully" });
		}

    } catch (error) {
        console.log("follow unfollow user error",error);
        res.status(500).json({message:"Internal follow unfollow user server error"});
    
    }
}

export const getSuggestedUsers = async (req, res) => {
    try {
        const userId= req.user._id;

        const usersFollowedByMe=await User.findById(userId).select("following");
        
        const users=await User.aggregate([
            {
                $match:{
                    _id:{$ne: userId}, // Exclude the current user
                },
            },
            {$sample:{size:10}}, // Randomly select 10 users
        ]);
        // Filter out users that are already followed by the current user
        const filteredUsers = users.filter((user) => !usersFollowedByMe.following.includes(user._id));
        const suggestedUsers = filteredUsers.slice(0, 4); // Limit to 4 users
        suggestedUsers.forEach((user)=>(user.password=null)); // Remove password field from suggested users
        res.status(200).json(suggestedUsers);
    } catch (error) {
        console.log("get suggested users error", error);
        res.status(500).json({ message: "Internal get suggested users server error" });
        
    }
}