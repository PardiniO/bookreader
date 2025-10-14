import { IFile } from "./fileInterface";
import { IHighlight } from "./highlightInterface";
import { INote } from "./noteInterface";
import { IUser } from "./userInterface";

export interface IReadingProgress {
    id?: number;
    id_user: number;
    id_file: number;
    current_page: number;
    progress_percent: number;
    last_read: Date;

    user?: IUser;
    file?: IFile;
    notes?: INote[];
    highlights?: IHighlight[];
}