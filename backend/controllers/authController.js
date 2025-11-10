import jwt from "jsonwebtoken"

//generate jtw token 
export const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"1h"});
}

//register user
export const registerUser=async(req,res)=>{
    
}
//register user
export const loginUser=async(req,res)=>{

}
//register user
export const getUserInfo=async(req,res)=>{

}