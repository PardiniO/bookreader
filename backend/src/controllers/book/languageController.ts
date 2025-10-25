import { Request, Response } from 'express';
import { LanguageModel } from '../../models/book/languageModel';
import { BaseController } from '../baseController';
import { ILanguage } from '../../interfaces';

export class LanguageController extends BaseController {
    private languageModel: LanguageModel;

    constructor() {
        super();
        this.languageModel = new LanguageModel();
    }

    public getAllLanguages = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async () => {
            const languages = await this.languageModel.getAllLanguages();
            this.sendSuccess(res, 'Idiomas obtenidos exitosamente', languages);
        });
    };

    public getLanguageById = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async () => {
            const { id } = req.params;
            if (!this.isValidId(id)) {
                this.sendError(res, 'ID de idioma inválido');
                return;
            }
            const language = await this.languageModel.getLanguageById(parseInt(id));
            if (!language) {
                this.sendNotFound(res, 'Idioma no encontrado');
                return;
            }
            this.sendSuccess(res, 'Idioma obtenido exitosamente', language);
        });
    };

    public createLanguage = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async () => {
            if (!this.validateRequest(req, res)) return;
            const languageData: Omit<ILanguage, 'id'> = req.body;
            const languageId = await this.languageModel.createLanguage(languageData);
            this.sendSuccess(res, 'Idioma creado exitosamente', { id: languageId }, 201);
        });
    };

    public updateLanguage = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async () => {
            const { id } = req.params;
            if (!this.isValidId(id)) {
                this.sendError(res, 'ID de idioma inválido');
                return;
            }
            if (!this.validateRequest(req, res)) return;
            const updated = await this.languageModel.updateLanguage(parseInt(id), req.body);
            if (!updated) {
                this.sendNotFound(res, 'Idioma no encontrado');
                return;
            }
            this.sendSuccess(res, 'Idioma actualizado exitosamente');
        });
    };

    public deleteLanguage = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async () => {
            const { id } = req.params;
            if (!this.isValidId(id)) {
                this.sendError(res, 'ID de idioma inválido');
                return;
            }
            const deleted = await this.languageModel.deleteLanguage(parseInt(id));
            if (!deleted) {
                this.sendNotFound(res, 'Idioma no encontrado');
                return;
            }
            this.sendSuccess(res, 'Idioma eliminado exitosamente');
        });
    };
    
    public searchLanguages = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { query: searchTerm } = req.query;
            if (!searchTerm || typeof searchTerm !== 'string') {
                this.sendError(res, 'Término de búsqueda requerido');
                return;
            }

            const pagination = this.getPaginationParams(req);
            const languages = await this.languageModel.searchLnaguage(searchTerm, pagination);
            
            this.sendSuccess(res, 'Búsqueda de idiomas completada', languages);
        });
    };
}