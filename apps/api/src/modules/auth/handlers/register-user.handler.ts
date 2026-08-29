import { ConflictException, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';
import { IUserRepository } from '../../user/repositories/user.repository';
import { RegisterUserCommand } from '../commands/register-user.command';
import { AuthenticatedUserResponse } from '../interfaces/auth-response.interface';

@CommandHandler(RegisterUserCommand)
@Injectable()
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand, AuthenticatedUserResponse>
{
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(command: RegisterUserCommand): Promise<AuthenticatedUserResponse> {
    const existingUser = await this.userRepository.findByEmail(command.email);

    if (existingUser !== null) {
      throw new ConflictException('An account with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(command.password, 12);
    const user = await this.userRepository.create({
      email: command.email,
      passwordHash,
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
