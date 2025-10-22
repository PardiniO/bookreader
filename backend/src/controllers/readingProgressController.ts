import { Request, Response } from "express";
import { BaseController } from "./baseController";
import { ReadingProgressModel } from "@/models";
import { IReadingProgress } from "@/interfaces";

export class readingProgressController extends BaseController {
    private readingProgressModel: ReadingProgressModel;
    
    constructor() {
        super();
        this.readingProgressModel = new ReadingProgressModel();
    }
    
    public getProgressById = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { id } = req.params;
            if (!this.isValidId(id)) {
                this.sendError(res, 'ID de progreso inválido');
                return;
            }
            const progress = await this.readingProgressModel.getProgressById(parseInt(id));
            if (!progress) {
                this.sendNotFound(res, 'Progreso no encontrado');
                return;
            }
            this.sendSuccess(res, 'Progreso obtenido exitosamente', progress);
        });
    };

    public create = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            if (!this.validateRequest(req, res)) return;
            const progressData: Omit<IReadingProgress, 'id'> = req.body;
            const progressId = await this.readingProgressModel.createProgress(progressData);
            this.sendSuccess(res, 'Progreso creado exitosamente', { id: progressId }, 201);
        });
    };

    public update = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { id } = req.params;
            if (!this.isValidId(id)) {
                this.sendError(res, 'ID de progreso inválido');
                return;
            }
            if (!this.validateRequest(req, res)) return;
            const updated = await this.readingProgressModel.updateProgress(parseInt(id), req.body);
            if (!updated) {
                this.sendNotFound(res, 'Progreso no encontrado');
                return;
            }
            this.sendSuccess(res, 'Progreso actualizado exitosamente');
        });
    };
}