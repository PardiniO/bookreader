import { ILanguage, IPaginatedResponse, IPaginationParams } from "@/interfaces";
import { BaseModel } from "../baseModel";

export class LanguageModel extends BaseModel {
    constructor() {
        super('languages');
    }

    public async createLanguage(languageData: Omit<ILanguage, 'id'>): Promise<number> {
        return await this.create<ILanguage>(languageData);
    }
    
    public async getAllLanguages(pagination?: IPaginationParams): Promise<ILanguage[] | IPaginatedResponse<ILanguage> | undefined> {
        if (pagination) {
            const [Languages, total] = await Promise.all([
                this.findAll<ILanguage>('1=1', [], pagination),
                this.count()
            ]);

            return this.buildPaginatedResponse(Languages, pagination, total);
        }

        return await this.findAll<ILanguage>();
    }
    
    public async getLanguageById(id: number): Promise<ILanguage | null> {
        return await this.findById<ILanguage>(id);
    }
    
    public async updateLanguage(id: number, languageData: Partial<ILanguage>): Promise<boolean> {
        const affectedRows = await this.updateById<ILanguage>(id, languageData);
        return affectedRows > 0;
    }

    public async deleteLanguage(id: number): Promise<boolean> {
        const affectedRows = await this.deleteById(id);
        return affectedRows > 0;
    }

    public async searchLnaguage(searchTerm: string, pagination?: IPaginationParams): Promise<ILanguage[] | IPaginatedResponse<ILanguage>> {
        const conditions = (`name LIKE ?`);
        const values = [`%${searchTerm}%`];

        if (pagination) {
            const [languages, total] = await Promise.all([
                this.findAll<ILanguage>(conditions, values, pagination),
                this.count(conditions, values)
            ]);

            return this.buildPaginatedResponse(languages, pagination, total);
        }

        return await this.findAll<ILanguage>(conditions, values);
    }
}