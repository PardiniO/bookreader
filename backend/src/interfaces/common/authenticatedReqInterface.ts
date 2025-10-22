import { Request } from "express";

export interface IAuthenticatedRequest extends Request {
    user?: {
        id: number;
        email: string;
        first_name: string;
        last_name: string;
    };
}