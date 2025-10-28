import { App } from './app';

class Server {
    private app: App;
    private port: number;

    constructor() {
        this.app = new App();
        this.port = parseInt(process.env.PORT || '3000');
        this.initializeGracefulShutdown();
    }

    public async start(): Promise<void> {
    try {
        // Conectar a la base de datos
        await this.app.connectDatabase();

        // Iniciar servidor
        this.app.getApp().listen(this.port, () => {
        console.log('🚀 Servidor iniciado exitosamente');
        console.log(`📡 Puerto: ${this.port}`);
        console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🔗 URL: http://localhost:${this.port}`);
        console.log(`📚 API: http://localhost:${this.port}/api/v1`);
        console.log(`💊 Health Check: http://localhost:${this.port}/api/v1/health`);
        console.log('-------------------------------------------');
        console.log('✅ Servidor listo para recibir peticiones');
        });

    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
    }

    private initializeGracefulShutdown(): void {
        // Manejo de cierre graceful
        const gracefulShutdown = async (signal: string) => {
            console.log(`\n📴 Recibida señal ${signal}. Cerrando servidor...`);
            
        try {
            // Cerrar conexión de base de datos
            await this.app.closeDatabaseConnection();
            
            console.log('✅ Servidor cerrado exitosamente');
            process.exit(0);
            } catch (error) {
                console.error('❌ Error durante el cierre del servidor:', error);
                process.exit(1);
            }
    };

    // Escuchar señales de cierre
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Manejo de errores no capturados
    process.on('unhandledRejection', (reason, promise) => {
        console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
        gracefulShutdown('unhandledRejection');
    });

    process.on('uncaughtException', (error) => {
        console.error('❌ Uncaught Exception:', error);
        gracefulShutdown('uncaughtException');
        });
    }
}

// Crear e iniciar servidor
const server = new Server();
server.start().catch((error) => {
    console.error('❌ Fallo crítico al iniciar servidor:', error);
    process.exit(1);
});