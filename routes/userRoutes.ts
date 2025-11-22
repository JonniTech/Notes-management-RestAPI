import { Router } from "express";
import { getCurrentUser, getUserProfile, loginUser, registerUser, updateUserProfile } from "../controllers/userControllers";
import authHandler from "../middlewares/authHandler";

const router = Router()

router.post("/register",registerUser)

router.post("/login",loginUser)

router.get("/current",authHandler,getCurrentUser)

router.get("/profile",authHandler,getUserProfile)

router.put("/profile",authHandler,updateUserProfile)

export default router