import { Request, Response } from 'express';
import { AuthorModel } from '../models/book/authorModel';
import { BaseController } from './baseController';
import { IAuthor } from '../interfaces';

export class AuthorController extends BaseController {
    private authorModel: AuthorModel;

    constructor() {
        super();
        this.authorModel = new AuthorModel();
    }

    public getAll = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const pagination = this.getPaginationParams(req);
            const authors = await this.authorModel.getAllAuthors(pagination);
            this.sendSuccess(res, 'Autores obtenidos exitosamente', authors);
        });
    };

    public getById = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { id } = req.params;
            if (!this.isValidId(id)) {
                this.sendError(res, 'ID de autor inválido');
                return;
            }
            const author = await this.authorModel.getAuthorById(parseInt(id));
            if (!author) {
                this.sendNotFound(res, 'Autor no encontrado');
                return;
            }
            this.sendSuccess(res, 'Autor obtenido exitosamente', author);
        });
    };

    public create = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            if (!this.validateRequest(req, res)) return;
            const authorData: Omit<IAuthor, 'id'> = req.body;
            const authorId = await this.authorModel.createAuthor(authorData);
            this.sendSuccess(res, 'Autor creado exitosamente', { id: authorId }, 201);
        });
    };

    public update = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { id } = req.params;
            if (!this.isValidId(id)) {
                this.sendError(res, 'ID de autor inválido');
                return;
            }
            if (!this.validateRequest(req, res)) return;
            const updated = await this.authorModel.updateAuthor(parseInt(id), req.body);
            if (!updated) {
                this.sendNotFound(res, 'Autor no encontrado');
                return;
            }
            this.sendSuccess(res, 'Autor actualizado exitosamente');
        });
    };

    public delete = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { id } = req.params;
            if (!this.isValidId(id)) {
                this.sendError(res, 'ID de autor inválido');
                return;
            }
            const deleted = await this.authorModel.deleteAuthor(parseInt(id));
            if (!deleted) {
                this.sendNotFound(res, 'Autor no encontrado');
                return;
            }
            this.sendSuccess(res, 'Autor eliminado exitosamente');
        });
    };

    public search = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { q: searchTerm } = req.query;
            if (!searchTerm || typeof searchTerm !== 'string') {
                this.sendError(res, 'Término de búsqueda requerido');
                return;
            }
            const pagination = this.getPaginationParams(req);
            const authors = await this.authorModel.searchAuthors(searchTerm, pagination);
            this.sendSuccess(res, 'Búsqueda completada', authors);
        });
    };
}