import { IReadingProgress } from "../library/readingProgressInterface";

export interface INote {
    id?: number;
    idProgress: number;
    text: string;
    page?: number;
    createdAt: Date;

    progress?: IReadingProgress;
}