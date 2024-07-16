//input validation
import z from "zod"

export const userSignupValidation = z.object({
    username:z.string(),
    email:z.string().email(),
    fullName:z.string(),
    password:z.string().min(6),
})

export const userSigninValidation = z.object({
    username:z.string(),
    email:z.string().email(),
    password:z.string()
})

export const createTodo = z.object({
    name:z.string(),
    description:z.string()
})

