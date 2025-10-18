import bcrypt from "bcryptjs";
import { IUser, IPaginationParams, IPaginatedResponse } from "../interfaces/index";
import { BaseModel } from "./baseModel";

export class UserModel extends BaseModel{
    constructor() {
        super('users');
    }
    
    private sanitizeUser(user: IUser): IUser | null {
        if (!user) return null;
        const { password, ...rest } = user;
        return rest as IUser;
    }

    public async getAllUsers(pagination?: IPaginationParams): Promise<IUser[] | IPaginatedResponse<IUser> | undefined> {
        if (pagination) {
            const [users, total] = await Promise.all([
                this.findAll<IUser>('1=1', [], pagination),
                this.count()
            ]);

            const sanitized = users.map(user => this.sanitizeUser(user));
            return this.buildPaginatedResponse(sanitized as IUser[], pagination, total);
        }

        const users = await this.findAll<IUser>();
        return users.map(user => this.sanitizeUser(user) as IUser);
    }

    public async getUserById(id: number): Promise<IUser | null> {
        const user = await this.findById<IUser>(id);
        if (!user) return null;

        return this.sanitizeUser(user) as IUser;
    }

    public async getUserByEmail(email:string): Promise<IUser | null> {
        return await this.findOne<IUser>('email = ?', [email]);
    }

    public async createUser(userData: Omit<IUser, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
        if (!userData.email || !userData.password || !userData.username) {
            throw new Error("Faltan datos obligatorios: username, email o password");
        }

        const existingByEmail = await this.getUserByEmail(userData.email);
        if (existingByEmail) throw new Error("El email ya está registrado");
        
        const existingByUsername = await this.findOne<IUser>('username = ?', [userData.username]);
        if (existingByUsername) throw new Error("El username ya está en uso");
        
        const hashedPassword = await this.hashPassword(userData.password);
        const userToCreate = {
            ...userData,
            password: hashedPassword,
            is_active: true
        } as IUser;

        return await this.create<IUser>(userToCreate);
    }

    public async updateUser(id: number, userData: Partial<IUser>): Promise<boolean> {
        if (userData.password) {
            userData.password = await this.hashPassword(userData.password);
        }

        if (userData.email) {
            const existingUser = await this.getUserByEmail(userData.email);
            if (existingUser && existingUser.id !== id) {
                throw new Error("El email ya está registrado por otro usuario");
            }
        }

        if (userData.username) {
            const existingByUsername = await this.findOne<IUser>('username = ?', [userData.username]);
            if (existingByUsername && existingByUsername.id !== id) {
                throw new Error("El username ya está en uso por otro usuario");
            }
        }

        const updateData: Partial<IUser> = {};
        if (userData.username !== undefined) updateData.username = userData.username;
        if (userData.email !== undefined) updateData.email = userData.email;
        if ((userData as IUser).password !== undefined) updateData.password = userData.password;
        if ((userData as IUser).isActive !== undefined) updateData.isActive = (userData as IUser).isActive;

        const affectedRows = await this.updateById<IUser>(id, updateData);
        return affectedRows > 0;
    }

    public async deleteUser(id: number): Promise<boolean> {
        const affectedRows = await this.updateById<IUser>(id, { isActive: false });
        return affectedRows > 0;
    }

    public async hardDeleteUser(id: number): Promise<boolean> {
    const affectedRows = await this.deleteById(id);
    return affectedRows > 0;
    }

    public async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    public async authenticateUser(email: string, password: string): Promise<IUser | null> {
        const user = await this.getUserByEmail(email);
        
        if (!user) {
        return null;
        }

        const isValidPassword = await this.validatePassword(password, user.password);
        if (!isValidPassword) {
        return null;
        }

        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword as IUser;
    }

    public async searchUsers(
        searchTerm: string,
        pagination?: IPaginationParams
    ): Promise<IUser[] | IPaginatedResponse<IUser>> {
        const conditions = `
        (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?) 
        AND is_active = 1
        `;
        const searchValue = `%${searchTerm}%`;
        const values = [searchValue, searchValue, searchValue];

        if (pagination) {
        const [users, total] = await Promise.all([
            this.findAll<IUser>(conditions, values, pagination),
            this.count(conditions, values)
        ]);
        
        return this.buildPaginatedResponse(users, pagination, total);
        }
        
        return await this.findAll<IUser>(conditions, values);
    }

    public async getUserStats(): Promise<{
        total: number;
        active: number;
        inactive: number;
        recentlyRegistered: number;
    }> {
        const [total, active, inactive, recentlyRegistered] = await Promise.all([
        this.count(),
        this.count('is_active = 1'),
        this.count('is_active = 0'),
        this.count('created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) AND is_active = 1')
        ]);

        return {
        total,
        active,
        inactive,
        recentlyRegistered
        };
    }

    private async hashPassword(password: string): Promise<string> {
        const saltRounds = 12;
        return await bcrypt.hash(password, saltRounds);
    }
}