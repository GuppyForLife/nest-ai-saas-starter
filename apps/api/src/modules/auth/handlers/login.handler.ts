import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUserRepository } from '../../user/repositories/user.repository';
import { LoginCommand } from '../commands/login.command';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { LoginResponse } from '../interfaces/auth-response.interface';

@CommandHandler(LoginCommand)
@Injectable()
export class LoginHandler
  implements ICommandHandler<LoginCommand, LoginResponse>
{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: LoginCommand): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(command.email);
    const passwordMatches =
      user === null ? false : await bcrypt.compare(command.password, user.passwordHash);

    if (!passwordMatches || user === null) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return { accessToken: await this.jwtService.signAsync(payload) };
  }
}
