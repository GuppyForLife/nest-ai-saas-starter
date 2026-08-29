import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../../user/domain/user-role.enum';
import { User } from '../../user/domain/user.entity';
import { RegisterUserCommand } from '../commands/register-user.command';
import { RegisterUserHandler } from './register-user.handler';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('RegisterUserHandler', () => {
  const userRepository = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  };

  const handler = new RegisterUserHandler(userRepository as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully register a new user', async () => {
    const command = new RegisterUserCommand('new.user@example.com', 'StrongPass123!');
    const createdUser = new User({
      id: 'user-123',
      email: command.email,
      passwordHash: 'hashed-password',
      role: UserRole.USER,
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    });

    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.create.mockResolvedValue(createdUser);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

    const result = await handler.execute(command);

    expect(bcrypt.hash).toHaveBeenCalledWith(command.password, 12);
    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: command.email,
        passwordHash: 'hashed-password',
      }),
    );
    expect((bcrypt.hash as jest.Mock).mock.invocationCallOrder[0]).toBeLessThan(
      userRepository.create.mock.invocationCallOrder[0],
    );
    expect(result).toEqual({
      id: createdUser.id,
      email: createdUser.email,
      role: createdUser.role,
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt,
    });
  });

  it('should throw ConflictException if email already exists', async () => {
    const command = new RegisterUserCommand('existing.user@example.com', 'StrongPass123!');
    const existingUser = new User({
      id: 'existing-user-123',
      email: command.email,
      passwordHash: 'existing-hash',
      role: UserRole.USER,
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    });

    userRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(handler.execute(command)).rejects.toThrow(ConflictException);
    expect(userRepository.create).not.toHaveBeenCalled();
  });
});
