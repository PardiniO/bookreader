import { Router } from "express";
import { UserRouter } from "./userRoutes";
import { BookRouter } from "./bookRoutes";

export class ApiRoutes {
    public router: Router;
    private userRouter: UserRouter;
    private bookRouter: BookRouter;


    constructor() {
        this.router = Router();
        this.userRouter = new UserRouter();
        this.bookRouter = new BookRouter();


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
        this.router.use('/books', this.bookRouter.getRouter());
        

    }

    public getRouter(): Router {
        return this.router;
    }
}

export const apiRoutes = new ApiRoutes();