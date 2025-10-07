export type ReadingStatus = 'reading' | 'to_read' | 'read';

export interface IReadingStatusValue {
    id?: number;
    status: ReadingStatus;
}