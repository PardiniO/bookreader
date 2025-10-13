import { IBook } from "./bookInterface";
import { IReadingStatus } from "./readingStatusValueInterface";
import { IUser } from "./userInterface";

export interface ILibary {
    id?: number;
    id_user: number;
    id_book: number;
    id_reading_status: number;
    added_date?: Date;

    user?: IUser;
    book?: IBook;
    readingStatus?: IReadingStatus;
}