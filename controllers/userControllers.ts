import { prisma } from "../lib/prisma";
import { Request,Response } from "express";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import "dotenv/config"

const generateToken = (id:number,name:string,email:string) => {
    return jwt.sign({id,name,email},process.env.JWT_SECRET as string,{expiresIn:"1h"})
}

// route => POST /api/user/register
// desc => Create new user
// access => public 
const registerUser = expressAsyncHandler(async(req:Request,res:Response) => {
    const {name,email,password} = req.body;

    if(!name || !email || !password){
        res.status(400)
        throw new Error("All fields are mandatory")
    }

    const userExists = await prisma.user.findUnique({
        where:{email}
    })

    if(userExists){
        res.status(400)
        throw new Error("User arleady exists")
    }

    //hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    //create user now men
    const user = await prisma.user.create({
        data:{
            name,
            email,
            password:hashedPassword
        }
    })

    res.status(201).json({
        id:user.id,
        name:user.name,
        email:user.email,
        token:generateToken(user.id,user.name,user.email)
    })
})

// route => POST /api/user/login
// desc => login user
// access => public 
const loginUser = expressAsyncHandler(async(req:Request,res:Response) => {
    const {email,password} = req.body;

    if(!email || !password){
        res.status(400)
        throw new Error("All fields are mandatory")
    }
    
    const user = await prisma.user.findUnique({
        where:{email}
    })

    if(!user){
        res.status(401)
        throw new Error("Invalid email address")
    }

    if(user && (await bcrypt.compare(password,user.password))){
        res.status(200).json({
            id:user.id,
            name:user.name,
            email:user.email,
            token:generateToken(user.id,user.name,user.email)
        })
    }else{
        res.status(403)
        throw new Error("Invalid password")
    }
})

// route => GET /api/user/current
// desc => get current user
// access => private 
const getCurrentUser = expressAsyncHandler(async(req:Request,res:Response) => {
    res.status(200).json((req as any).user)
})

// get all info about user and notes created by user
// route => GET /api/user/profile
// desc => get user profile with notes
// access => private
const getUserProfile = expressAsyncHandler(async(req:Request,res:Response) => {
    const userId = (req as any).user!.id;

    const userWithNotes = await prisma.user.findUnique({
        // always dont return password to client
        where:{id:userId},
        select:{
            id:true,
            name:true,
            email:true,
            notes:true
        }
    })

    if(!userWithNotes){
        res.status(404)
        throw new Error("User not found")
    }

    res.status(200).json(userWithNotes)
})

export {registerUser,loginUser,getCurrentUser, getUserProfile}
