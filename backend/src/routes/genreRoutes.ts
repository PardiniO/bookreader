import { Router } from "express";
import { GenreController } from "../controllers/index";
import { AuthMiddleware, ValidationMiddleware } from "../middlewares";

export class GenreRouter {
    public router: Router;
    private genreController: GenreController;

    constructor() {
        this.router = Router();
        this.genreController = new GenreController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Rutas públicas
        // Obtener todos los géneros
        this.router.get(
            '/',
            ValidationMiddleware.validateSearchQuery,
            this.genreController.getAllGenres
        );

        // Obtener por ID
        this.router.get(
            '/:id',
            ValidationMiddleware.validatePaginationQuery,
            this.genreController.createGenre
        );

        this.router.get(
            '/search',
            ValidationMiddleware.validateSearchQuery,
            ValidationMiddleware.validatePaginationQuery,
            this.genreController.searchGenres
        );

        // Rutas protegidas
        // Crear género
        this.router.put(
            '/',
            AuthMiddleware.authenticate,
            this.genreController.createGenre
        );

        // Actualizar género
        this.router.put(
            '/:id',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validateIdParam,
            this.genreController.createGenre
        );

        this.router.delete(
            '/:id',
            this.genreController.deleteGenre
        );
    }

    public getRouter(): Router {
        return this.router;
    }
}