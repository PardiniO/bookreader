import { BaseModel } from "../baseModel";
import { IFile, IPaginationParams, IPaginatedResponse } from "../../interfaces/index";

export class FileModel extends BaseModel {
    constructor() {
        super('files');
    }

    public async createFile(fileData: Omit<IFile, 'id'>): Promise<number> {
        return await this.create(fileData);
    }

    public async getAllFiles(pagination?: IPaginationParams): Promise<IFile[] | IPaginatedResponse<IFile>> {
        if (pagination) {
            const [files, total] = await Promise.all([
                this.findAll<IFile>('1=1', [], pagination),
                this.count()
            ]);
            return this.buildPaginatedResponse(files, pagination, total);
        }
        return await this.findAll<IFile>();
    }

    public async getFileById(id: number): Promise<IFile | null> {
        return await this.findById(id);
    }

    public async getFileByUserId(userId: number,pagination?: IPaginationParams): Promise<IFile[] | IPaginatedResponse<IFile>> {
        const conditions = 'id_user = ?';
        const values = [userId.toString()];

        if (pagination) {
            const [files, total] = await Promise.all([
                this.findAll<IFile>(conditions, values, pagination),
                this.count(conditions, values)
            ]);

            return this.buildPaginatedResponse(files, pagination, total);
        }

        return await this.findAll<IFile>(conditions, values);
    }

    public async getFileByBookId(bookId: number, pagination?: IPaginationParams): Promise<IFile[] | IPaginatedResponse<IFile>> {
        const conditions = 'id_book = ?';
        const values = [bookId.toString()];

        if (pagination) {
            let sql = `SELECT file.* FROM file
                        JOIN book_file ON book_file.id_file = file.id
                        WHERE ${conditions}
                        LIMIT ? OFFSET ?`;
            const files = await this.db.query<IFile>(sql, [bookId, pagination.limit, pagination.offset]);
            const countSql = `SELECT COUNT(*) as total FROM file
                        JOIN book_file ON book_file.id_file = file.id
                        WHERE ${conditions}`;
            const countRes = await this.db.queryOne<{ total: number }>(countSql, [bookId]);
            const total = countRes?.total || 0;

            return this.buildPaginatedResponse(files, pagination, total);
        }

        let sql = `SELECT file.* FROM file
                    JOIN book_file ON book_file.id_file = file.id
                    WHERE ${conditions}`;
        return await this.db.query<IFile>(sql, values);
    }

    public async updateFile(id: number, fileData: Partial<IFile>): Promise<boolean> {
        const affectedRows = await this.updateById<IFile>(id, fileData);
        return affectedRows > 0;
    }

    public async deleteFile(id: number): Promise<boolean> {
        const affectedRows = await this.deleteById(id);
        return affectedRows > 0;
    }

    //cambiarlo
    public async hardDeleteFile(id: number): Promise<boolean> {
        const affectedRows = await this.deleteById(id);
        return affectedRows > 0;
    }

    public async searchFiles(searchTerm: string, pagination?: IPaginationParams): Promise<IFile[] | IPaginatedResponse<IFile>> {
        const conditions = '(filename LIKE ? OR mimetype LIKE ? OR path LIKE ?)';
        const values = [`%${conditions}%`, `%${conditions}%`, `%${conditions}%`];

        if (pagination) {
            const [files, total] = await Promise.all([
                this.findAll<IFile>(conditions, values, pagination),
                this.count(conditions, values)
            ]);

            return this.buildPaginatedResponse(files, pagination, total);
        }

        return await this.findAll<IFile>(conditions, values);
    }

    public async getFileForDownload(id: number, userId?: number): Promise<IFile | null> {
        const file = await this.findById<IFile>(id);
        if (!file) return null;
        if (userId !== undefined && file.id_user !== userId) {
            return null;
        }
        return file;
    }

    public async linkFileToBook(fileId: number, bookId: number): Promise<boolean> {
        let existSql = `SELECT COUNT(*) as total FROM book_file
                    WHERE id_file = ? AND id_book = ?`;
        let existsRes = await this.db.query<{ total:number }>(existSql, [fileId, bookId]);
        if (existsRes && existsRes.length > 0) return true;

        const insertedId = await this.db.insert('book_file', { id_book: bookId, id_file: fileId });
        return insertedId > 0;
    }

    public async dissconectFileFromBook(fileId: number, bookId: number): Promise<boolean> {
        const affectedRows = await this.db.delete('book_file', 'id_file = ? AND id_book = ?', [fileId, bookId]);
        return affectedRows > 0;
    }

    public async getFileStatus(id: number): Promise<{ exists: boolean; linkedCount: number }> {
        const file = await this.findById<IFile>(id);
        if (!file) return { exists: false, linkedCount: 0 };

        let countSql = `SELECT COUNT(*) as total FROM book_file WHERE id_file = ?`;
        let countRes = await this.db.queryOne<{ total: number }>(countSql, [id]);
        const linkedCount = countRes?.total || 0;
        return { exists: true, linkedCount };
    }

    public async validateOwnership(fileId: number, userId: number): Promise<boolean> {
        const file = await this.findById<IFile>(fileId);
        if (!file) return false;
        return file.id_user === userId;
    }
}