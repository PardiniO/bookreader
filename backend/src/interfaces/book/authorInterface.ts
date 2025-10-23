import { INationality } from "./nationalityInterface";

export interface IAuthor {
    id?: number;
    idNationality?: number;
    name: string;
    biography?: string;

    nationality?: INationality;
}