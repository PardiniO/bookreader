import { INationality } from "./nationalityInterface";

export interface IAuthor {
    id: number;
    id_nationality?: number;
    name: string;
    biography?: string;

    nationality?: INationality;
}