import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"


export const verifyJWT = async(req,res,next)=>{
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "")
        if (!token) {
            res.status(401).json({"msg":"Unauthorized request"})
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            res.status(401).json({"msg":"Invalid Access Token"})
        }
    
        req.user = user;
        next()
    } catch (error) {
        res.status(401).json({"msg":error?.message || "Invalid Access Token"})
    }
}