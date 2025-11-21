import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { prisma } from "../lib/prisma";
import expressAsyncHandler from "express-async-handler";

interface JwtPayload {
    id:number;
    name:string;
    email:string;
}

// middleware to protect routes
const authHandler = expressAsyncHandler(async(req:Request,res:Response,next:NextFunction) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token,process.env.JWT_SECRET as string) as JwtPayload;

            const user = await prisma.user.findUnique({
                where:{id:decoded.id}
            })

            if(!user){
                res.status(401)
                throw new Error("Not authorized , user not found")
            }

            (req as any).user  = decoded; // attach user to request object
            next();
        } catch (error) {
            res.status(401)
            throw new Error("Not authorized , token failed")
        }
    }

    if(!token){
        res.status(401)
        throw new Error("Not authorized , no token")
    }
})

export default authHandler;
