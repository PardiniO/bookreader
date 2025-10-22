import { Router } from "express";
import { LanguageController } from "../controllers/book/languageController";
import { ValidationMiddleware } from "../middlewares";

export class LanguageRouter {
    public router: Router;
    private languageController: LanguageController;

    constructor() {
        this.router = Router();
        this.languageController = new LanguageController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/', this.languageController.getAll);
        this.router.post('/', ValidationMiddleware.validateLanguageCreate, this.languageController.create);
        this.router.get('/:id', this.languageController.getById);
        this.router.put('/:id', ValidationMiddleware.validateLanguageUpdate, this.languageController.update);
        this.router.delete('/:id', this.languageController.delete);
    }

    public geRouter(): Router {
        return this.router;
    }
}