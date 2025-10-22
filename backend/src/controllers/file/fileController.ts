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
    
    public create = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            if (!this.validateRequest(req, res)) return;
            const fileData: Omit<IFile, 'id'> = req.body;
            const fileId = await this.fileModel.createFile(fileData);
            this.sendSuccess(res, 'Archivo creado exitosamente', { id: fileId }, 201);
        });
    };
    
    public update = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { id } = req.params;
            if (!this.isValidId(id)) {
                this.sendError(res, 'ID de archivo inválido');
                return;
            }
            if (!this.validateRequest(req, res)) return;
            const updated = await this.fileModel.updateFile(parseInt(id), req.body);
            if (!updated) {
                this.sendNotFound(res, 'archivo no encontrado');
                return;
            }
            this.sendSuccess(res, 'Archivo actualizado exitosamente');
        });
    };

    public delete = async (req: Request, res: Response): Promise<void> => {
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

    public search = async (req: Request, res: Response): Promise<void> => {
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

    // Métodos para relaciones (usuarios, libros, estatus de lectura[leido, leyendo, para leer])
    public addUsers = async (req: Request, res: Response): Promise<void> => { /* ... */ };
    public removeUsers = async (req: Request, res: Response): Promise<void> => { /* ... */ };
    public addBooks = async (req: Request, res: Response): Promise<void> => { /* ... */ };
    public removeBooks = async (req: Request, res: Response): Promise<void> => { /* ... */ };
    public addReadingStatus = async (req: Request, res: Response): Promise<void> => { /* ... */ };
    public removeReadingStatus = async (req: Request, res: Response): Promise<void> => { /* ... */ };
}