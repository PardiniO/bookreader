import { Request, Response } from "express";
import { INote } from "@/interfaces";
import { NoteModel } from "../models";
import { BaseController } from "./baseController";

export class NoteController extends BaseController {
    private noteModel: NoteModel;

    constructor() {
        super();
        this.noteModel = new NoteModel();
    }

    public getAllNotes = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async () => {
            const notes = await this.noteModel.getAllNotes();
            this.sendSuccess(res, 'Notas obtenidas exitosamente', notes);
        });
    };

    public getNoteById = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
        if (!this.isValidId(req.params.id)) {
            this.sendError(res, 'ID inválido', undefined, 400);
            return;
        }

        const note = await this.noteModel.getNoteById(parseInt(req.params.id));
        if (!note) {
            this.sendNotFound(res);
            return;
        }

        this.sendSuccess(res, 'Nota obtenida exitosamente', note);
        });
    };

    public createNote = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
        if (!this.validateRequest(req, res)) return;

        const userId = this.extractUserIdFromToken(req);
        const { idProgress, text, page } = req.body;

        const newNoteData: Omit<INote, 'id'> = {
            idProgress,
            text,
            page: page || undefined,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const createdNote = await this.noteModel.createNote(newNoteData);
        this.sendSuccess(res, 'Nota creada exitosamente', createdNote, 201);
        });
    };

    public updateNote = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
        if (!this.isValidId(req.params.id)) {
            this.sendError(res, 'ID inválido', undefined, 400);
            return;
        }

        if (!this.validateRequest(req, res)) return;

        const noteId = parseInt(req.params.id);
        const updatedData: Partial<Omit<INote, 'id' | 'createdAt'>> = req.body;

        const updatedNote = await this.noteModel.updateNote(noteId, updatedData);
        if (!updatedNote) {
            this.sendNotFound(res);
            return;
        }

        this.sendSuccess(res, 'Nota actualizada exitosamente', updatedNote);
        });
    };

    public deleteNote = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
        if (!this.isValidId(req.params.id)) {
            this.sendError(res, 'ID inválido', undefined, 400);
            return;
        }

        const success = await this.noteModel.deleteNote(parseInt(req.params.id));
        if (!success) {
            this.sendNotFound(res);
            return;
        }

        this.sendSuccess(res, 'Nota eliminada exitosamente');
        });
    };
}