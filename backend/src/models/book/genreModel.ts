import { IGenre, IPaginatedResponse, IPaginationParams } from "@/interfaces";
import { BaseModel } from "../baseModel";

export class GenreModel extends BaseModel {
    constructor() {
        super('genres');
    }

    public async createGenre(genreData: Omit<IGenre, 'id'>): Promise<number> {
        return await this.create<IGenre>(genreData);
    }

    public async getAllGenres(pagination?: IPaginationParams): Promise<IGenre[] | IPaginatedResponse<IGenre> | undefined> {
        if (pagination) {
            const [genres, total] = await Promise.all([
                this.findAll<IGenre>('1=1', [], pagination),
                this.count()
            ]);

            return this.buildPaginatedResponse(genres, pagination, total);
        }

        return await this.findAll<IGenre>();
    }

    public async getGenreById(id: number): Promise<IGenre | null> {
        return await this.findById<IGenre>(id);
    }

    public async updateGenre(id: number, genreData: Partial<IGenre>): Promise<boolean> {
        const affectedRows = await this.updateById<IGenre>(id, genreData);
        return affectedRows > 0;
    }

    public async deleteGenre(id: number): Promise<boolean> {
        const affectedRows = await this.deleteById(id);
        return affectedRows > 0;
    }

    public async searchGenres(searchTerm: string, pagination?: IPaginationParams): Promise<IGenre[] | IPaginatedResponse<IGenre>> {
        const conditions = (`name LIKE ?`);
        const values = [`%${searchTerm}%`];

        if (pagination) {
            const [genres, total] = await Promise.all([
                this.findAll<IGenre>(conditions, values, pagination),
                this.count(conditions, values)
            ]);

            return this.buildPaginatedResponse(genres, pagination, total);
        }

        return await this.findAll<IGenre>(conditions, values);
    }
}