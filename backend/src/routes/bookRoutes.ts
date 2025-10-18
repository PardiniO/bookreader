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
        //rutas para users autenticados (sus propios libros)
        this.router.get(
            '/my-books',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validatePaginationQuery,
            this.bookController.getMyBooks
        );

        this.router.post(
            '/',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validateBookCreation,
            this.bookController.createBook
        );

        //rutas administrativas (requieren autenticación)
        this.router.get(
            '/',
            AuthMiddleware.validatePaginationQuery,
            this.bookController.getAllBooks
        );

        this.router.get(
            '/status',
            AuthMiddleware.authenticate,
            this.bookController.getBookStats
        );

        this.router.get(
            '/status/:status',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validateStatusParam,
            ValidationMiddleware.validatePaginationQuery,
            this.bookController.getBookByStatus
        );

        this.router.get(
            '/user/userId',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validateIdParam,
            ValidationMiddleware.validatePaginationQuery,
            this.bookController.getBookByUser
        );

        this.router.get(
            '/:id',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validateIdParam,
            this.bookController.getBookById
        );

        this.router.get(
            '/:id/details',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validateIdParam,
            this.bookController.getBookWithItems
        );

        this.router.post(
            '/user/:userId',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validateUserIdParam,
            ValidationMiddleware.validateBookCreation,
            this.bookController.createBookForUser
        );

        this.router.patch(
            '/:id/status',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validateIdParam,
            ValidationMiddleware.validateBookStatusUpdate,
            this.bookController.updateBookStatus
        );

        this.router.get('/', this.bookController.getAll);
        this.router.get('/search', this.bookController.search);
        this.router.post('/', ValidationMiddleware.validateBookCreate, this.bookController.create);
        this.router.get('/:id', this.bookController.getById);
        this.router.put('/:id', ValidationMiddleware.validateBookUpdate, this.bookController.update);
        this.router.delete('/:id', this.bookController.delete);

        // relations
        this.router.post('/:id/authors', this.bookController.addAuthors);
        this.router.delete('/:id/authors/:authorId', this.bookController.removeAuthor);
        this.router.post('/:id/genres', this.bookController.addGenres);
        this.router.delete('/:id/genres/:genreId', this.bookController.removeGenre);
        this.router.post('/:id/files', this.bookController.addFiles);
        this.router.delete('/:id/files/:fileId', this.bookController.removeFile);
    }
    }

    public getRouter(): void {
        return this.router;
    }
}