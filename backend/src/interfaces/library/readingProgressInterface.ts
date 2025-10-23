import { IFile } from "../file/fileInterface";
import { IHighlight } from "../file/highlightInterface";
import { INote } from "../file/noteInterface";
import { IUser } from "../user/userInterface";

export interface IReadingProgress {
    id?: number;
    idUser: number;
    idFile: number;
    currentPage: number;
    progressPercent?: number;
    lastRead?: Date;

    user?: IUser;
    file?: IFile;
    notes?: INote[];
    highlights?: IHighlight[];
}