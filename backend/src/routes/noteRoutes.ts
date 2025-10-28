import { Router } from "express";
import { NoteController } from "../controllers/file/noteController";
import { AuthMiddleware, ValidationMiddleware } from "../middlewares";

export class NoteRouter {
    public router: Router;
    private noteController: NoteController;

    constructor() {
        this.router = Router();
        this.noteController = new NoteController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Rutas públicas
        // Obtener todas las notas
        this.router.post(
            '/',
            ValidationMiddleware.validatePaginationQuery,
            this.noteController.getNoteById
        );

        // Obtener por ID
        this.router.get(
            '/:id',
            ValidationMiddleware.validatePaginationQuery,
            this.noteController.getNoteById
        );

        // Rutas protegidas
        // Obtener por usuario
        this.router.get(
            '/user/:userId',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validateIdParam,
            this.noteController.updateNote
        );

        // Obtener por libro
        this.router.get(
            '/book/:bookId',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validateIdParam,
            this.noteController.deleteNote
        );

        // Crear nota
        this.router.post(
            '/:id',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validateIdParam,
            this.noteController.updateNote
        );

        this.router.delete(
            '/:id',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validateIdParam,
            this.noteController.deleteNote
        );
    }

    public getRouter(): Router {
        return this.router;
    }
}