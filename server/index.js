import express from "express";
import dotenv from "dotenv"
import connectDB from "./db.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import cors from "cors"
import cookieParser  from "cookie-parser";
import { createTodo, userSigninValidation, userSignupValidation } from "./types.js";
import { User } from "./models/user.model.js";
import { verifyJWT } from "./middleware/auth.middleware.js";
import { Todo } from "./models/todo.model.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

dotenv.config({
    path:"./.env"
});
const app = express()
//db-connection
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running on port : ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("MONGO DB connection failed !!!",err);
})


app.use(express.json())
app.use(express.urlencoded({extended:true,limit:"20kb"}));
app.use(express.static("public"));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = await jwt.sign(
            {
                _id: user._id,
                email: user.email,
                username: user.username,
                fullName: user.fullName
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY
            }
        )
        const refreshToken = await jwt.sign(
            {
                _id: user._id,
                
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY
            }
        )
        
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw error
    }
}

app.get("/user",verifyJWT,async(req,res)=>{
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).select("-password -refreshToken")
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({"user":user})

    } catch (error) {
        return res.status(404).json({"error":"Server Error"})
    }
})

app.post("/user/signup",async(req,res)=>{
    const payload = req.body

    const parsedPayload = userSignupValidation.safeParse(payload)
    if(!parsedPayload.success){
        return res.status(411).json({"msg":"You sent the wrong inputs"})
    }
    const {username,email} = payload
    const isUserRegisterd = await User.findOne({
        $or: [{username}, {email}]
    })
    if(isUserRegisterd){
        return res.status(500).json({"msg":"You are already registered"})
 
    }
    const encryptedPassword = await bcrypt.hash(payload.password,10)

    const user = await User.create({
        username:payload.username.toLowerCase(),
        email:payload.email,
        fullName:payload.fullName,
        password:encryptedPassword
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        return res.status(500).json({"msg":"Something went wrong while registering the user"})
    }
    return res.status(200).json({"msg":"User registered Successfully"})

})

app.post("/user/signin",async(req,res)=>{
    const payload  = req.body
    const parsedPayload = userSigninValidation.safeParse(payload)

    if(!parsedPayload.success){
        return res.status(411).json({"msg":"You sent the wrong inputs"})
    }
    const {username,email,password} = payload
    const userName = username.toLowerCase()
    const user = await User.findOne({
        $or: [{userName}, {email}]
    })

    if (!user) {
        return res.status(404).json({"msg":"User does not exist"})
    }
    const isPasswordCorrect = await bcrypt.compare(password,user.password)
    if(!isPasswordCorrect){
        return res.status(401).json({"msg":"Invalid user credentials"})
    }

    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    const options = {
        httpOnly: true,
        secure: false,
        maxAge: 10000000
    }

    res.cookie("accessToken", accessToken)
    res.cookie("refreshToken", refreshToken)
    return res
    .status(200)
    .json({"msg":"User logged In Successfully",
        user: loggedInUser, accessToken, refreshToken
    })
})

app.post("/user/signout",verifyJWT, async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: "" // this removes the field from document
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({"msg":"User logged Out"})

})

app.get("/todos",verifyJWT,async(req,res)=>{
    try {
        const user_id = req.user._id
        const user = await User.findById(user_id).select("-password -refreshToken")
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userTodos = await Todo.find({ _id: { $in: user.todos } });
        if(!userTodos){
            return res.status(411).json({"msg":"no todos found"})
        }
        return res.status(200).json({"todos":userTodos})
    } catch (error) {
        console.log("err getting todos",error)
        res.status(500).json({ error: "Server error" });
    }
})
app.post("/todos",verifyJWT,async(req,res)=>{
    try {
        const payload = req.body
        const parsedPayload = createTodo.safeParse(payload)
        
        if(!parsedPayload.success){
            return res.status(401).json({"msg":"unknown inputs"})
        }
        const {name,description}=payload

        const user_id = req.user._id

        const user = await User.findById(user_id).select("-password -refreshToken")
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const userTodos = await Todo.find({ _id: { $in: user.todos } });
        
        const existingTodo = userTodos.find(todo => todo.name === name);
        if (existingTodo) {
            return res.status(400).json({ error: "Todo with this title already exists for this user" });
        }
        
        const todo = await Todo.create({
            name:name,
            description:description
        })
        user.todos.push(todo._id)
        await user.save()
        const userTodosAfter = await Todo.find({ _id: { $in: user.todos } });
        if(!userTodosAfter){
            return res.status(411).json({"msg":"no todos found"})
        }
        return res.status(200).json({"todos":userTodosAfter})
    } catch (error) {
        console.error("Error creating todo:", error);
        res.status(500).json({ error: "Server error" });
    }
})
app.put("/todo/:todoId",verifyJWT,async(req,res)=>{
    try {
        const todoId = req.params.todoId
        const todo = await Todo.findById(todoId);
        if (!todo) {
            return res.status(500).json({ "msg": "Todo not found" });
        }
        todo.done = !todo.done;
        const updatedTodo = await todo.save();
        const user_id = req.user._id
        const user = await User.findById(user_id).select("-password -refreshToken")
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const userTodosAfter = await Todo.find({ _id: { $in: user.todos } });
        if(!userTodosAfter){
            return res.status(411).json({"msg":"no todos found"})
        }
        return res.status(200).json({"todos":userTodosAfter})
    } catch (error) {
        console.error('Error toggling todo:', error);
        res.status(500).json({ error: "Server error" });
    }

})
app.delete("/todo/:todoId",verifyJWT,async(req,res)=>{
    try {
        const user_id = req.user._id
        const todoId = req.params.todoId;
        
        const user = await User.findById(user_id).select("-password -refreshToken")
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const todoIndex = user.todos.findIndex(t => t.equals(new ObjectId(todoId)));
        if (todoIndex === -1) {
            return res.status(404).json({ error: "Todo not found for this user" });
        }
        
        user.todos.splice(todoIndex, 1);
        await user.save();
        await Todo.deleteOne({_id:todoId})
        res.status(200).json({ message: "Todo deleted successfully" });
    } catch (error) {
        console.error("Error deleting todo:", error);
        res.status(500).json({ error: "Server error" });
    }
})


app.get("/",(req,res)=>{
    res.send("hi")
})


