import { BaseModel } from "../baseModel";
import { INote, IPaginationParams, IPaginatedResponse } from "../../interfaces/index";

export class NoteModel extends BaseModel {
    constructor() {
        super('notes');
    }

    public async createNote(noteData: Omit<INote, 'id'>): Promise<number> {
        return await this.create<INote>(noteData);
    }

    public async getAllNotes(pagination?: IPaginationParams): Promise<INote[] | IPaginatedResponse<INote>> {
        if (pagination) {
            const [notes, total] = await Promise.all([
                this.findAll<INote>('1=1', [], pagination),
                this.count()
            ]);

            return this.buildPaginatedResponse(notes, pagination, total);
        }
        
        return await this.findAll<INote>();
    }

    public async getNoteById(id: number): Promise<INote | null> {
        return await this.findById<INote>(id);
    }

    public async getNoteByProgressId(progressId: number, pagination?: IPaginationParams): Promise<INote[] | IPaginatedResponse<INote>> {
        const conditions = 'id_progress = ?';
        const values = [progressId.toString()];

        if (pagination) {
            const [notes, total] = await Promise.all([
                this.findAll<INote>(conditions, values, pagination),
                this.count(conditions, values)
            ]);

            return this.buildPaginatedResponse(notes, pagination, total);
        }

        return await this.findAll<INote>(conditions, values);
    }

    public async updateNote(id: number, noteData: Partial<INote>): Promise<boolean> {
        const affectedRows = await this.updateById<INote>(id, noteData);
        return affectedRows > 0;
    }

    public async deleteNote(id: number): Promise<boolean> {
        const affectedRows = await this.deleteById(id);
        return affectedRows > 0;
    }

    public async searchNote(searchTerm: string, pagination?: IPaginationParams): Promise<INote[] | IPaginatedResponse<INote>> {
        const conditions = `(text LIKE ? OR page LIKE = ?)`;
        const values = [`%${searchTerm}%`, `%${searchTerm}%`];

        if (pagination) {
            const [notes, total] = await Promise.all([
                this.findAll<INote>(conditions, values, pagination),
                this.count(conditions, values)
            ]);

            return this.buildPaginatedResponse(notes, pagination, total);
        }

        return await this.findAll<INote>(conditions, values);
    }
}