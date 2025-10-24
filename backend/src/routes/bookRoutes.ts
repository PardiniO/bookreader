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

        //rutas para users autenticados (sus propios libros)
        this.router.get(
            '/books',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validatePaginationQuery,
            this.bookController.getAllBooks
        );

        // Crear libro (protegido)
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

        // Filtrar por autor, género, idioma
        this.router.get('/author/:authorId', this.bookController.getBooksByAuthor);
        this.router.get('/genre/:genreId', this.bookController.getBooksByGenre);
        this.router.get('/language/:languageId', this.bookController.getBooksByLanguage);
    }

    public getRouter(): Router {
        return this.router;
    }
}