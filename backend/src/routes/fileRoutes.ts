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
        // Subir archivo (ruta protegida)
        this.router.post(
            '/', 
            AuthMiddleware.authenticate,
            upload.single('file'), // multer sube el archivo
            this.fileController.createFile
        );

        // Obtener todos los archivos (paginado opcional)
        this.router.get(
            '/',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validatePaginationQuery,
            this.fileController.getAllFiles
        );

        // Buscar archivo por nombre
        this.router.get(
            '/search',
            ValidationMiddleware.validateSearchQuery,
            ValidationMiddleware.validateSearchQuery,
            this.fileController.searchFile
        );    

        // Obtener archivos de un usuario
        this.router.get(
            '/user/:userId',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validateIdParam,
            ValidationMiddleware.validateSearchQuery,
            this.fileController.getFilesByUserId
        );
        
        // Obtener archivos de un libro
        this.router.get(
            '/book/:bookId',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validateIdParam,
            this.fileController.getFilesByBookId
        );
        
        // Descargar archivo
        this.router.get(
            '/:id/download',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validateIdParam,
            this.fileController.getAllFiles
        );

        // Obtener por id
        this.router.get(
            '/:id',
            ValidationMiddleware.validateIdParam,
            this.fileController.getFileById
        );    

        // Actulizar archivo
        this.router.put(
            '/:id',
            AuthMiddleware.authenticate,
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