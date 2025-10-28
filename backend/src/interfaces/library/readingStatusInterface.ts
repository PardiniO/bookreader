export type ReadingStatusValue = 'reading' | 'to_read' | 'read';

export interface IReadingStatus {
    id?: number;
    status: ReadingStatusValue;
}