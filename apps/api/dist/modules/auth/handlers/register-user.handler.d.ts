import { ICommandHandler } from '@nestjs/cqrs';
import { IUserRepository } from '../../user/repositories/user.repository';
import { RegisterUserCommand } from '../commands/register-user.command';
import { AuthenticatedUserResponse } from '../interfaces/auth-response.interface';
export declare class RegisterUserHandler implements ICommandHandler<RegisterUserCommand, AuthenticatedUserResponse> {
    private readonly userRepository;
    constructor(userRepository: IUserRepository);
    execute(command: RegisterUserCommand): Promise<AuthenticatedUserResponse>;
}
