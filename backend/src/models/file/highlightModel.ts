import { IHighlight, IPaginationParams, IPaginatedResponse, INote } from "../../interfaces/index";
import { BaseModel } from "../baseModel";

export class HighlightModel extends BaseModel {
    constructor() {
        super('highlighs');
    }

    public async createHighlight(highlighData: Omit<IHighlight, 'id'>): Promise<number> {
        return await this.create<INote>(highlighData);
    }

    public async getAllHighlights(pagination?: IPaginationParams): Promise<IHighlight[] | IPaginatedResponse<IHighlight>>{
        if (pagination) {
            const [highlighs, total] = await Promise.all([
                this.findAll<IHighlight>('1=1', [], pagination),
                this.count()
            ]);

            return this.buildPaginatedResponse(highlighs, pagination, total);
        }

        return await this.findAll<IHighlight>();
    }

    public async getHighlightById(id: number): Promise<IHighlight | null>{
        return await this.findById<IHighlight>(id);
    }

    public async getHighlightByProgressId(progressId: number, pagination?: IPaginationParams): Promise<IHighlight[] | IPaginatedResponse<IHighlight>>{
        const conditions = 'id_progress = ?';
        const values = [progressId.toString()];

        if (pagination) {
            const [highlighs, total] = await Promise.all([
                this.findAll<IHighlight>(conditions, values, pagination),
                this.count(conditions, values)
            ]);

            return this.buildPaginatedResponse(highlighs, pagination, total);
        }

        return await this.findAll<IHighlight>(conditions, values);
    }

    public async updateHighlight(id: number, highlighData: Partial<IHighlight>): Promise<boolean>{
        const affectedRows = await this.updateById<IHighlight>(id, highlighData);
        return affectedRows > 0;
    }

    public async deleteHighlight(id: number): Promise<boolean>{
        const affectedRows = await this.deleteById(id);
        return affectedRows > 0;
    }
    
    public async searchHighlights(searchTerm: string, pagination?: IPaginationParams): Promise<IHighlight[] | IPaginatedResponse<IHighlight>>{
        const conditions = `(highlighted_text LIKE ? OR page LIKE ?)`;
        const values = [`%${searchTerm}%`, `%${searchTerm}%`];

        if (pagination) {
            const [highlighs, total] = await Promise.all([
                this.findAll<IHighlight>(conditions, values, pagination),
                this.count(conditions, values)
            ]);

            return this.buildPaginatedResponse(highlighs, pagination, total);
        }

        return await this.findAll<IHighlight>(conditions, values);
    }
}