import { ILanguage } from "./languageInterface";
import { IAuthor } from "./authorInterface";
import { IGenre } from "./genreInterface";
import { IBookFile } from "./bookfileInterface";

export type BookSource = 'openlibrary' | 'manual';

export interface IBook {
    id?: number;
    idLanguage?: number;
    title: string;
    synopsis?: string;
    publicationDate?: Date;
    rating?: number;
    coverUrl?: string;
    externalId?: string;
    source: BookSource;
    isActive?: boolean;

    language?: ILanguage;
    authors?: IAuthor[];
    genres?: IGenre[];
    bookFiles?: IBookFile[];
}