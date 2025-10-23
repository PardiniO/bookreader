import { Request, Response } from 'express';
import { BookModel } from '../../models/book/bookModel';
import { BaseController } from '../baseController';
import { IBook } from '../../interfaces';

export class BookController extends BaseController {
    private bookModel: BookModel;

    constructor() {
        super();
        this.bookModel = new BookModel();
    }    

    public createBook = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            if (!this.validateRequest(req, res)) return;

            const bookData: Omit<IBook, 'id'> = req.body;
            const bookId = await this.bookModel.createBook(bookData);
            
            this.sendSuccess(res, 'Libro creado exitosamente', { id: bookId }, 201);
        });
    };

    public getAllBooks = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const pagination = this.getPaginationParams(req);
            const books = await this.bookModel.getAllBooks(pagination);
            this.sendSuccess(res, 'Libros obtenidos exitosamente', books);
        });    
    };    

    public getBooksById = async (req: Request, res: Response): Promise<void> => {
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
    
    public updateBook = async (req: Request, res: Response): Promise<void> => {
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

    public deleteBook = async (req: Request, res: Response): Promise<void> => {
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

    public searchBook = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { query: searchTerm } = req.query;
            if (!searchTerm || typeof searchTerm !== 'string') {
                this.sendError(res, 'Término de búsqueda requerido');
                return;
            }

            const pagination = this.getPaginationParams(req);
            const books = await this.bookModel.searchBooks(searchTerm, pagination);
            
            this.sendSuccess(res, 'Búsqueda de libros completada', books);
        });
    };

    public getBooksByAuthor = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { authorId } = req.params;

            if (!this.isValidId(authorId)) {
                this.sendError(res, 'ID de autor inválido');
            }

            const pagination = this.getPaginationParams(req);
            const books = await this.bookModel.getBooksByAuthor(parseInt(authorId), pagination);

            this.sendSuccess(res, 'Libros por autor obtenidos exitosamente', books);
        });
    };
    
    public getBooksByGenre = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { genreId } = req.params;

            if (!this.isValidId(genreId)) {
                this.sendError(res, 'ID de género inválido');
                return;
            }

            const pagination = this.getPaginationParams(req);
            const books = await this.bookModel.getBookByGenre(parseInt(genreId), pagination);

            this.sendSuccess(res, 'Libros por género obtenidos exitosamente', books);
        });
    };
    
    public getBooksByLanguage = async (req: Request, res: Response): Promise<void> => {
        await this.handleAsyncRoute(req, res, async (req, res) => {
            const { languageId } = req.params;

            if (!this.isValidId(languageId)) {
                this.sendError(res, 'ID de género inválido');
                return;
            }

            const pagination = this.getPaginationParams(req);
            const books = await this.bookModel.getBookByLanguage(parseInt(languageId), pagination);

            this.sendSuccess(res, 'Libros por idioma obtenidos exitosamente', books);
        });
    };
}