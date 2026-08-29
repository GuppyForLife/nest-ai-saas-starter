import { User } from '../domain/user.entity';
import { CreateUserInput, IUserRepository } from '../repositories/user.repository';
export declare class InMemoryUserRepository extends IUserRepository {
    private readonly usersById;
    private readonly userIdByEmail;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    create(input: CreateUserInput): Promise<User>;
}
