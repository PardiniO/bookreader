import { Request, Response } from 'express';
import { BookModel } from '../models/book/bookModel';
import { BaseController } from './baseController';
import { IBook } from '../interfaces';

export class BookController extends BaseController {
    private bookModel: BookModel;

    constructor() {
        super();
        this.bookModel = new BookModel();
    }

    public getAll = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const pagination = this.getPaginationParams(req);
            const books = await this.bookModel.getAllBooks(pagination);
            this.sendSuccess(res, 'Libros obtenidos exitosamente', books);
        });
    };

    public getById = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { id } = req.params;
            if (!this.isValidId(id)) {
                this.sendError(res, 'ID de libro inválido');
                return;
            }
            const book = await this.bookModel.getBookById(parseInt(id));
            if (!book) {
                this.sendNotFound(res, 'Libro no encontrado');
                return;
            }
            this.sendSuccess(res, 'Libro obtenido exitosamente', book);
        });
    };

    public create = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            if (!this.validateRequest(req, res)) return;
            const bookData: Omit<IBook, 'id'> = req.body;
            const bookId = await this.bookModel.createBook(bookData);
            this.sendSuccess(res, 'Libro creado exitosamente', { id: bookId }, 201);
        });
    };

    public update = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { id } = req.params;
            if (!this.isValidId(id)) {
                this.sendError(res, 'ID de libro inválido');
                return;
            }
            if (!this.validateRequest(req, res)) return;
            const updated = await this.bookModel.updateBook(parseInt(id), req.body);
            if (!updated) {
                this.sendNotFound(res, 'Libro no encontrado');
                return;
            }
            this.sendSuccess(res, 'Libro actualizado exitosamente');
        });
    };

    public delete = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { id } = req.params;
            if (!this.isValidId(id)) {
                this.sendError(res, 'ID de libro inválido');
                return;
            }
            const deleted = await this.bookModel.deleteBook(parseInt(id));
            if (!deleted) {
                this.sendNotFound(res, 'Libro no encontrado');
                return;
            }
            this.sendSuccess(res, 'Libro eliminado exitosamente');
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
            const books = await this.bookModel.searchBooks(searchTerm, pagination);
            this.sendSuccess(res, 'Búsqueda completada', books);
        });
    };

    // Métodos para relaciones (autores, géneros, archivos)
    public addAuthors = async (req: Request, res: Response): Promise<void> => { /* ... */ };
    public removeAuthor = async (req: Request, res: Response): Promise<void> => { /* ... */ };
    public addGenres = async (req: Request, res: Response): Promise<void> => { /* ... */ };
    public removeGenre = async (req: Request, res: Response): Promise<void> => { /* ... */ };
    public addFiles = async (req: Request, res: Response): Promise<void> => { /* ... */ };
    public removeFile = async (req: Request, res: Response): Promise<void> => { /* ... */ };
}