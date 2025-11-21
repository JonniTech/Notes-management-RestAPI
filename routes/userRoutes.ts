import { Router } from "express";
import { getCurrentUser, getUserProfile, loginUser, registerUser } from "../controllers/userControllers";
import authHandler from "../middlewares/authHandler";

const router = Router()

router.post("/register",registerUser)

router.post("/login",loginUser)

router.get("/current",authHandler,getCurrentUser)

router.get("/profile",authHandler,getUserProfile)

export default router