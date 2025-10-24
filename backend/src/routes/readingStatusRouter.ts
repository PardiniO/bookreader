import { Router } from "express";
import { ReadingStatusController } from "../controllers/index";
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
        this.router.get('/', this.readingStatusController.getAllStatuses);
        this.router.post('/', ValidationMiddleware.validateStatusParam, this.readingStatusController.createStatus);
        this.router.get('/:id', this.readingStatusController.getStatusById);
        this.router.put('/:id', ValidationMiddleware.validateStatusParam, this.readingStatusController.updateStatus);
        this.router.delete('/:id', this.readingStatusController.deleteStatus);
    }

    public getRouter(): Router {
        return this.router;
    }
}