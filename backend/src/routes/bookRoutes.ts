import { Router } from "express";
import { BookController } from "../controllers/index";
import { AuthMiddleware, ValidationMiddleware } from "../middlewares";

export class BookRouter {
    public router: Router;
    private bookController: BookController;
    
    constructor() {
        this.router = Router();
        this.bookController = new BookController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Obtener todos los libros (con paginación)
        this.router.get(
            '/',
            ValidationMiddleware.validatePaginationQuery,
            this.bookController.getAllBooks
        );

        // Buscar libros 
        this.router.get(
            '/search',
            ValidationMiddleware.validateSearchQuery,
            ValidationMiddleware.validatePaginationQuery,
            this.bookController.searchBook
        );

        // Buscar libro por ID
        this.router.get(
            '/:id',
            ValidationMiddleware.validateIdParam,
            this.bookController.getBooksById
        );

        this.router.get(
            '/author/:authorId',
            ValidationMiddleware.validateIdParam,
            this.bookController.getBooksByAuthor
        );

        this.router.get(
            '/genre/:genreId',
            ValidationMiddleware.validateIdParam,
            this.bookController.getBooksByGenre
        );

        this.router.get(
            '/language/:languageId',
            ValidationMiddleware.validateIdParam,
            this.bookController.getBooksByLanguage
        );

        // Rutas protegidas
        // Crear libro
        this.router.post(
            '/',
            AuthMiddleware.authenticate,
            this.bookController.createBook
        );

        // Actualizar libro
        this.router.put(
            '/:id',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validateIdParam,
            this.bookController.updateBook
        );

        // Eliminar libro
        this.router.delete(
            '/:id',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validateIdParam,
            this.bookController.deleteBook
        );
    }

    public getRouter(): Router {
        return this.router;
    }
}