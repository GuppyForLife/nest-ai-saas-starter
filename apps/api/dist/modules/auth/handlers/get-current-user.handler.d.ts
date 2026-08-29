import { IQueryHandler } from '@nestjs/cqrs';
import { IUserRepository } from '../../user/repositories/user.repository';
import { AuthenticatedUserResponse } from '../interfaces/auth-response.interface';
import { GetCurrentUserQuery } from '../queries/get-current-user.query';
export declare class GetCurrentUserHandler implements IQueryHandler<GetCurrentUserQuery, AuthenticatedUserResponse> {
    private readonly userRepository;
    constructor(userRepository: IUserRepository);
    execute(query: GetCurrentUserQuery): Promise<AuthenticatedUserResponse>;
}
