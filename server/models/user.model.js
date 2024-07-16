import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique: true,
        lowercase: true,
        trim :true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    password:{
        type:String,
        required:[true,'Password is required']
    },
    refreshToken:{
        type: String,
    },
    todos:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Todo"
    }]
},{timestamps: true}
)

export const User  = mongoose.model("User",userSchema)