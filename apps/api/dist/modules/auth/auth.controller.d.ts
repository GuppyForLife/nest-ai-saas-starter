import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import type { AuthenticatedUserResponse, LoginResponse } from './interfaces/auth-response.interface';
import type { JwtPayload } from './interfaces/jwt-payload.interface';
export declare class AuthController {
    private readonly commandBus;
    private readonly queryBus;
    constructor(commandBus: CommandBus, queryBus: QueryBus);
    register(dto: RegisterUserDto): Promise<AuthenticatedUserResponse>;
    login(dto: LoginDto): Promise<LoginResponse>;
    getMe(user: JwtPayload): Promise<AuthenticatedUserResponse>;
}
