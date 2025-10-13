import { IBook } from "./bookInterface";
import { IFile } from "./fileInterface";

export interface IBookFile {
    id?: number;
    id_book: number;
    id_file: number;

    book?: IBook;
    file?: IFile;
}