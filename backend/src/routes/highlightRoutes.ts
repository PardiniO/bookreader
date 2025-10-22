import { Router } from "express";
import { HighlightController } from "../controllers/file/highlightController";
import { ValidationMiddleware } from "../middlewares";

export class HighlightRouter {
    public router: Router;
    private highlightController: HighlightController;

    constructor() {
        this.router = Router();
        this.highlightController = new HighlightController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post('/', ValidationMiddleware.validateHighlightCreate, this.highlightController.create);
        this.router.get('/:id', this.highlightController.getById);
        this.router.put('/:id', ValidationMiddleware.validateHighlightUpdate, this.highlightController.update);
        this.router.delete('/:id', this.highlightController.delete);
        this.router.get('/progress/:progressId', this.highlightController.getByProgress);
        this.router.get('/search', this.highlightController.search);
    }

    public geRouter(): Router {
        return this.router;
    }
}