import { Router } from "express";
import { LibraryController } from "../controllers/library/libraryController";
import { AuthMiddleware, ValidationMiddleware } from "../middlewares";

export class LibraryRouter {
    public router: Router;
    private libraryController: LibraryController;

    constructor() {
        this.router = Router();
        this.libraryController = new LibraryController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Rutas públicas
        // Obtener por ID
        this.router.get(
            '/:id',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validateIdParam,
            this.libraryController.getLibraryById
        );
        
        // Obtener por usuario
        this.router.get(
            '/user/:userId',
            AuthMiddleware.authenticate,
            this.libraryController.getLibraryByUserId
        );
        
        this.router.post(
            '/',
            AuthMiddleware.authenticate,
            this.libraryController.createLibrary
        );

        this.router.put(
            '/:id',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validateIdParam,
            this.libraryController.updateLibrary
        );

        this.router.delete(
            '/:id',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validateIdParam,
            this.libraryController.deleteLibrary
        );
    }

    public getRouter(): Router {
        return this.router;
    }
}