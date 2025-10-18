import { IPaginatedResponse, IPaginationParams, IReadingProgress } from "@/interfaces";
import { BaseModel } from "../baseModel";

export class ReadingProgressModel extends BaseModel {
    constructor() {
        super('progresses');
    }

    public async createStatus(progressData: Omit<IReadingProgress, 'id'>): Promise<number> {
        return await this.create(progressData);
    }

    public async getProgressByUserAndFile(userId: number, fileId: number): Promise<IReadingProgress | null> {
        return await this.findOne<IReadingProgress>('id_user = ? AND id_file = ?', [userId.toString(), fileId.toString()]);
    }

    public async getProgressByUserId(userId: number, pagination?: IPaginationParams): Promise<IReadingProgress[] | IPaginatedResponse<IReadingProgress>> {
        const conditions = 'id_user = ?';
        const values = [userId.toString()];

        if (pagination) {
            const [progresses, total] = await Promise.all([
                this.findAll<IReadingProgress>(conditions, values, pagination),
                this.count(conditions, values)
            ]);

            return this.buildPaginatedResponse(progresses, pagination, total);
        }

        return await this.findAll<IReadingProgress>(conditions, values);
    }
    public async getProgressById(id: number): Promise<IReadingProgress | null> {
        return await this.findById<IReadingProgress>(id);
    }
}