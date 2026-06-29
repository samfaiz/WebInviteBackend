import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './auth.dto';
import type { AuthUser } from './auth.decorators';
export declare class AuthController {
    private auth;
    constructor(auth: AuthService);
    register(dto: RegisterDto): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            name: string | null;
            role: string;
            createdAt: Date;
        };
    }>;
    login(dto: LoginDto): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            name: string | null;
            role: string;
            createdAt: Date;
        };
    }>;
    me(user: AuthUser): Promise<{
        id: string;
        email: string;
        name: string | null;
        role: string;
        createdAt: Date;
    }>;
}
