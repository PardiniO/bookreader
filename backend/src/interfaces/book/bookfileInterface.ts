import { IBook } from "../book/bookInterface";
import { IFile } from "../file/fileInterface";

export interface IBookFile {
    id?: number;
    id_book: number;
    id_file: number;

    book?: IBook;
    file?: IFile;
}