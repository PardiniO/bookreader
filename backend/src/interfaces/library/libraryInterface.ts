import { IBook } from "../book/bookInterface";
import { IReadingStatus } from "./readingStatusInterface";
import { IUser } from "../user/userInterface";

export interface ILibrary {
    id?: number;
    idUser: number;
    idBook: number;
    idReadingStatus: number;
    addedDate?: Date;

    user?: IUser;
    book?: IBook;
    readingStatus?: IReadingStatus;
}