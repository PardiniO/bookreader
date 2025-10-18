import { Router } from "express";
import { ProgressController } from "../controllers/progressController";
import { ValidationMiddleware } from "../middlewares";

export class ProgressRouter {
    public router: Router;
    private progressController: ProgressController;

    constructor() {
        this.router = Router();
        this.progressController = new ProgressController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post('/', ValidationMiddleware.validateProgressCreate, this.progressController.create);
        this.router.get('/:id', this.progressController.getById);
        this.router.get('/user/:userId', this.progressController.getByUser);
        this.router.get('/user/:userId/file/:fileId', this.progressController.getByUserAndFile);
        this.router.put('/:id', ValidationMiddleware.validateProgressUpdate, this.progressController.update);
        this.router.delete('/:id', this.progressController.delete);
    }

    public geRouter(): Router {
        return this.router;
    }
}