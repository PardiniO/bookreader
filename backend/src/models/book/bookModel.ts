import { IBook, IPaginationParams, IPaginatedResponse, IAuthor, IGenre, IBookFile } from "../../interfaces/index";
import { BaseModel } from "../baseModel";

export class BookModel extends BaseModel {
    constructor() {
        super('books');
    }

    public async createBook(bookData: Partial<IBook> & { authors?: IAuthor[]; genres?: IGenre[]; bookFiles?: IBookFile[] }): Promise<number> {
        let insertedBookId: number | null = null;
        const useTx = typeof this.db.beginTransaction === 'function';

        try {
            if (useTx) await this.db.beginTransaction();

            const bookInsertData: Partial<IBook> = {
                idLanguage: (bookData.idLanguage ?? undefined),
                title: bookData.title,
                synopsis: bookData.synopsis ?? undefined,
                publicationDate: bookData.publicationDate ?? undefined,
                rating: bookData.rating ?? undefined,
                coverUrl: bookData.coverUrl ?? undefined,
                externalId: bookData.externalId ?? undefined,
                source: bookData.source ?? 'manual',
                isActive: (bookData.isActive === undefined ? true : (bookData.isActive ? true : false))
            };

            insertedBookId = await this.create<IBook>(bookInsertData);

            if (bookData.authors && bookData.authors.length > 0) {
                for (const author of bookData.authors) {
                    await this.db.insert('book_author', { idBook: insertedBookId, idAuthor: author.id });
                }
            }

            if (bookData.genres && bookData.genres.length > 0) {
                for (const genre of bookData.genres) {
                    await this.db.insert('book_genre', { id_book: insertedBookId, id_genre: genre.id });
                }
            }

            if (bookData.bookFiles && bookData.bookFiles.length > 0) {
                for (const bFile of bookData.bookFiles) {
                    await this.db.insert('book_genre', { id_book: insertedBookId, id_file: bFile.idFile ?? bFile.idFile ?? bFile.idFile });
                }
            }

            return insertedBookId;
        } catch (err) {
            throw err instanceof Error ? err : new Error('Error creando libro');
        }

        return insertedBookId ?? 0;
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
        const updateData: Partial<IBook> = {};

        if (bookData.title !== undefined) updateData.title = bookData.title;
        if (bookData.synopsis !== undefined) updateData.synopsis = bookData.synopsis;
        if (bookData.idLanguage !== undefined) updateData.idLanguage = bookData.idLanguage;
        if (bookData.publicationDate !== undefined) updateData.publicationDate = bookData.publicationDate;
        if (bookData.coverUrl !== undefined) updateData.coverUrl = bookData.coverUrl;
        if (bookData.externalId !== undefined) updateData.externalId = bookData.externalId;
        if (bookData.rating !== undefined) updateData.rating = bookData.rating;
        if (bookData.isActive !== undefined) updateData.isActive = bookData.isActive;

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