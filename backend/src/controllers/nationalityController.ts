import { Request, Response } from 'express';
import { NationalityModel } from '../models/book/nationalitytModel';
import { BaseController } from './baseController';
import { INationality } from '../interfaces';

export class NationalityController extends BaseController {
    private nationalityModel: NationalityModel;

    constructor() {
        super();
        this.nationalityModel = new NationalityModel();
    }

    public getAll = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const nationalities = await this.nationalityModel.getAllNationalities();
            this.sendSuccess(res, 'Nacionalidades obtenidas exitosamente', nationalities);
        });
    };

    public getById = async (req: Request, res: Response): Promise<void> => {
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

    public create = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            if (!this.validateRequest(req, res)) return;
            const nationalityData: Omit<INationality, 'id'> = req.body;
            const nationalityId = await this.nationalityModel.createNationality(nationalityData);
            this.sendSuccess(res, 'Nacionalidad creada exitosamente', { id: nationalityId }, 201);
        });
    };

    public update = async (req: Request, res: Response): Promise<void> => {
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

    public delete = async (req: Request, res: Response): Promise<void> => {
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
}