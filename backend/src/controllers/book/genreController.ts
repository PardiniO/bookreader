import { Request, Response } from 'express';
import { GenreModel } from '../../models/book/genreModel';
import { BaseController } from '../baseController';
import { IGenre } from '../../interfaces';

export class GenreController extends BaseController {
    private genreModel: GenreModel;

    constructor() {
        super();
        this.genreModel = new GenreModel();
    }

    public getAll = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const pagination = this.getPaginationParams(req);
            const genres = await this.genreModel.getAllGenres(pagination);
            this.sendSuccess(res, 'Géneros obtenidos exitosamente', genres);
        });
    };

    public getById = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { id } = req.params;
            if (!this.isValidId(id)) {
                this.sendError(res, 'ID de género inválido');
                return;
            }
            const genre = await this.genreModel.getGenreById(parseInt(id));
            if (!genre) {
                this.sendNotFound(res, 'Género no encontrado');
                return;
            }
            this.sendSuccess(res, 'Género obtenido exitosamente', genre);
        });
    };

    public create = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            if (!this.validateRequest(req, res)) return;
            const genreData: Omit<IGenre, 'id'> = req.body;
            const genreId = await this.genreModel.createGenre(genreData);
            this.sendSuccess(res, 'Género creado exitosamente', { id: genreId }, 201);
        });
    };

    public update = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { id } = req.params;
            if (!this.isValidId(id)) {
                this.sendError(res, 'ID de género inválido');
                return;
            }
            if (!this.validateRequest(req, res)) return;
            const updated = await this.genreModel.updateGenre(parseInt(id), req.body);
            if (!updated) {
                this.sendNotFound(res, 'Género no encontrado');
                return;
            }
            this.sendSuccess(res, 'Género actualizado exitosamente');
        });
    };

    public delete = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { id } = req.params;
            if (!this.isValidId(id)) {
                this.sendError(res, 'ID de género inválido');
                return;
            }
            const deleted = await this.genreModel.deleteGenre(parseInt(id));
            if (!deleted) {
                this.sendNotFound(res, 'Género no encontrado');
                return;
            }
            this.sendSuccess(res, 'Género eliminado exitosamente');
        });
    };
}