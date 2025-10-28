import { Router } from "express";
import { ReadingProgressController } from "../controllers/index";
import { AuthMiddleware, ValidationMiddleware } from "../middlewares";

export class ProgressRouter {
    public router: Router;
    private progressController: ReadingProgressController;

    constructor() {
        this.router = Router();
        this.progressController = new ReadingProgressController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Rutas protegidas
        // Obtener por ID
        this.router.get(
            '/:id',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validateIdParam,
            this.progressController.getProgressById
        );
        
        // Crear un nuevo progreso de lectura
        this.router.post(
            '/',
            AuthMiddleware.authenticate,
            this.progressController.createProgress
        );
        
        // Actualizar progreso existente
        this.router.put(
            '/:id',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validateIdParam,
            this.progressController.updateProgress
        );

        this.router.delete(
            '/:id', 
            AuthMiddleware.authenticate,
            ValidationMiddleware.validateIdParam,
            this.progressController.deleteProgress
        );
    }

    public getRouter(): Router {
        return this.router;
    }
}