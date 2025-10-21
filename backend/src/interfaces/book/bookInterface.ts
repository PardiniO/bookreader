import { ILanguage } from "./languageInterface";
import { IAuthor } from "./authorInterface";
import { IGenre } from "./genreInterface";
import { IBookFile } from "./bookfileInterface";

export type BookSourse = 'openlibrary' | 'manual';

export interface IBook {
    id?: number;
    idLanguage?: string;
    title: string;
    synopsis?: string;
    publicationDate?: Date;
    rating?: number;
    coverUrl?: string;
    externalId?: string;
    source: BookSourse;
    isActive?: boolean;

    language?: ILanguage;
    authors?: IAuthor[];
    genres?: IGenre[];
    bookFiles?: IBookFile[];
}