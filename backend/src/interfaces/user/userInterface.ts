export interface IUser {
    id?: number;
    username: string;
    email: string;
    password: string;
    created_at?: Date;
    updated_at?: Date;
    is_active?: boolean;
}