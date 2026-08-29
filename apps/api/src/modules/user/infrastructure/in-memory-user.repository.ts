import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { User } from '../domain/user.entity';
import { UserRole } from '../domain/user-role.enum';
import { CreateUserInput, IUserRepository } from '../repositories/user.repository';

@Injectable()
export class InMemoryUserRepository extends IUserRepository {
  private readonly usersById = new Map<string, User>();
  private readonly userIdByEmail = new Map<string, string>();

  async findByEmail(email: string): Promise<User | null> {
    const userId = this.userIdByEmail.get(email);
    return userId === undefined ? null : (this.usersById.get(userId) ?? null);
  }

  async findById(id: string): Promise<User | null> {
    return this.usersById.get(id) ?? null;
  }

  async create(input: CreateUserInput): Promise<User> {
    const now = new Date();
    const user = new User({
      id: randomUUID(),
      email: input.email,
      passwordHash: input.passwordHash,
      role: input.role ?? UserRole.USER,
      createdAt: now,
      updatedAt: now,
    });

    this.usersById.set(user.id, user);
    this.userIdByEmail.set(user.email, user.id);

    return user;
  }
}
