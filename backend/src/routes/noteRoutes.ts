import { Router } from "express";
import { NoteController } from "../controllers/file/noteController";
import { ValidationMiddleware } from "../middlewares";

export class NoteRouter {
    public router: Router;
    private noteController: NoteController;

    constructor() {
        this.router = Router();
        this.noteController = new NoteController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post('/', ValidationMiddleware.validateNoteCreate, this.noteController.create);
        this.router.get('/:id', this.noteController.getById);
        this.router.put('/:id', ValidationMiddleware.validateNoteUpdate, this.noteController.update);
        this.router.delete('/:id', this.noteController.delete);
        this.router.get('/progress/:progressId', this.noteController.getByProgress);
        this.router.get('/search', this.noteController.search);
    }

    public getRouter(): Router {
        return this.router;
    }
}