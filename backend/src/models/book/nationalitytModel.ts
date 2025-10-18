import { INationality, IPaginatedResponse, IPaginationParams } from "@/interfaces";
import { BaseModel } from "../baseModel";

export class NationalityModel extends BaseModel {
    constructor() {
        super('nationalities');
    }

    public async createNationality(nationalityData: Omit<INationality, 'id'>): Promise<number> {
        return await this.create<INationality>(nationalityData);
    }

    public async getAllBooks(pagination?: IPaginationParams): Promise<INationality[] | IPaginatedResponse<INationality> | undefined> {
        if (pagination) {
            const [nationalities, total] = await Promise.all([
                this.findAll<INationality>('1=1', [], pagination),
                this.count()
            ]);

            return this.buildPaginatedResponse(nationalities, pagination, total);
        }

        return await this.findAll<INationality>();
    }

    public async getNationalityById(id: number): Promise<INationality | null> {
        return await this.findById<INationality>(id);
    }

    public async updateNationality(id: number, nationalityData: Partial<INationality>): Promise<boolean> {
        const affectedRows = await this.updateById<INationality>(id, nationalityData);
        return affectedRows > 0;
    }

    public async deleteNationality(id: number): Promise<boolean> {
        const affectedRows = await this.deleteById(id);
        return affectedRows > 0;
    }

    public async searchNationalitys(searchTerm: string, pagination?: IPaginationParams): Promise<INationality[] | IPaginatedResponse<INationality>> {
        const conditions = (`name LIKE ?`);
        const values = [`%${searchTerm}%`];

        if (pagination) {
            const [nationalities, total] = await Promise.all([
                this.findAll<INationality>(conditions, values, pagination),
                this.count(conditions, values)
            ]);

            return this.buildPaginatedResponse(nationalities, pagination, total);
        }

        return await this.findAll<INationality>(conditions, values);
    }
}