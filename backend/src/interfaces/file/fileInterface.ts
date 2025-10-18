import { IBookFile } from "../book/bookfileInterface";
import { IReadingProgress } from "../library/readingProgressInterface";
import { IUser } from "../user/userInterface";

export interface IFile {
    id?: number;
    idUser: number;
    filename: string;
    mimetype: string;
    path: string;
    size: number;
    uploadDate: Date;

    user?: IUser;
    bookFiles?: IBookFile[];
    readingStatus?: IReadingProgress[];
}