import { Router } from "express";
import { AuthorController } from "../controllers/index";
import { AuthMiddleware, ValidationMiddleware } from "../middlewares";

export class AuthorRouter {
    public router: Router;
    private authorController: AuthorRouter;

    constructor() {
        this.router = Router();
        this.authorController = new AuthorRouter();
        this.initializeRoutes();
    }

    private initializeRoutes(): Void {
        //rutas públicas 
        this.router.get(
            '/',
            ValidationMiddleware.validatePaginationQuery,
            this.authorController.getAllAuthors
        );
        
        this.router.get('/', this.authorController.getAll);
        this.router.get('/search', this.authorController.search);
        this.router.post('/', ValidationMiddleware.validateAuthorCreate, this.authorController.create);
        this.router.get('/:id', this.authorController.getById);
        this.router.put('/:id', ValidationMiddleware.validateAuthorUpdate, this.authorController.update);
        this.router.delete('/:id', this.authorController.delete);
    }

    public geRouter(): Router {
        return this.router;
    }
}