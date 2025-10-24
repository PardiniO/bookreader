import { Router } from "express";
import { ReadingStatusController } from "../controllers/index";
import { AuthMiddleware, ValidationMiddleware } from "../middlewares";

export class ReadingStatusRouter {
    public router: Router;
    private readingStatusController: ReadingStatusController;

    constructor() {
        this.router = Router();
        this.readingStatusController = new ReadingStatusController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Rutas públicas
        // Obtener todos los estados de lectura
        this.router.get(
            '/',
            ValidationMiddleware.validateSearchQuery,
            this.readingStatusController.getAllStatuses
        );

        // Obtener por ID
        this.router.get(
            '/:id',
            ValidationMiddleware.validateIdParam,
            this.readingStatusController.getStatusById
        );

        // Rutas protegidas
        // Crear nuevo estado de lectura
        this.router.post(
            '/',
            AuthMiddleware.authenticate,
            this.readingStatusController.createStatus
        );

        // Actualizar estado de lectura
        this.router.put(
            '/:id',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validateStatusParam,
            this.readingStatusController.updateStatus
        );

        this.router.delete(
            '/:id',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validateIdParam,
            this.readingStatusController.deleteStatus
        );
    }

    public getRouter(): Router {
        return this.router;
    }
}