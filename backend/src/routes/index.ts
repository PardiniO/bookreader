import { Router } from "express";
import { UserRouter } from "./userRoutes";
import { BookRouter } from "./bookRoutes";
import { AuthorRouter } from "./authorRoutes";
import { FileRouter } from "./fileRoutes";
import { GenreRouter } from "./genreRoutes";
import { HighlightRouter } from "./highlightRoutes";
import { LanguagetRouter } from "./languageRoutes";
import { LibraryRouter } from "./libraryRoutes";
import { NationalityRouter } from "./nationalityRoutes";
import { NoteRouter } from "./noteRoutes";
import { ProgressRouter } from "./progressRoutes";
import { ReadingStatusRouter } from "./readingStatusRouter";

export class ApiRoutes {
    public router: Router;
    private userRoutes: UserRouter;
    private bookRoutes: BookRouter;
    private authorRoutes: AuthorRouter;
    private fileRoutes: FileRouter;
    private genreRoutes: GenreRouter;
    private highlighRoutes: HighlightRouter;
    private languageRoutes: LanguagetRouter;
    private libraryRoutes: LibraryRouter;
    private nationalityRoutes: NationalityRouter;
    private noteRoutes: NoteRouter;
    private progressRoutes: ProgressRouter;
    private readingStatusRoutes: ReadingStatusRouter;


    constructor() {
        this.router = Router();
        this.userRoutes = new UserRouter();
        this.bookRoutes = new BookRouter();
        this.authorRoutes = new AuthorRouter();
        this.fileRoutes = new FileRouter();
        this.genreRoutes = new GenreRouter();
        this.highlighRoutes = new HighlightRouter();
        this.languageRoutes = new LanguagetRouter();
        this.libraryRoutes = new LibraryRouter();
        this.nationalityRoutes = new NationalityRouter();
        this.noteRoutes = new NoteRouter();
        this.progressRoutes = new ProgressRouter();
        this.readingStatusRoutes = new ReadingStatusRouter();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        //ruta de salud/estado de la API
        this.router.get('/health', (_req, res) => {
            res.status(200).json({
                sucess: true,
                message: 'API funcionando correctamente',
                data: {
                    status: 'healthy',
                    timestamp: new Date().toISOString(),
                    version: '1.0.0',
                    environment: process.env.NODE_ENV || 'development'
                }
            });
        });

        //información de la API
        this.router.get('/', (_req, res) => {
            res.status(200).json({
                success: true,
                message: 'Bienvenido a la API Node7 TypeScript Backend',
                data: {
                    name: 'Node7 TypeScript Backend API',
                    version: '1.0.0',
                    description: 'API REST desarrollada con Node7, TypeScript, Express y MySQL',
                    endpoints: {
                        users: '/api/v1/users',
                        books: '/api/v1/books',
                        authors: '/api/v1/authors',
                        files: '/api/v1/files',
                        libraries: '/api/v1/libraries',
                        progresses: '/api/v1/progress',
                        statuses: '/api/v1/reading-status',
                        notes: '/api/v1/notes',
                        highlights: '/api/v1/highlights',
                        genres: '/api/v1/genres',
                        nationalities: '/api/v1/nationalities',
                        health: '/api/v1/health'
                    },
                    documentation: '',
                    timestamp: new Date().toISOString()
                }
            });
        });

        //registrar rutas de módulos
        this.router.use('/users', this.userRoutes.getRouter);
        this.router.use('/books', this.bookRoutes.getRouter());
        this.router.use('/files', this.fileRoutes.getRouter());
        this.router.use('/authors', this.authorRoutes.getRouter());
        this.router.use('/libraries', this.libraryRoutes.getRouter());
        this.router.use('/progress', this.progressRoutes.getRouter());
        this.router.use('/reading-status', this.readingStatusRoutes.getRouter());
        this.router.use('/notes', this.noteRoutes.getRouter());
        this.router.use('/highlights', this.highlighRoutes.getRouter());
        this.router.use('/genres', this.genreRoutes.getRouter());
        this.router.use('/languages', this.languageRoutes.getRouter());
        this.router.use('/nationalities', this.nationalityRoutes.getRouter());
    }

    public getRouter(): Router {
        return this.router;
    }
}

export const apiRoutes = new ApiRoutes();