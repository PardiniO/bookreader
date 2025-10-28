import { Router } from "express";
import { LanguageController } from "../controllers/book/languageController";
import { AuthMiddleware, ValidationMiddleware } from "../middlewares";

export class LanguagetRouter {
    public router: Router;
    private languageController: LanguageController;

    constructor() {
        this.router = Router();
        this.languageController = new LanguageController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Rutas Públicas
        // Obtener todos los idiomas
        this.router.get(
            '/',
            ValidationMiddleware.validatePaginationQuery,
            this.languageController.getAllLanguages
        );

        // Obtener por ID
        this.router.get(
            '/:id',
            this.languageController.getLanguageById
        );

        // Buscar idiomas
        this.router.get(
            '/search',
            ValidationMiddleware.validateSearchQuery,
            ValidationMiddleware.validatePaginationQuery,
            this.languageController.searchLanguages
        );

        // Rutas protegidas
        // Crear idioma
        this.router.post(
            '/',
            AuthMiddleware.authenticate,
            this.languageController.createLanguage
        );

        // Actualizar idioma
        this.router.put(
            '/:id',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validateIdParam,
            this.languageController.updateLanguage
        );

        this.router.delete(
            '/:id', 
            AuthMiddleware.authenticate,
            ValidationMiddleware.validateIdParam,
            this.languageController.deleteLanguage
        );
    }

    public getRouter(): Router {
        return this.router;
    }
}