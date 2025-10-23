import { Request, Response } from "express";
import { BaseController } from "../baseController";
import { ReadingStatusModel } from "@/models";
import { IReadingStatus } from "@/interfaces";

export class ReadingStatusController extends BaseController {
    private readingStatusModel: ReadingStatusModel;
    
    constructor() {
        super();
        this.readingStatusModel = new ReadingStatusModel();
    }

    public getAllStatuses = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async () => {
            const pagination = await this.getPaginationParams(req);
            const statuses = await this.readingStatusModel.getAllStatuses(pagination);
            this.sendSuccess(res, 'Estados de lectura obtenidos exitosamente', statuses);
        });
    };

    public getStatusById = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async () => {
            const { id } = req.params;
            if (!this.isValidId(id)) {
                this.sendError(res, 'ID de estado de lecura inválido');
                return;
            }

            const status = await this.readingStatusModel.getStatusById(parseInt(id));
            if (!status) {
                this.sendNotFound(res, 'Estado de lectura no encontrado');
                return;
            }
            this.sendSuccess(res, 'Estado de lectura obtenido exitosamente', status);
        });
    };

    public getStatusByValue = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async () => {
            const { value } = req.params;
            const status = await this.readingStatusModel.getStatusByValue(value);
            
            if (!status) {
                this.sendNotFound(res, 'Estado de lectura no encontrado');
                return;
            }
            
            this.sendSuccess(res, 'Estado de lectura obtenido exitosamente', status);
        });
    };

    public createStatus = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async () => {
            if (!this.validateRequest(req, res)) return;
            const statusData: Omit<IReadingStatus, 'id'> = req.body;

            const validValues = ['reading', 'to_read', 'read'];
            if (!validValues.includes(statusData.status)) {
                this.sendError(res, 'Valores de estado de lectura inválidos');
            }

            const exists = await this.readingStatusModel.existsStatus(statusData.status);
            if (!exists) {
                this.sendError(res, 'Ya existe un estado de lectura');
            }

            const statusId = await this.readingStatusModel.createStatus(statusData);
            this.sendSuccess(res, 'Estado de lectura creado exitosamente', { id: statusId }, 201);
        });
    };

    public updateStatus = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async () => {
            const { id } = req.params;
            if (!this.isValidId(id)) {
                this.sendError(res, 'ID de estado de lectura inválido');
                return;
            }
            if (!this.validateRequest(req, res)) return;
            const updated = await this.readingStatusModel.updateStatus(parseInt(id), req.body);
            if (!updated) {
                this.sendNotFound(res, 'Estado de lectura no encontrado');
                return;
            }
            this.sendSuccess(res, 'Estado de lectura actualizado exitosamente');
        });
    };

    public deleteStatus = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async () => {
            const { id } = req.params;
            if (!this.isValidId(id)) {
                this.sendError(res, 'ID de estado de lectura inválido');
                return;
            }
            const deleted = await this.readingStatusModel.deleteStatus(parseInt(id));
            if (!deleted) {
                this.sendNotFound(res, 'Estado de lectura no encontrado');
                return;
            }
            this.sendSuccess(res, 'Estado de lectura eliminado exitosamente');
        });
    };
}