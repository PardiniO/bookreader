import { Request, Response } from "express";
import { BaseController } from "../baseController";
import { ReadingProgressModel } from "@/models";
import { IReadingProgress } from "@/interfaces";

export class ReadingProgressController extends BaseController {
    private readingProgressModel: ReadingProgressModel;
    
    constructor() {
        super();
        this.readingProgressModel = new ReadingProgressModel();
    }

    public createProgress = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            if (!this.validateRequest(req, res)) return;
            
            const progressData: Omit<IReadingProgress, 'id'> = req.body;
            const progressId = await this.readingProgressModel.createProgress(progressData);
            
            this.sendSuccess(res, 'Progreso de lectura creado exitosamente', { id: progressId }, 201);
        });
    };
    
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
    
    public getProgressByUserId = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { userId } = req.params;
            if (!this.isValidId(userId)) {
                this.sendError(res, 'ID de usuario inválido');
                return;
            }    
            
            const pagination = this.getPaginationParams(req);
            const progresses = await this.readingProgressModel.getProgressByUserId(parseInt(userId), pagination);
            if (!progresses) {
                this.sendNotFound(res, 'Progreso no encontrado');
                return;
            }    
            
            this.sendSuccess(res, 'Progreso de lectura de usuario obtenido exitosamente', progresses);
        });    
    };
    
    public getProgressByFileId = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { fileId } = req.params;
            if (!this.isValidId(fileId)) {
                this.sendError(res, 'ID de archivo inválido');
                return;
            }    
            
            const pagination = this.getPaginationParams(req);
            const progresses = await this.readingProgressModel.getProgressByUserId(parseInt(fileId), pagination);
            if (!progresses) {
                this.sendNotFound(res, 'Progreso no encontrado');
                return;
            }    
            
            this.sendSuccess(res, 'Progreso de lectura de archivo obtenido exitosamente', progresses);
        });    
    };
    
    public getProgressByUserAndFile = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { userId, fileId } = req.params;
            if (!this.isValidId(userId) || !this.isValidId(fileId)) {
                this.sendError(res, 'IDs inválidos');
                return;
            }    
            
            const progresses = await this.readingProgressModel.getProgressByUserAndFile(
                parseInt(userId),
                parseInt(fileId)
            );

            if (!progresses) {
                this.sendNotFound(res, 'Progreso de lectura no encontrado para este usuario y archivo');
                return;
            }    
            
            this.sendSuccess(res, 'Progreso de lectura obtenido exitosamente', progresses);
        });    
    };
    
    public updateProgress = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { id } = req.params;
            if (!this.isValidId(id)) {
                this.sendError(res, 'ID de progreso inválido');
                return;
            }

            if (!this.validateRequest(req, res)) return;
            
            const updated = await this.readingProgressModel.updateProgress(parseInt(id), req.body);
            if (!updated) {
                this.sendNotFound(res, 'Progreso de lectura no encontrado');
                return;
            }

            this.sendSuccess(res, 'Progreso de lectura actualizado exitosamente');
        });
    };
    
    public deleteProgress = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { id } = req.params;
            if (!this.isValidId(id)) {
                this.sendError(res, 'ID de progreso inválido');
                return;
            }

            if (!this.validateRequest(req, res)) return;
            
            const deleted = await this.readingProgressModel.deleteProgress(parseInt(id));
            if (!deleted) {
                this.sendNotFound(res, 'Progreso de lectura no encontrado');
                return;
            }

            this.sendSuccess(res, 'Progreso de lectura eliminado exitosamente');
        });
    };
}