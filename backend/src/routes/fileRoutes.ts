import { Router } from "express";
import { FileController } from "../controllers/file/fileController";
import { ValidationMiddleware } from "../middlewares";
import multer from "multer";

const upload = multer({ dest: 'uploads/' });

export class FileRouter {
    public router: Router;
    private fileController: FileController;

    constructor() {
        this.router = Router();
        this.fileController = new FileController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post('/upload', upload.single('file'), this.fileController.upload);
        this.router.get('/', this.fileController.getAll);
        this.router.get('/search', this.fileController.search);
        this.router.get('/user/:userId', this.fileController.getByUser);
        this.router.get('/book/:bookId', this.fileController.getByBook);
        this.router.get('/:id', this.fileController.getById);
        this.router.get('/:id/download', this.fileController.download);
        this.router.put('/:id', ValidationMiddleware.validateFileUpdate, this.fileController.update);
        this.router.delete('/:id', this.fileController.delete);
        this.router.post('/:id/link-book', this.fileController.linkToBook);
        this.router.delete('/:id/unlink-book/:bookId', this.fileController.unlinkFromBook);
    }

    public geRouter(): Router {
        return this.router;
    }
}