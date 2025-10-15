import { IBook, IPaginationParams, IPaginatedResponse, IUser } from "../../interfaces/index";
import { BaseModel } from "../baseModel";

export class BookModel extends BaseModel {
    constructor() {
        super('books');
    }

    public async createBook(bookData: Omit<IUser, 'id'>): Promise<number> {
        return await this.create<IBook>(bookData);
    }

    public async getAllBooks(pagination?: IPaginationParams): Promise<IBook[] | IPaginatedResponse<IBook> | undefined> {
        if (pagination) {
            const [books, total] = await Promise.all([
                this.findAll<IBook>('is_active = 1', [], pagination),
                this.count('is_active = 1')
            ]);

            return this.buildPaginatedResponse(books, pagination, total);
        }

        return await this.findAll<IBook>('is_active = 1');
    }

    public async getBookById(id: number): Promise<IBook | null> {
        return await this.findById<IBook>(id);
    }

    public async updateBook(id: number, bookData: Partial<IBook>): Promise<boolean> {
        const affectedRows = await this.updateById<IBook>(id, bookData);
        return affectedRows > 0;
    }

    public async deleteBook(id: number): Promise<boolean> {
        const affectedRows = await this.deleteById(id);
        return affectedRows > 0;
    }

    public async searchBooks(
        searchTerm: string, pagination?: IPaginationParams
    ): Promise<IBook[] | IPaginatedResponse<IBook>> {
        const conditions = `(title LIKE ? OR synopsis LIKE ?)`;
        const values = [`%${searchTerm}%`, `%${searchTerm}%`];
        if (pagination) {
            const [books, total] = await Promise.all([
                this.findAll<IBook>(conditions, values, pagination),
                this.count(conditions, values)
            ]);

            return this.buildPaginatedResponse(books, pagination, total);
        }

        return await this.findAll<IBook>(conditions, values);
    }
}