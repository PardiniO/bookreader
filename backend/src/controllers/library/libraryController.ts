import { Request, Response } from "express";
import { LibraryModel } from "@/models";
import { BaseController } from "../baseController";
import { ILibary } from "@/interfaces";

export class LibraryController extends BaseController {
    private libraryModel: LibraryModel;
    
    constructor() {
        super();
        this.libraryModel = new LibraryModel();
    }

    public getLibraryById = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { id } = req.params;
            if (!this.isValidId(id)) {
                this.sendError(res, 'ID de archivo inválido');
                return;
            }
            const library = await this.libraryModel.getLibraryById(parseInt(id));
            if (!library) {
                this.sendNotFound(res, 'Biblioteca no encontrada');
                return;
            }
            this.sendSuccess(res, 'Biblioteca obtenida exitosamente', library);
        });
    };

    public getLibraryByUserId = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { userId } = req.params;
            if (!this.isValidId(userId)) {
                this.sendError(res, 'ID de archivo inválido');
                return;
            }
            const library = await this.libraryModel.getLibraryByUserId(parseInt(userId));
            if (!library) {
                this.sendNotFound(res, 'Biblioteca no encontrada');
                return;
            }
            this.sendSuccess(res, 'Biblioteca obtenida exitosamente', library);
        });
    };

    public create = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            if (!this.validateRequest(req, res)) return;
            const libraryData: Omit<ILibary, 'id'> = req.body;
            const libraryId = await this.libraryModel.createLibrary(libraryData);
            this.sendSuccess(res, 'Biblioteca creada exitosamente', { id: libraryId }, 201);
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
            const updated = await this.libraryModel.updateLibrary(parseInt(id), req.body);
            if (!updated) {
                this.sendNotFound(res, 'Bivblioteca no encontrada');
                return;
            }
            this.sendSuccess(res, 'Biblioteca actualizada exitosamente');
        });
    };
    
    public delete = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { id } = req.params;
            if (!this.isValidId(id)) {
                this.sendError(res, 'ID de archivo inválido');
                return;
            }
            const deleted = await this.libraryModel.deleteLibrary(parseInt(id));
            if (!deleted) {
                this.sendNotFound(res, 'Biblioteca no encontrada');
                return;
            }
            this.sendSuccess(res, 'Biblioteca eliminada exitosamente');
        });
    };

}