import { IBook } from "../book/bookInterface";
import { IReadingStatus } from "./readingStatusInterface";
import { IUser } from "../user/userInterface";

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