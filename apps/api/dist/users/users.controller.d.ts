import { UsersService } from "./users.service";
import { CreateUserDto, UpdateUserStatusDto } from "./dto";
export declare class UsersController {
    private users;
    constructor(users: UsersService);
    list(page?: string, pageSize?: string): Promise<{
        items: {
            id: string;
            name: string | null;
            status: import("@prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            passwordHash: string | null;
            lastLoginAt: Date | null;
            userType: string;
            selfRegistered: boolean;
            emailVerifiedAt: Date | null;
        }[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    create(dto: CreateUserDto): Promise<{
        id: string;
        name: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        passwordHash: string | null;
        lastLoginAt: Date | null;
        userType: string;
        selfRegistered: boolean;
        emailVerifiedAt: Date | null;
    }>;
    updateStatus(id: string, dto: UpdateUserStatusDto): Promise<{
        id: string;
        name: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        passwordHash: string | null;
        lastLoginAt: Date | null;
        userType: string;
        selfRegistered: boolean;
        emailVerifiedAt: Date | null;
    }>;
}
