import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../../user/domain/user-role.enum';
import { User } from '../../user/domain/user.entity';
import { LoginCommand } from '../commands/login.command';
import { LoginHandler } from './login.handler';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('LoginHandler', () => {
  let userRepository: {
    findByEmail: jest.Mock;
  };
  let jwtService: {
    signAsync: jest.Mock;
  };
  let loginHandler: LoginHandler;

  beforeEach(() => {
    jest.clearAllMocks();

    userRepository = {
      findByEmail: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn(),
    };

    loginHandler = new LoginHandler(
      userRepository as any,
      jwtService as unknown as JwtService,
    );
  });

  it('should successfully authenticate and return an access token', async () => {
    const command = new LoginCommand('user@example.com', 'StrongPass123!');
    const user = new User({
      id: 'user-123',
      email: command.email,
      passwordHash: 'hashed-password',
      role: UserRole.USER,
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    });

    userRepository.findByEmail.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    jwtService.signAsync.mockResolvedValue('mock.jwt.token');

    const result = await loginHandler.execute(command);

    expect(result).toEqual({ accessToken: 'mock.jwt.token' });
    expect(bcrypt.compare).toHaveBeenCalledWith(
      command.password,
      user.passwordHash,
    );
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  });

  it('should throw UnauthorizedException if user is not found', async () => {
    const command = new LoginCommand('missing@example.com', 'StrongPass123!');

    userRepository.findByEmail.mockResolvedValue(null);

    await expect(loginHandler.execute(command)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(jwtService.signAsync).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException if password does not match', async () => {
    const command = new LoginCommand('user@example.com', 'WrongPass123!');
    const user = new User({
      id: 'user-456',
      email: command.email,
      passwordHash: 'hashed-password',
      role: UserRole.USER,
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    });

    userRepository.findByEmail.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(loginHandler.execute(command)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(jwtService.signAsync).not.toHaveBeenCalled();
  });
});
