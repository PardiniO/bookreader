import { IApiResponse } from "./apiResponseInterface";

export interface IPaginatedResponse<T> extends IApiResponse<T[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}