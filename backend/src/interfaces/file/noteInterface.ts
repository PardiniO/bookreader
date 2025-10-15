import { IReadingProgress } from "../library/readingProgressInterface";

export interface INote {
    id?: number;
    id_progress: number;
    text: string;
    page?: number;
    created_at: Date;

    progress?: IReadingProgress;
}