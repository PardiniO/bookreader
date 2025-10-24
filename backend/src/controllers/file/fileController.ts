import { Request, Response } from 'express';
import { FileModel } from "../../models/file/fileModel";
import { BaseController } from "../baseController";
import { IFile } from "../../interfaces";


export class FileController extends BaseController {
    private fileModel: FileModel;
    
    constructor() {
        super();
        this.fileModel = new FileModel();
    }

    public createFile = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            if (!this.validateRequest(req, res)) return;
            const fileData: Omit<IFile, 'id'> = req.body;

            if (!fileData.mimetype || !fileData.path) {
                this.sendError(res, 'Datos del archivo incompletos (mimetype o path faltantes)');
                return;
            }

            const fileId = await this.fileModel.createFile(fileData);
            this.sendSuccess(res, 'Archivo creado exitosamente', { id: fileId }, 201);
        });
    };
    
    public getAllFiles = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const pagination = this.getPaginationParams(req);
            const files = await this.fileModel.getAllFiles(pagination);
            this.sendSuccess(res, 'Archivos obtenidos exitosamente', files);
        });
    };

    public getFileById = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { id } = req.params;
            if (!this.isValidId(id)) {
                this.sendError(res, 'ID de archivo inválido');
                return;
            }
            const file = await this.fileModel.getFileById(parseInt(id));
            if (!file) {
                this.sendNotFound(res, 'Archivo no encontrado');
                return;
            }
            this.sendSuccess(res, 'Archivo obtenido exitosamente', file);
        });
    };

    public getFilesByUserId = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { userId } = req.params;
            if (!this.isValidId(userId)) {
                this.sendError(res, 'ID de usuario inválido');
                return;
            }

            const pagination = this.getPaginationParams(req);
            const files = await this.fileModel.getFileByUserId(parseInt(userId), pagination);
            if (!files || (Array.isArray(files) && FileSystem.length === 0)) {
                this.sendNotFound(res, 'No se encontraron archivos para este usuario');
                return;
            }

            this.sendSuccess(res, 'Archivos obtenidos exitosamente', files);
        });
    };

    public getFilesByBookId = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { bookId } = req.params;
            if (!this.isValidId(bookId)) {
                this.sendError(res, 'ID de libro inválido');
                return;
            }

            const pagination = this.getPaginationParams(req);
            const files = await this.fileModel.getFileByUserId(parseInt(bookId), pagination);
            if (!files || (Array.isArray(files) && FileSystem.length === 0)) {
                this.sendNotFound(res, 'No se encontraron archivos para este libro');
                return;
            }

            this.sendSuccess(res, 'Archivos obtenidos exitosamente', files);
        });
    };
    
    public updateFile = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { id } = req.params;
            if (!this.isValidId(id)) {
                this.sendError(res, 'ID de archivo inválido');
                return;
            }

            if (!this.validateRequest(req, res)) return;

            const updated = await this.fileModel.updateFile(parseInt(id), req.body);
            if (!updated) {
                this.sendNotFound(res, 'Archivo no encontrado o no se pudo actualizar');
                return;
            }
            this.sendSuccess(res, 'Archivo actualizado exitosamente');
        });
    };

    public deleteFile = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { id } = req.params;
            if (!this.isValidId(id)) {
                this.sendError(res, 'ID de archivo inválido');
                return;
            }
            const deleted = await this.fileModel.deleteFile(parseInt(id));
            if (!deleted) {
                this.sendNotFound(res, 'Archivo no encontrado');
                return;
            }
            this.sendSuccess(res, 'Archivo eliminado exitosamente');
        });
    };

    public searchFile = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { q: searchTerm } = req.query;
            if (!searchTerm || typeof searchTerm !== 'string') {
                this.sendError(res, 'Término de búsqueda requerido');
                return;
            }
            const pagination = this.getPaginationParams(req);
            const files = await this.fileModel.searchFiles(searchTerm, pagination);
            this.sendSuccess(res, 'Búsqueda completada', files);
        });
    };
}