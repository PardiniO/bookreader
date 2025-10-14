import { IReadingProgress } from "./readingProgressInterface";

export interface IHighlight {
    id?: number;
    id_progress: number;
    highlighted_text: string;
    page?: number;
    color?: string;

    progress?: IReadingProgress;
}