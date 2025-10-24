import { Request, Response } from 'express';
import { GenreModel } from '../../models/book/genreModel';
import { BaseController } from '../baseController';
import { IGenre, IPaginatedResponse, IPaginationParams } from '../../interfaces';

export class GenreController extends BaseController {
    private genreModel: GenreModel;

    constructor() {
        super();
        this.genreModel = new GenreModel();
    }

    public getAllGenres = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const pagination = this.getPaginationParams(req);
            const genres = await this.genreModel.getAllGenres(pagination);
            this.sendSuccess(res, 'Géneros obtenidos exitosamente', genres);
        });
    };

    public getGenreById = async (req: Request, res: Response): Promise<void> => {
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

    public createGenre = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            if (!this.validateRequest(req, res)) return;
            const genreData: Omit<IGenre, 'id'> = req.body;
            const genreId = await this.genreModel.createGenre(genreData);
            this.sendSuccess(res, 'Género creado exitosamente', { id: genreId }, 201);
        });
    };

    public updateGenre = async (req: Request, res: Response): Promise<void> => {
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

    public deleteGenre = async (req: Request, res: Response): Promise<void> => {
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

    public searchGenres = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { query: searchTerm } = req.query;
            if (!searchTerm || typeof searchTerm !== 'string') {
                this.sendError(res, 'Término de búsqueda requerido');
                return;
            }

            const pagination = this.getPaginationParams(req);
            const books = await this.genreModel.searchGenres(searchTerm, pagination);
            
            this.sendSuccess(res, 'Búsqueda de géneros completada', books);
        });
    };
}