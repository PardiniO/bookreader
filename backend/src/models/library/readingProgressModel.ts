import { IPaginatedResponse, IPaginationParams, IReadingProgress } from "@/interfaces";
import { BaseModel } from "../baseModel";

export class ReadingProgressModel extends BaseModel {
    constructor() {
        super('progresses');
    }

    public async createProgress(progressData: Omit<IReadingProgress, 'id'>): Promise<number> {
        const exists = await this.exists('id_user = ? AND id_file = ?', [
            progressData.idUser.toString(),
            progressData.idFile.toString(),
        ]);
        if (exists) throw new Error("Ya existe un progreso de lectura para este usuario y archivo");
        
        if (!progressData.lastRead) {
            progressData.lastRead = new Date();
        }
        
        return await this.create<IReadingProgress>(progressData);
    }

    public async getProgressById(id: number): Promise<IReadingProgress | null> {
        return await this.findById<IReadingProgress>(id);
    }

    public async getProgressByUserAndFile(userId: number, fileId: number): Promise<IReadingProgress | null> {
        return await this.findOne<IReadingProgress>('id_user = ? AND id_file = ?', [
            userId.toString(),
            fileId.toString(),
        ]);
    }

    public async getProgressByFileId(fileId: number, pagination?: IPaginationParams): Promise<IReadingProgress[] | IPaginatedResponse<IReadingProgress>> {
        const conditions = 'id_file = ?';
        const values = [fileId.toString()];

        if (pagination) {
            const [progresses, total] = await Promise.all([
                this.findAll<IReadingProgress>(conditions, values, pagination),
                this.count(conditions, values),
            ]);

            return this.buildPaginatedResponse(progresses, pagination, total);
        }

        return await this.findAll<IReadingProgress>(conditions, values);
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

    public async updateProgress(id: number, progressData: Partial<IReadingProgress>): Promise<boolean> {
        if (progressData.currentPage !== undefined) {
            progressData.lastRead = new Date();
        }

        const affectedRows = await this.updateById<IReadingProgress>(id, progressData);
        return affectedRows > 0;
    }

    public async deleteProgress(id: number): Promise<boolean> {
        const affectedRows = await this.deleteById(id);
        return affectedRows > 0;
    }
}