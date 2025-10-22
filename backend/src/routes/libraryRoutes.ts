import { Router } from "express";
import { LibraryController } from "../controllers/library/libraryController";
import { ValidationMiddleware } from "../middlewares";

export class LibraryRouter {
    public router: Router;
    private libraryController: LibraryController;

    constructor() {
        this.router = Router();
        this.libraryController = new LibraryController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/', this.libraryController.getByUser); // expects auth/userId
        this.router.post('/', ValidationMiddleware.validateLibraryEntryCreate, this.libraryController.create);
        this.router.get('/:id', this.libraryController.getById);
        this.router.put('/:id', ValidationMiddleware.validateLibraryEntryUpdate, this.libraryController.update);
        this.router.delete('/:id', this.libraryController.delete);
    }

    public geRouter(): Router {
        return this.router;
    }
}