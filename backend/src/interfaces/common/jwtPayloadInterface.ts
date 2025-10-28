export interface IJwtPayload {
    id: number;
    email: string;
    username: string;
    iat?:number;
    exp?: number;
}