import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginCommand } from './commands/login.command';
import { RegisterUserCommand } from './commands/register-user.command';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { AuthenticatedUserResponse, LoginResponse } from './interfaces/auth-response.interface';
import type { JwtPayload } from './interfaces/jwt-payload.interface';
import { GetCurrentUserQuery } from './queries/get-current-user.query';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiCreatedResponse({ description: 'User account created successfully.' })
  @ApiBadRequestResponse({ description: 'The registration payload is invalid.' })
  @ApiConflictResponse({ description: 'An account with this email already exists.' })
  async register(@Body() dto: RegisterUserDto): Promise<AuthenticatedUserResponse> {
    return this.commandBus.execute<RegisterUserCommand, AuthenticatedUserResponse>(
      new RegisterUserCommand(dto.email, dto.password),
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate and receive a JWT access token' })
  @ApiOkResponse({ description: 'Authentication succeeded.' })
  @ApiBadRequestResponse({ description: 'The login payload is invalid.' })
  @ApiUnauthorizedResponse({ description: 'The provided credentials are invalid.' })
  async login(@Body() dto: LoginDto): Promise<LoginResponse> {
    return this.commandBus.execute<LoginCommand, LoginResponse>(
      new LoginCommand(dto.email, dto.password),
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the authenticated user profile' })
  @ApiOkResponse({ description: 'Authenticated user profile.' })
  @ApiUnauthorizedResponse({ description: 'A valid JWT Bearer token is required.' })
  async getMe(@CurrentUser() user: JwtPayload): Promise<AuthenticatedUserResponse> {
    return this.queryBus.execute<GetCurrentUserQuery, AuthenticatedUserResponse>(
      new GetCurrentUserQuery(user.sub),
    );
  }
}
