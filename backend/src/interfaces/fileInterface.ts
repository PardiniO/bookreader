import { IBookFile } from "./bookfileInterface";
import { IReadingProgress } from "./readingProgressInterface";
import { IUser } from "./userInterface";

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