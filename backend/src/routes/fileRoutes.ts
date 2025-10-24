import { Router } from "express";
import { FileController } from "../controllers/file/fileController";
import { AuthMiddleware, ValidationMiddleware } from "../middlewares";
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
        // Crear archivo
        this.router.post(
            '/', 
            AuthMiddleware.authenticate,
            upload.single('file'),
            this.fileController.createFile
        );

        this.router.get(
            '/',
            ValidationMiddleware.validateSearchQuery,
            this.fileController.getAllFiles
        );

        this.router.get(
            '/search',
            ValidationMiddleware.validateSearchQuery,
            ValidationMiddleware.validateSearchQuery,
            this.fileController.searchFile
        );

        this.router.get(
            '/:id',
            ValidationMiddleware.validateIdParam,
            this.fileController.getFileById
        );

        this.router.get(
            '/files',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validateSearchQuery,
            this.fileController.getAllFiles
        );

        this.router.get(
            '/user/:userId',
            this.fileController.getFileById
        );

        this.router.get('/book/:bookId', this.fileController.getAllFiles);
        this.router.get('/:id/download', this.fileController.getAllFiles);
        
        this.router.put(
            '/:id',
            ValidationMiddleware.validateIdParam,
            this.fileController.updateFile
        );

        this.router.delete(
            '/:id',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validateIdParam,
            this.fileController.deleteFile
        );
    }

    public getRouter(): Router {
        return this.router;
    }
}