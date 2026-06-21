import { PrismaService } from "../common/prisma.service";
import { CreateUserDto, UpdateUserStatusDto } from "./dto";
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    list(page?: number, pageSize?: number): Promise<{
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
    setStatus(userId: string, dto: UpdateUserStatusDto): Promise<{
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
