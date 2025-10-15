import { ILanguage } from "./languageInterface";
import { IAuthor } from "./authorInterface";
import { IGenre } from "./genreInterface";
import { IBookFile } from "./bookfileInterface";

export type BookSourse = 'openlibrary' | 'manual';

export interface IBook {
    id?: number;
    id_language?: number;
    title: string;
    synopsis?: string;
    publication_date?: Date;
    rating?: number;
    cover_url?: string;
    externalId?: string;
    source: BookSourse;
    is_active?: boolean;

    language?: ILanguage;
    authors?: IAuthor[];
    genres?: IGenre[];
    bookFiles?: IBookFile;
}