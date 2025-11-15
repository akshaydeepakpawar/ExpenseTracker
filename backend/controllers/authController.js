import User from '../models/User.js'
import jwt from "jsonwebtoken"

//generate jtw token 
export const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"1h"});
}

//register user
export const registerUser=async(req,res)=>{
    const {fullName,email,password,profileImageUrl}=req.body;
    if(!fullName || !email || !password){
        return res.status(400).json({message: "All field are required"});
    }
    try{
        //check email already exist
        const exisingUser=await User.findOne({email});
        if(exisingUser){
            return res.status(400).json({message:"Email already exist"});
        }
        const user = await User.create({
            fullName,email,password,profileImageUrl
        });
        res.status(201).json({
            id:user._id,
            user,
            token:generateToken(user._id),
        })
    }
    catch(err){
        res.status(500).json({message:"Error registering user",error:err.message});
    }
}
//login user
export const loginUser=async(req,res)=>{
    const {email,password}=req.body;
    if(!email||!password) {
        return res.status(400).json({message:"All fields are required"})
    }
    try{
        const user=await User.findOne({email});
        if(!user|| !(await user.comparePassword(password))){
            return res.status(400).json({message:"invalid credentials"});
        }
        res.status(200).json({
            id:user._id,
            user,
            token:generateToken(user._id),
        })
    }
    catch(err){
        res.status(500).json({message:"Error Login user",error:err.message});
    }
}
//get user info
export const getUserInfo=async(req,res)=>{
    try{
        const user=await User.findById(req.user.id).select("-password");
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        res.status(200).json(user);
    }
     catch(err){
        res.status(500).json({message:"Error in getting user info",error:err.message});
    }
}