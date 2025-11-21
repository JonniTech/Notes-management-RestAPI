import { Router } from "express";
import { createNewNote, deleteNote, getAllNotes, getNoteById, updateNote } from "../controllers/notesControllers";
import authHandler from "../middlewares/authHandler";

const router = Router()

router.use(authHandler)

router.get("/",getAllNotes)

router.get("/:id",getNoteById)

router.post("/",createNewNote)

router.put("/:id",updateNote) 

router.delete("/:id",deleteNote) 

export default router