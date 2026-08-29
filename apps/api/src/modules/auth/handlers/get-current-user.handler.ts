import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IUserRepository } from '../../user/repositories/user.repository';
import { AuthenticatedUserResponse } from '../interfaces/auth-response.interface';
import { GetCurrentUserQuery } from '../queries/get-current-user.query';

@QueryHandler(GetCurrentUserQuery)
@Injectable()
export class GetCurrentUserHandler
  implements IQueryHandler<GetCurrentUserQuery, AuthenticatedUserResponse>
{
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(query: GetCurrentUserQuery): Promise<AuthenticatedUserResponse> {
    const user = await this.userRepository.findById(query.userId);

    if (user === null) {
      throw new UnauthorizedException('The authenticated user no longer exists.');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
