import { IBook } from "../book/bookInterface";
import { IFile } from "../file/fileInterface";

export interface IBookFile {
    id?: number;
    idBook: number;
    idFile: number;

    book?: IBook;
    file?: IFile;
}