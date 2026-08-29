import { Module } from '@nestjs/common';
import { InMemoryUserRepository } from './infrastructure/in-memory-user.repository';
import { IUserRepository } from './repositories/user.repository';

@Module({
  providers: [
    InMemoryUserRepository,
    {
      provide: IUserRepository,
      useExisting: InMemoryUserRepository,
    },
  ],
  exports: [IUserRepository],
})
export class UserModule {}
