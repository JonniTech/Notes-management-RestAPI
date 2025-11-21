import { Request,Response } from "express"
import { prisma } from "../lib/prisma"
import expressAsyncHandler from "express-async-handler"

// route => GET /api/notes 
// desc => Get all notes
// access => private
const getAllNotes = expressAsyncHandler(async(req:Request,res:Response) => {
    const notes = await prisma.note.findMany({
        where:{authorId:(req as any).user.id} // only fetch notes for the logged-in user
    })

    if(!notes ||  notes.length === 0) {
        res.status(404)
        throw new Error("No notes found")
    }

    res.status(200).json(notes)
})

// route => GET /api/notes/:id
// desc => Get a single notes by id
// access => private
const getNoteById = expressAsyncHandler(async(req:Request,res:Response) => {
    const id = parseInt(req.params.id);

    const note = await prisma.note.findUnique({
        where:{id:id}
    })

    if(!note || note.authorId !== (req as any).user!.id) { // ensure the note belongs to the logged-in user
        res.status(404)
        throw new Error("Note not found")
    }

    res.status(200).json(note)
})

// route => POST /api/notes
// desc => Create a new note
// access => private
const createNewNote = expressAsyncHandler(async(req:Request,res:Response) => {
    const {title,content} = req.body;

    if(!title || !content){
        res.status(400)
        throw new Error("All fields are mandatory")
    }

    const note =  await prisma.note.create({
        data:{
            title,
            content,
            authorId:(req as any).user!.id
        }
    })

    res.status(201).json(note);
})

// route => POST /api/notes
// desc => Create a new note
// access => private
const updateNote = expressAsyncHandler(async(req:Request,res:Response) => {

    const id = parseInt(req.params.id);
    const {title,content} = req.body;

    const existingNote = await prisma.note.findUnique({
        where:{id:id}
    })

    if(!existingNote || existingNote.authorId !== (req as any).user!.id) { // ensure the note belongs to the logged-in user
        res.status(404)
        throw new Error("Note not found")
    }
    
    const note = await prisma.note.update({
        where:{id:id},
        data:{
            title,
            content
        }
    })

    res.status(200).json(note);
})

// route => DELETE /api/notes/:id
// desc => Delete a note by id
// access => private
const deleteNote = expressAsyncHandler(async(req:Request,res:Response) => {
    const id = parseInt(req.params.id);

    const existingNote = await prisma.note.findUnique({ // check if note exists
        where:{id:id}
    })

    if(!existingNote || existingNote.authorId !== (req as any).user!.id) { // ensure the note belongs to the logged-in user
        res.status(404)
        throw new Error("Note not found")
    }

    const note = await prisma.note.delete({
        where:{id:id}
    })

    res.status(200).json({message:"Note deleted successfully"})
})

export {getAllNotes,getNoteById,createNewNote,updateNote,deleteNote}