import { IBook, IPaginationParams, IPaginatedResponse, IAuthor, IGenre, IBookFile } from "../../interfaces/index";
import { BaseModel } from "../baseModel";

export class BookModel extends BaseModel {
    constructor() {
        super('books');
    }

    public async createBook(bookData: Partial<IBook> & { authors?: IAuthor[]; genres?: IGenre[]; bookFiles?: IBookFile[] }): Promise<number> {
        let insertedBookId: number | null = null;
        
        try {
            const bookInsertData: Partial<IBook> = {
                idLanguage: bookData.idLanguage,
                title: bookData.title,
                synopsis: bookData.synopsis,
                publicationDate: bookData.publicationDate,
                rating: bookData.rating,
                coverUrl: bookData.coverUrl,
                externalId: bookData.externalId,
                source: bookData.source ?? 'manual',
                isActive: bookData.isActive ?? true,
            };

            insertedBookId = await this.create<IBook>(bookInsertData);

            if (bookData.authors?.length) {
                for (const author of bookData.authors) {
                    await this.db.insert('book_author', { 
                        idBook: insertedBookId, 
                        idAuthor: author.id,
                    });
                }
            }

            if (bookData.genres?.length) {
                for (const genre of bookData.genres) {
                    await this.db.insert('book_genre', { 
                        idBook: insertedBookId, 
                        idGenre: genre.id,
                    });
                }
            }

            if (bookData.bookFiles?.length) {
                for (const bFile of bookData.bookFiles) {
                    await this.db.insert('book_file', { 
                        idBook: insertedBookId, 
                        idFile: bFile.idFile,
                    });
                }
            }

            return insertedBookId;
        } catch (err) {
            console.error('❌ Error creando libro:', err);
            throw err instanceof Error ? err : new Error('Error creando libro');
        }
    }

    public async getAllBooks(pagination?: IPaginationParams): Promise<IBook[] | IPaginatedResponse<IBook> | undefined> {
        const condition = 'is_active = 1';
        if (pagination) {
            const [books, total] = await Promise.all([
                this.findAll<IBook>(condition, [], pagination),
                this.count(condition),
            ]);

            return this.buildPaginatedResponse(books, pagination, total);
        }

        return await this.findAll<IBook>(condition);
    }

    public async getBookById(id: number): Promise<IBook | null> {
        return await this.findById<IBook>(id);
    }

    public async getBooksByAuthor(authorId: number, pagination?: IPaginationParams): Promise<IBook[] | IPaginatedResponse<IBook>> {
        const sql = `
            SELECT book.*
            FROM book
            JOIN book_author ON book_author.id_book = book.id
            WHERE book_author.id_author = ? AND book.is_active = 1
        `;

        if (pagination) {
            const offset = (pagination.page - 1) * pagination.limit;
            const limit = pagination.limit;
            const books = await this.db.query<IBook>(`${sql}  LIMIT ? OFFSET ?`, [authorId, limit, offset]);
            const count = await this.db.queryOne<{ total: number }>(
                'SELECT COUNT(*) as total FROM book_author WHERE id_author = ?', [authorId]
            );
            
            return this.buildPaginatedResponse(books, pagination, count?.total || 0);
        }
        return await this.db.query<IBook>(sql, [authorId]);
    }

    public async getBookByGenre(genreId: number, pagination?: IPaginationParams): Promise<IBook[] | IPaginatedResponse<IBook>> {
        const sql = `
            SELECT book.*
            FROM book
            JOIN book_genre ON book_genre.id_book = book.id
            WHERE book_genre.id_genre = ? AND book.is_active = 1
        `;

        if (pagination) {
            const offset = (pagination.page - 1) * pagination.limit;
            const limit = pagination.limit;
            const books = await this.db.query<IBook>(`${sql}, LIMIT ? OFFSET ?`, [genreId, limit, offset]);
            const count = await this.db.queryOne<{ total: number }>(
                'SELECT COUNT(*) as total FROM book_genre WHERE id_genre = ?', [genreId]
            );
            return this.buildPaginatedResponse(books, pagination, count?.total || 0);
        }
        return await this.db.query<IBook>(sql, [genreId]);
    }

    public async getBookByLanguage(languageId: number, pagination?: IPaginationParams): Promise<IBook[] | IPaginatedResponse<IBook>> {
        const condition = 'id_language = ? AND is_active = 1';
        const values = [languageId.toString()];

        if (pagination) {
            const [books, total] = await Promise.all([
                this.findAll<IBook>(condition, values, pagination),
                this.count(condition, values),
            ]);
            return this.buildPaginatedResponse(books, pagination, total);
        }

        return await this.findAll<IBook>(condition, values);
    }

    public async updateBook(id: number, bookData: Partial<IBook>): Promise<boolean> {
        const updateData: Partial<IBook> = {};

        if (bookData.title !== undefined) updateData.title = bookData.title;
        if (bookData.synopsis !== undefined) updateData.synopsis = bookData.synopsis;
        if (bookData.idLanguage !== undefined) updateData.idLanguage = bookData.idLanguage;
        if (bookData.publicationDate !== undefined) updateData.publicationDate = bookData.publicationDate;
        if (bookData.coverUrl !== undefined) updateData.coverUrl = bookData.coverUrl;
        if (bookData.externalId !== undefined) updateData.externalId = bookData.externalId;
        if (bookData.rating !== undefined) updateData.rating = bookData.rating;
        if (bookData.isActive !== undefined) updateData.isActive = bookData.isActive;

        const affectedRows = await this.updateById<IBook>(id, updateData);
        return affectedRows > 0;
    }
    
    public async deleteBook(id: number): Promise<boolean> {
        const affectedRows = await this.deleteById(id);
        return affectedRows > 0;
    }

    public async searchBooks(
        searchTerm: string, pagination?: IPaginationParams
    ): Promise<IBook[] | IPaginatedResponse<IBook>> {
        const condition = `(title LIKE ?)`;
        const values = [`%${searchTerm}%`, `%${searchTerm}%`];

        if (pagination) {
            const [books, total] = await Promise.all([
                this.findAll<IBook>(condition, values, pagination),
                this.count(condition, values)
            ]);    

            return this.buildPaginatedResponse(books, pagination, total);
        }    

        return await this.findAll<IBook>(condition, values);
    }
}