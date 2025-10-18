import { Database } from '../config/db';
import { IPaginationParams, IPaginatedResponse, IApiResponse } from '../interfaces/index';

export abstract class BaseModel {
    protected db: Database;
    protected tableName: string;
    
    constructor(tableName: string) {
        this.db = Database.getInstance();
        this.tableName = tableName;
    }
    
    protected async create<T>(data: Partial<T>): Promise<number> {
        return await this.db.insert<T>(this.tableName, data);
    }

    protected async findAll<T>(
        conditions: string = '1=1',
        values: string[] = [],
        pagination?: IPaginationParams
    ): Promise<T[]> {
        let sql = `SELECT * FROM ${this.tableName} WHERE ${conditions}`;
        
        if (pagination) {
            sql += ` LIMIT ${pagination.limit} OFFSET ${pagination.offset}`;
            return await this.db.query<T>(sql, [...values, pagination.limit, pagination.offset]);
        }
        
        return await this.db.query<T>(sql, values);
    }

    protected async findById<T>(id: number): Promise<T | null> {
        const sql = `SELECT * FROM ${this.tableName} WHERE id = ? LIMIT 1`;
        return await this.db.queryOne<T>(sql, [id]);
    }

    protected async findOne<T>(conditions: string, values: string[] = []): Promise<T | null> {
        const sql = `SELECT * FROM ${this.tableName} WHERE ${conditions} LIMIT 1`;
        return await this.db.queryOne<T>(sql, values);
    }

    protected async updateById<T>(
        id: number,
        data: Partial<T>
    ): Promise<number> {
        return await this.db.update<T>(this.tableName, data, 'id = ?', [id]);
    }

    protected async deleteById(id: number): Promise<number> {
        return await this.db.delete(this.tableName, 'id = ?', [id]);
    }

    protected async count(conditions: string = '1=1', values: string[] = []): Promise<number> {
        const sql = `SELECT COUNT(*) as total FROM ${this.tableName} WHERE ${conditions}`;
        const result = await this.db.queryOne<{ total: number }>(sql, values);
        return result?.total || 0;
    }

    protected async exists(conditions: string, values: string[] = []): Promise<boolean> {
        const count = await this.count(conditions, values);
        return count > 0;
    }

    protected buildPaginatedResponse<T>(
        data: T[],
        pagination: IPaginationParams,
        total: number,
        message: string = 'Datos obtenidos exitosamente'
    ): IPaginatedResponse<T> {
        const totalPages = Math.ceil(total / pagination.limit);
        
        return {
            success: true,
            message,
            data,
            pagination: {
                page: pagination.page,
                limit: pagination.limit,
                total,
                totalPages
            }
        };
    }
}