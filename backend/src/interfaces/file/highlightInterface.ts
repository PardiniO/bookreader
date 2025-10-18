import { IReadingProgress } from "../library/readingProgressInterface";

export interface IHighlight {
    id?: number;
    idProgress: number;
    highlightedText: string;
    page?: number;
    color?: string;

    progress?: IReadingProgress;
}