import { Request, Response } from 'express';
import { NationalityModel } from '../../models/book/nationalitytModel';
import { BaseController } from '../baseController';
import { INationality } from '../../interfaces';

export class NationalityController extends BaseController {
    private nationalityModel: NationalityModel;

    constructor() {
        super();
        this.nationalityModel = new NationalityModel();
    }

    public getAllNationalities = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const nationalities = await this.nationalityModel.getAllNationalities();
            this.sendSuccess(res, 'Nacionalidades obtenidas exitosamente', nationalities);
        });
    };

    public getNationalityById = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { id } = req.params;
            if (!this.isValidId(id)) {
                this.sendError(res, 'ID de nacionalidad inválido');
                return;
            }
            const nationality = await this.nationalityModel.getNationalityById(parseInt(id));
            if (!nationality) {
                this.sendNotFound(res, 'Nacionalidad no encontrada');
                return;
            }
            this.sendSuccess(res, 'Nacionalidad obtenida exitosamente', nationality);
        });
    };

    public createNationality = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            if (!this.validateRequest(req, res)) return;
            const nationalityData: Omit<INationality, 'id'> = req.body;
            const nationalityId = await this.nationalityModel.createNationality(nationalityData);
            this.sendSuccess(res, 'Nacionalidad creada exitosamente', { id: nationalityId }, 201);
        });
    };

    public updateNationality = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { id } = req.params;
            if (!this.isValidId(id)) {
                this.sendError(res, 'ID de nacionalidad inválido');
                return;
            }
            if (!this.validateRequest(req, res)) return;
            const updated = await this.nationalityModel.updateNationality(parseInt(id), req.body);
            if (!updated) {
                this.sendNotFound(res, 'Nacionalidad no encontrada');
                return;
            }
            this.sendSuccess(res, 'Nacionalidad actualizada exitosamente');
        });
    };

    public deleteNationality = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { id } = req.params;
            if (!this.isValidId(id)) {
                this.sendError(res, 'ID de nacionalidad inválido');
                return;
            }
            const deleted = await this.nationalityModel.deleteNationality(parseInt(id));
            if (!deleted) {
                this.sendNotFound(res, 'Nacionalidad no encontrada');
                return;
            }
            this.sendSuccess(res, 'Nacionalidad eliminada exitosamente');
        });
    };

    public searchNationalities = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { query: searchTerm } = req.query;
            if (!searchTerm || typeof searchTerm !== 'string') {
                this.sendError(res, 'Término de búsqueda requerido');
                return;
            }

            const pagination = this.getPaginationParams(req);
            const books = await this.nationalityModel.searchNationalitys(searchTerm, pagination);
            
            this.sendSuccess(res, 'Búsqueda de nacionalidad completada', books);
        });
    };
}