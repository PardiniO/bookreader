import { ILibary, IPaginatedResponse, IPaginationParams } from "../interfaces/index";
import { BaseModel } from "./baseModel";

export class LibraryModel extends BaseModel {
    constructor() {
        super('libraries');
    }

    public async createLibrary(libraryData: Omit<ILibary, 'id'>): Promise<number> {
        return await this.create<ILibary>(libraryData);
    }

    public async getLibraryById(id: number): Promise<ILibary | null> {
        return await this.findById<ILibary>(id);
    }

    public async getLibraryByUserId(userId: number, pagination?: IPaginationParams): Promise<ILibary[] | IPaginatedResponse<ILibary>> {
        const conditions = `user_id = ?`;
        const values = [userId.toString()];

        if (pagination) {
            const [libraries, total] = await Promise.all([
                this.findAll<ILibary>(conditions, values, pagination),
                this.count(conditions, values)
            ]);

            return this.buildPaginatedResponse(libraries, pagination, total);
        }

        return await this.findAll<ILibary>(conditions, values);
    }

    public async updateLibrary(id: number, libraryData: Partial<ILibary>): Promise<boolean> {
        const existingLibrary = await this.getLibraryById(id);
        if (!existingLibrary) {
            throw new Error("Biblioteca no encontrada");
        }

        const affectedRows = await this.updateById<ILibary>(id, libraryData);
        return affectedRows > 0;
    }

    public async deleteLibrary(id: number): Promise<boolean> {
        const affectedRows = await this.deleteById(id);
        return affectedRows > 0;
    }

    public async searchLibraries(searchTerm: string, pagination?: IPaginationParams): Promise<ILibary[] | IPaginatedResponse<ILibary>> {
        const conditions = `(name LIKE ? OR description LIKE ?)`;
        const values = [`%${searchTerm}%`, `%${searchTerm}%`];
        if (pagination) {
            const [libraries, total] = await Promise.all([
                this.findAll<ILibary>(conditions, values, pagination),
                this.count(conditions, values)
            ]);

            return this.buildPaginatedResponse(libraries, pagination, total);
        }

        return await this.findAll<ILibary>(conditions, values);
    }
}