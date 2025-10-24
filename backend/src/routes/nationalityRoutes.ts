import { Router } from "express";
import { NationalityController } from "../controllers/book/nationalityController";
import { ValidationMiddleware } from "../middlewares";

export class NationalityRouter {
    public router: Router;
    private nationalityController: NationalityController;

    constructor() {
        this.router = Router();
        this.nationalityController = new NationalityController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/', this.nationalityController.getAll);
        this.router.post('/', ValidationMiddleware.validateNationalityCreate, this.nationalityController.create);
        this.router.get('/:id', this.nationalityController.getById);
        this.router.put('/:id', ValidationMiddleware.validateNationalityUpdate, this.nationalityController.update);
        this.router.delete('/:id', this.nationalityController.delete);
    }

    public getRouter(): Router {
        return this.router;
    }
}