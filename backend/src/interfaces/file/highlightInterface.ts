import { IReadingProgress } from "../library/readingProgressInterface";

export interface IHighlight {
    id?: number;
    idProgress: number;
    highlightedText: string;
    page?: number;
    color?: string;
    createdAt: Date;
    updatedAt: Date;

    progress?: IReadingProgress;
}