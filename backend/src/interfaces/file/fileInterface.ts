import { IBookFile } from "../book/bookfileInterface";
import { IReadingProgress } from "../library/readingProgressInterface";
import { IUser } from "../user/userInterface";

export interface IFile {
    id?: number;
    id_user: number;
    filename: string;
    mimetype: string;
    path: string;
    size: number;
    upload_date: Date;

    user?: IUser;
    book_files?: IBookFile[];
    readin_staatus?: IReadingProgress[];
}