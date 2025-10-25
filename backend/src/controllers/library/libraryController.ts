import { Request, Response } from "express";
import { LibraryModel } from "@/models";
import { BaseController } from "../baseController";
import { ILibrary } from "@/interfaces";

export class LibraryController extends BaseController {
    private libraryModel: LibraryModel;
    
    constructor() {
        super();
        this.libraryModel = new LibraryModel();
    }

    public createLibrary = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            if (!this.validateRequest(req, res)) return;

            const libraryData: Omit<ILibrary, 'id'> = req.body;
            const libraryId = await this.libraryModel.createLibrary(libraryData);

            this.sendSuccess(res, 'Biblioteca creada exitosamente', { id: libraryId }, 201);
        });
    };
    
    
    public getLibraryById = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { id } = req.params;
            if (!this.isValidId(id)) {
                this.sendError(res, 'ID de biblioteca inválido');
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
                this.sendError(res, 'ID de usuario inválido');
                return;
            }
            
            const pagination = this.getPaginationParams(req);
            const library = await this.libraryModel.getLibraryByUserId(parseInt(userId), pagination);
            if (!library) {
                this.sendNotFound(res, 'Biblioteca no encontrada');
                return;
            }

            this.sendSuccess(res, 'Biblioteca por usuario obtenida exitosamente', library);
        });
    };

    public getLibraryByBookId = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { bookId } = req.params;
            if (!this.isValidId(bookId)) {
                this.sendError(res, 'ID de libro inválido');
                return;
            }
            
            const pagination = this.getPaginationParams(req);
            const library = await this.libraryModel.getLibraryByUserId(parseInt(bookId), pagination);
            if (!library) {
                this.sendNotFound(res, 'Biblioteca no encontrada');
                return;
            }

            this.sendSuccess(res, 'Biblioteca por libro obtenida exitosamente', library);
        });
    };

    public getLibraryByStatus = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { statusId } = req.params;
            if (!this.isValidId(statusId)) {
                this.sendError(res, 'ID de estado de lectura inválido');
                return;
            }
            
            const pagination = this.getPaginationParams(req);
            const library = await this.libraryModel.getLibraryByUserId(parseInt(statusId), pagination);
            if (!library) {
                this.sendNotFound(res, 'Biblioteca no encontrada');
                return;
            }

            this.sendSuccess(res, 'Biblioteca por estado de lectura obtenida exitosamente', library);
        });
    };

    public updateLibrary = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { id } = req.params;
            if (!this.isValidId(id)) {
                this.sendError(res, 'ID de archivo inválido');
                return;
            }

            if (!this.validateRequest(req, res)) return;
            
            const updated = await this.libraryModel.updateLibrary(parseInt(id), req.body);
            if (!updated) {
                this.sendNotFound(res, 'Biblioteca no encontrada');
                return;
            }

            this.sendSuccess(res, 'Biblioteca actualizada exitosamente');
        });
    };
    
    public deleteLibrary = async (req: Request, res: Response): Promise<void> => {
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
    
    public searchLibrary = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { query: searchTerm } = req.params;
            if (!searchTerm || typeof searchTerm !== 'string') {
                this.sendError(res, 'Es requerido un término de búsqueda');
                return;
            }

            const pagination = await this.getPaginationParams(req);
            const results = await this.libraryModel.searchLibraries(searchTerm, pagination);
            
            this.sendSuccess(res, 'Búsqueda completada exitosamente', results);
        });
    };
}