import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import {generateTokenAndSetCookie} from "../lib/utils/generateToken.js"
export const signUpUser=async(req,res)=>{
    const {username,email,password,fullname}=req.body
    try{
        if(!username || !email || !password || !fullname){
            return res.status(400).json({message:"All fields are required"});
        }
        if(password.length<6){
            return res.status(400).json({message:"Password must be at least 6 characters"});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({message:"Invalid email format"});
        }
        
        const existingUser=await User.findOne({username});
        if(existingUser){
            return res.status(400).json({message:"Username already exists"});
        }

         const existingEmail=await User.findOne({email});
        if(existingEmail){
            return res.status(400).json({message:"Email already exists"});
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const newUser=new User({
            username,
            fullname,
            email,
            password:hashedPassword,
        });
        
        if(newUser){
            
            generateTokenAndSetCookie(newUser._id,res);
            await newUser.save(); 
             res.status(201).json({"message":"User created successfully",
                _id:newUser._id,
                username:newUser.username,
                fullname:newUser.fullname,
                email:newUser.email,
                followers:newUser.followers,
                following:newUser.following,
                profileImg:newUser.profileImg,
                coverImg:newUser.coverImg,
            });

        }else{
            return res.status(400).json({message:"Invalid user data"});
        }

        
    }
    catch(error){
        console.log("signup controller error",error);
        return res.status(500).json({message:"Internal signup controller server error"});
    }
}
export const loginUser=async(req,res)=>{
 const {username,password}=req.body;
 try{
    if(!username || !password){
        return res.status(400).json({message:"All fields are required"});
    }
    const user=await User.findOne({username});
    if(!user){
        return res.status(404).json({message:"User not found"});
    }
    const isPasswordValid=await bcrypt.compare(password,user?.password || "");
    if(!isPasswordValid){
        return res.status(401).json({message:"Invalid credentials"});
    }
    generateTokenAndSetCookie(user._id,res);
     res.status(200).json({
        _id:user._id,
        username:user.username,
        fullname:user.fullname,
        email:user.email,
        followers:user.followers,
        following:user.following,
        profileImg:user.profileImg,
        coverImg:user.coverImg,
 })   
}
catch(error){
    console.log("login controller error",error);
    res.status(500).json({message:"Internal login controller server error"});
}
}

export const logoutUser=async(req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"User logged out successfully"});
    }
        catch(error){
        console.log("logout user error",error);
        res.status(500).json({message:"Internal logout controller server error"});
    }
}


export const getMe=async(req,res)=>{
    try{
        const user=await User.findById(req.user._id).select("-password");
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        return res.status(200).json(user);
    }
    catch(error){
        console.log("getme controller error",error);
        res.status(500).json({message:"Internal getme controller server error"});
    }
}

