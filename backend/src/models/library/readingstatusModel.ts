import { BaseModel } from "../baseModel";
import { IReadingStatus, IPaginationParams, IPaginatedResponse } from "../../interfaces/index";

export class ReadingStatusModel extends BaseModel {
    constructor() {
        super('reading_status');
    }

    public async createStatus(statusData: Omit<IReadingStatus, 'id'>): Promise<number> {
        return await this.create<IReadingStatus>(statusData);
    }

    public async getAllStatuses(pagination?: IPaginationParams): Promise<IReadingStatus[] | IPaginatedResponse<IReadingStatus>> {
        if (pagination) {
            const [statuses, total] = await Promise.all([
                this.findAll<IReadingStatus>('1=1', [], pagination),
                this.count()
            ]);
            return this.buildPaginatedResponse(statuses, pagination, total);
        }
        return await this.findAll<IReadingStatus>();
    }

    public async getStatusById(id: number): Promise<IReadingStatus | null> {
        return await this.findById<IReadingStatus>(id);
    }

    public async updateStatus(id: number, statusData: Partial<IReadingStatus>): Promise<boolean> {
        const affectedRows = await this.updateById<IReadingStatus>(id, statusData);
        return affectedRows > 0;
    }

    public async deleteStatus(id: number): Promise<boolean> {
        const affectedRows = await this.deleteById(id);
        return affectedRows > 0;
    }

    public async existsStatus(value: string): Promise<boolean> {
        return await this.exists('status = ?', [value]);
    }
}