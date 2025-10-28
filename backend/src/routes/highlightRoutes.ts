import { Router } from "express";
import { HighlighController } from "../controllers/index";
import { AuthMiddleware, ValidationMiddleware } from "../middlewares";

export class HighlightRouter {
    public router: Router;
    private highlightController: HighlighController;

    constructor() {
        this.router = Router();
        this.highlightController = new HighlighController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Rutas públicas
        // Obtener todos los resaltados
        this.router.post(
            '/',
            ValidationMiddleware.validatePaginationQuery,
            this.highlightController.getAllHighlights
        );

        // Obtener po ID
        this.router.get(
            '/:id',
            ValidationMiddleware.validateIdParam,
            this.highlightController.getHighlightById
        );

        // Rutas protegidas
        // Crear resaltados
        this.router.post(
            '/:id',
            ValidationMiddleware.validateIdParam,
            this.highlightController.createHighlight
        );

        // Obtener por progreso de lectura del usuario
        this.router.get(
            '/user/:userId',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validateIdParam,
            this.highlightController.getLibraryByProgressId
        );

        this.router.put(
            '/:id',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validateIdParam,
            this.highlightController.updateHighlight
        );
        
        this.router.delete(
            '/:id',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validateIdParam,
            this.highlightController.deleteHighlight
        );
    }

    public getRouter(): Router {
        return this.router;
    }
}