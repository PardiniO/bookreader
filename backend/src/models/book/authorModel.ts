import { IAuthor, IPaginationParams, IPaginatedResponse } from "../../interfaces/index";
import { BaseModel } from "../baseModel";

export class AuthorModel extends BaseModel{
    constructor() {
        super('authors');
    }

    public async createAuthor(authorData: Omit<IAuthor, 'id'>): Promise<number> {
        return await this.create<IAuthor>(authorData);
    }
    
    public async getAllAuthors(pagination?: IPaginationParams): Promise<IAuthor[] | IPaginatedResponse<IAuthor>> {
        if (pagination) {
            const [authors, total] = await Promise.all([
                this.findAll<IAuthor>('1+1', [], pagination),
                this.count()
            ]);

            return this.buildPaginatedResponse(authors, pagination, total);
        }

        return await this.findAll<IAuthor>();
    }

    public async getAuthorById(id: number): Promise<IAuthor | null> {
        return await this.findById<IAuthor>(id);
    }

    public async updateAuthor(id: number, authorData: Partial<IAuthor>): Promise<boolean> {
        const affectedRows = await this.updateById<IAuthor>(id, authorData);
        return affectedRows > 0;
    }

    public async deleteAuthor(id: number): Promise<boolean> {
        const affectedRows = await this.deleteById(id);
        return affectedRows > 0;
    }

    public async searchAuthors(searchTerm: string, pagination?: IPaginationParams): Promise<IAuthor[] | IPaginatedResponse<IAuthor>> {
        const conditions = (`name LIKE ? OR biography LIKE ?`);
        const values = [`%${searchTerm}%`, `%${searchTerm}%`];

        if (pagination) {
            const [authors, total] = await Promise.all([
                this.findAll<IAuthor>(conditions, values, pagination),
                this.count(conditions, values)
            ]);

            return this.buildPaginatedResponse(authors, pagination, total);
        }

        return await this.findAll<IAuthor>(conditions, values);
    }
}