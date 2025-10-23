import { ILibrary, IPaginatedResponse, IPaginationParams } from "../../interfaces/index";
import { BaseModel } from "../baseModel";

export class LibraryModel extends BaseModel {
    constructor() {
        super('libraries');
    }

    public async createLibrary(libraryData: Omit<ILibrary, 'id'>): Promise<number> {
        const exists = await this.exists('id_user = ? AND id_book = ?', [
            libraryData.idUser.toString(),
            libraryData.idBook.toString(),
        ]);
        if (exists) throw new Error("Este libro ya está en la biblioteca del usuario");
        
        return await this.create<ILibrary>(libraryData);
    }

    public async getLibraryById(id: number): Promise<ILibrary | null> {
        return await this.findById<ILibrary>(id);
    }

    public async getLibraryByUserId(userId: number, pagination?: IPaginationParams): Promise<ILibrary[] | IPaginatedResponse<ILibrary>> {
        const conditions = `id_user = ?`;
        const values = [userId.toString()];

        if (pagination) {
            const [libraries, total] = await Promise.all([
                this.findAll<ILibrary>(conditions, values, pagination),
                this.count(conditions, values)
            ]);

            return this.buildPaginatedResponse(libraries, pagination, total);
        }

        return await this.findAll<ILibrary>(conditions, values);
    }

    public async getLibraryByBookId(bookId: number, pagination?: IPaginationParams): Promise<ILibrary[] | IPaginatedResponse<ILibrary>> {
        const conditions = `id_book = ?`;
        const values = [bookId.toString()];

        if (pagination) {
            const [libraries, total] = await Promise.all([
                this.findAll<ILibrary>(conditions, values, pagination),
                this.count(conditions, values)
            ]);

            return this.buildPaginatedResponse(libraries, pagination, total);
        }

        return await this.findAll<ILibrary>(conditions, values);
    }

    public async getLibraryByStatus(readingStatusId: number, pagination?: IPaginationParams): Promise<ILibrary[] | IPaginatedResponse<ILibrary>> {
        const conditions = `id_reading_status = ?`;
        const values = [readingStatusId.toString()];

        if (pagination) {
            const [libraries, total] = await Promise.all([
                this.findAll<ILibrary>(conditions, values, pagination),
                this.count(conditions, values)
            ]);

            return this.buildPaginatedResponse(libraries, pagination, total);
        }

        return await this.findAll<ILibrary>(conditions, values);
    }

    public async updateLibrary(id: number, libraryData: Partial<ILibrary>): Promise<boolean> {
        const existingLibrary = await this.getLibraryById(id);
        if (!existingLibrary) {
            throw new Error("Biblioteca no encontrada");
        }

        const affectedRows = await this.updateById<ILibrary>(id, libraryData);
        return affectedRows > 0;
    }

    public async deleteLibrary(id: number): Promise<boolean> {
        const affectedRows = await this.deleteById(id);
        return affectedRows > 0;
    }

    public async searchLibraries(searchTerm: string, pagination?: IPaginationParams): Promise<ILibrary[] | IPaginatedResponse<ILibrary>> {
        const conditions = `
            id_book IN (SELECT id FROM book WHERE title LIKE ?)
            OR id_user IN (SELECT id FROM user WHERE username LIKE ?)
        `;
        const values = [`%${searchTerm}%`, `%${searchTerm}%`];
        
        if (pagination) {
            const [libraries, total] = await Promise.all([
                this.findAll<ILibrary>(conditions, values, pagination),
                this.count(conditions, values)
            ]);

            return this.buildPaginatedResponse(libraries, pagination, total);
        }

        return await this.findAll<ILibrary>(conditions, values);
    }
}