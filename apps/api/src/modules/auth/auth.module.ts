import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { GetCurrentUserHandler } from './handlers/get-current-user.handler';
import { LoginHandler } from './handlers/login.handler';
import { RegisterUserHandler } from './handlers/register-user.handler';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

const commandHandlers = [RegisterUserHandler, LoginHandler];
const queryHandlers = [GetCurrentUserHandler];

@Module({
  imports: [
    CqrsModule,
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'development-only-secret-change-me',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [...commandHandlers, ...queryHandlers, JwtAuthGuard],
})
export class AuthModule {}
