import { Request, Response } from "express";
import { BaseController } from "../baseController";
import { HighlightModel } from "@/models";
import { IHighlight } from "@/interfaces";

export class HighlighController extends BaseController {
    private highlightModel: HighlightModel;

    constructor() {
        super();
        this.highlightModel = new HighlightModel();
    }

    public getAllHighlights = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async () => {
            const highlights = await this.highlightModel.getAllHighlights();
            this.sendSuccess(res, 'Resaltados obtenidos exitosamente', highlights);
        });
    };
    public getHighlightById = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
        if (!this.isValidId(req.params.id)) {
            this.sendError(res, 'ID inválido', undefined, 400);
            return;
        }

        const highlight = await this.highlightModel.getHighlightById(parseInt(req.params.id));
        if (!highlight) {
            this.sendNotFound(res);
            return;
        }

        this.sendSuccess(res, 'Resaltado obtenida exitosamente', highlight);
        });
    };

    public createHighlight = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
        if (!this.validateRequest(req, res)) return;

        const userId = this.extractUserIdFromToken(req);
        const { idProgress, highlightedText, page, color } = req.body;

        const newHighlightData: Omit<IHighlight, 'id'> = {
            idProgress,
            highlightedText,
            page: page || undefined,
            color,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const createdHighlight = await this.highlightModel.createHighlight(newHighlightData);
        this.sendSuccess(res, 'Resaltado creado exitosamente', createdHighlight, 201);
        });
    };

    public updateHighlight = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
        if (!this.isValidId(req.params.id)) {
            this.sendError(res, 'ID inválido', undefined, 400);
            return;
        }

        if (!this.validateRequest(req, res)) return;

        const highlightId = parseInt(req.params.id);
        const updatedData: Partial<Omit<IHighlight, 'id' | 'createdAt'>> = req.body;

        const updatedHighlight = await this.highlightModel.updateHighlight(highlightId, updatedData);
        if (!updatedHighlight) {
            this.sendNotFound(res);
            return;
        }

        this.sendSuccess(res, 'Resaltado actualizado exitosamente', updatedHighlight);
        });
    };

    public deleteHighlight = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
        if (!this.isValidId(req.params.id)) {
            this.sendError(res, 'ID inválido', undefined, 400);
            return;
        }

        const success = await this.highlightModel.deleteHighlight(parseInt(req.params.id));
        if (!success) {
            this.sendNotFound(res);
            return;
        }

        this.sendSuccess(res, 'Resaltado eliminada exitosamente');
        });
    };
}