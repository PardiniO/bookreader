import { Router } from "express";
import { UserRouter } from "./userRoutes";
import { BookRouter } from "./bookRoutes";
import { AuthorRouter } from "./authorRoutes";
import { FileRouter } from "./fileRoutes";
import { GenreRouter } from "./genreRoutes";
import { HighlightRouter } from "./highlightRoutes";
import { LanguageRouter } from "./languageRoutes";
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
    private languageRoutes: LanguageRouter;
    private libraryRoutes: LibraryRouter;
    private nationalityRoutes: NationalityRouter;
    private noteRoutes: NoteRouter;
    private progressRoutes: ProgressRouter;
    private readingStatusRoutes: ReadingStatusRouter;


    constructor() {
        this.router = Router();
        this.userRoutes = new UserRouter();
        this.bookRoutes = new BookRouter();


        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        //ruta de salud/estado de la API
        this.router.get('/health', (req, res) => {
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
        this.router.get('/', (req, res) => {
            res.status(200).json({
                success: true,
                message: 'Bienvenido a la API Node7 TypeScript Backend',
                data: {
                    name: 'Node7 TypeScript Backend API',
                    version: '1.0.0',
                    description: 'API REST desarrollada con Node7, TypeScript, Express y MySQL',
                    endpoints: {
                        users: '/api/v1/users',
                        health: '/api/v1/health'
                    },
                    documentation: '',
                    timestamp: new Date().toISOString()
                }
            });
        });

        //registrar rutas de módulos
        this.router.use('/users', this.userRouter.geRouter());
        this.router.use('/books', this.bookRouter.getRouter() as unknown as Router);
        

    }

    public getRouter(): Router {
        return this.router;
    }
}

export const apiRoutes = new ApiRoutes();