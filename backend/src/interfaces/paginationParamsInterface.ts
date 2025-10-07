import { IApiResponse } from "./apiResponseInterface";

export interface IPaginationParams {
    page: number;
    limit: number;
    offset: number;
}

export interface IPaginationResponse<T> extends IApiResponse<T[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}