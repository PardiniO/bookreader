export interface IReadingProgress {
    id?: number;
    id_library: number;
    current_page: number;
    progress_percent: number;
    last_read: Date;
}