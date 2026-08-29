import { ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository } from '../../user/repositories/user.repository';
import { LoginCommand } from '../commands/login.command';
import { LoginResponse } from '../interfaces/auth-response.interface';
export declare class LoginHandler implements ICommandHandler<LoginCommand, LoginResponse> {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: IUserRepository, jwtService: JwtService);
    execute(command: LoginCommand): Promise<LoginResponse>;
}
