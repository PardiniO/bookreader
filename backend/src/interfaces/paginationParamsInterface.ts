import { IApiResponse } from "./apiResponseInterface";

export interface IPaginationParams {
    page: number;
    limit: number;
    offset: number;
}