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
        this.router.get('/', this.genreController.getAll);
        this.router.post('/', ValidationMiddleware.validateGenreCreate, this.genreController.create);
        this.router.get('/:id', this.genreController.getById);
        this.router.put('/:id', ValidationMiddleware.validateGenreUpdate, this.genreController.update);
        this.router.delete('/:id', this.genreController.delete);
    }

    public getRouter(): Router {
        return this.router;
    }
}