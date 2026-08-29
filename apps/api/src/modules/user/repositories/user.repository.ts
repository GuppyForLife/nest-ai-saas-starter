import { UserRole } from '../domain/user-role.enum';
import { User } from '../domain/user.entity';

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  role?: UserRole;
}

export abstract class IUserRepository {
  abstract findByEmail(email: string): Promise<User | null>;

  abstract findById(id: string): Promise<User | null>;

  abstract create(input: CreateUserInput): Promise<User>;
}
