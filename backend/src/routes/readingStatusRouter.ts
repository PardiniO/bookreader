import { Router } from "express";
import { ReadingStatusController } from "../controllers/readingStatusController";
import { ValidationMiddleware } from "../middlewares";

export class ReadingStatusRouter {
    public router: Router;
    private readingStatusController: ReadingStatusController;

    constructor() {
        this.router = Router();
        this.readingStatusController = new ReadingStatusController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/', this.readingStatusController.getAll);
        this.router.post('/', ValidationMiddleware.validateReadingStatusCreate, this.readingStatusController.create);
        this.router.get('/:id', this.readingStatusController.getById);
        this.router.put('/:id', ValidationMiddleware.validateReadingStatusUpdate, this.readingStatusController.update);
        this.router.delete('/:id', this.readingStatusController.delete);
    }

    public geRouter(): Router {
        return this.router;
    }
}