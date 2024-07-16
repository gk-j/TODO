import mongoose from "mongoose";

const todoSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    done:{
        type:Boolean,
        default:false
    }
},{timestamps: true})

export const Todo = mongoose.model("Todo",todoSchema)
