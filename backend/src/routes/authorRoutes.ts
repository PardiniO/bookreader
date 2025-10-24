import { Router } from "express";
import { AuthorController } from "../controllers/index";
import { AuthMiddleware, ValidationMiddleware } from "../middlewares";

export class AuthorRouter {
    public router: Router;
    private authorController: AuthorController;

    constructor() {
        this.router = Router();
        this.authorController = new AuthorController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        //rutas públicas 
        this.router.get(
            '/',
            ValidationMiddleware.validatePaginationQuery,
            this.authorController.getAllAuthors
        );
        
        this.router.get(
            '/search', 
            ValidationMiddleware.validateSearchQuery,
            ValidationMiddleware.validatePaginationQuery,
            this.authorController.searchAuthors
        );

        this.router.get(
            '/:id', 
            ValidationMiddleware.validateIdParam,
            this.authorController.getAuthorById
        );

        // Rutas protegidas (autenticación requerida)
        this.router.post(
            '/',
            AuthMiddleware.authenticate,
            this.authorController.createAuthor
        );

        this.router.put(
            '/:id',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validateIdParam, 
            this.authorController.updateAuthor
        );

        this.router.delete(
            '/:id',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validateIdParam,
            this.authorController.deleteAuthor
        );
    }

    public getRouter(): Router {
        return this.router;
    }
}