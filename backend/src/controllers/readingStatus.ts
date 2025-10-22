import { Request, Response } from "express";
import { BaseController } from "./baseController";
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
            const statuses = await this.readingStatusModel.getAllStatuses();
            this.sendSuccess(res, 'Estados obtenidos exitosamente', statuses);
        });
    };

    public getStatusById = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async () => {
            const { id } = req.params;
            if (!this.isValidId(id)) {
                this.sendError(res, 'ID de estado inválido');
                return;
            }
            const status = await this.readingStatusModel.getStatusById(parseInt(id));
            if (!status) {
                this.sendNotFound(res, 'Estado no encontrado');
                return;
            }
            this.sendSuccess(res, 'Estado obtenido exitosamente', status);
        });
    };

    public createStatus = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async () => {
            if (!this.validateRequest(req, res)) return;
            const statusData: Omit<IReadingStatus, 'id'> = req.body;
            const statusId = await this.readingStatusModel.createStatus(statusData);
            this.sendSuccess(res, 'Estado creado exitosamente', { id: statusId }, 201);
        });
    };

    public updateStatus = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async () => {
            const { id } = req.params;
            if (!this.isValidId(id)) {
                this.sendError(res, 'ID de estado inválido');
                return;
            }
            if (!this.validateRequest(req, res)) return;
            const updated = await this.readingStatusModel.updateStatus(parseInt(id), req.body);
            if (!updated) {
                this.sendNotFound(res, 'Estado no encontrado');
                return;
            }
            this.sendSuccess(res, 'Estado actualizado exitosamente');
        });
    };

    public deleteStatus = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async () => {
            const { id } = req.params;
            if (!this.isValidId(id)) {
                this.sendError(res, 'ID de estado inválido');
                return;
            }
            const deleted = await this.readingStatusModel.deleteStatus(parseInt(id));
            if (!deleted) {
                this.sendNotFound(res, 'Estado no encontrado');
                return;
            }
            this.sendSuccess(res, 'Estado eliminado exitosamente');
        });
    };
}