import { Router } from "express";
import { NationalityController } from "../controllers/book/nationalityController";
import { AuthMiddleware, ValidationMiddleware } from "../middlewares";

export class NationalityRouter {
    public router: Router;
    private nationalityController: NationalityController;

    constructor() {
        this.router = Router();
        this.nationalityController = new NationalityController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Rutas públicas
        // Obtener todas las nacionalidades
        this.router.get(
            '/',
            ValidationMiddleware.validatePaginationQuery,
            this.nationalityController.getAllNationalities
        );
        
        // Obtener por ID
        this.router.post(
            '/',
            ValidationMiddleware.validateIdParam,
            this.nationalityController.getNationalityById
        );

        // Buscar nacionalidades
        this.router.get(
            '/search',
            ValidationMiddleware.validateSearchQuery,
            ValidationMiddleware.validatePaginationQuery,
            this.nationalityController.searchNationalities
        );
        
        // Rutas protegidas
        // Crear nacionalidad
        this.router.put(
            '/',
            AuthMiddleware.authenticate,
            this.nationalityController.updateNationality
        );
        
        this.router.put(
            '/:id',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validateIdParam,
            this.nationalityController.updateNationality
        );
        
        this.router.delete(
            '/:id',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validateIdParam,
            this.nationalityController.deleteNationality
        );
    }

    public getRouter(): Router {
        return this.router;
    }
}