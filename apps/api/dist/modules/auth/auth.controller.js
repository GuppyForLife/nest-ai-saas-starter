"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const login_command_1 = require("./commands/login.command");
const register_user_command_1 = require("./commands/register-user.command");
const current_user_decorator_1 = require("./decorators/current-user.decorator");
const login_dto_1 = require("./dto/login.dto");
const register_user_dto_1 = require("./dto/register-user.dto");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const get_current_user_query_1 = require("./queries/get-current-user.query");
let AuthController = class AuthController {
    commandBus;
    queryBus;
    constructor(commandBus, queryBus) {
        this.commandBus = commandBus;
        this.queryBus = queryBus;
    }
    async register(dto) {
        return this.commandBus.execute(new register_user_command_1.RegisterUserCommand(dto.email, dto.password));
    }
    async login(dto) {
        return this.commandBus.execute(new login_command_1.LoginCommand(dto.email, dto.password));
    }
    async getMe(user) {
        return this.queryBus.execute(new get_current_user_query_1.GetCurrentUserQuery(user.sub));
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user account' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'User account created successfully.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'The registration payload is invalid.' }),
    (0, swagger_1.ApiConflictResponse)({ description: 'An account with this email already exists.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_user_dto_1.RegisterUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Authenticate and receive a JWT access token' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Authentication succeeded.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'The login payload is invalid.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'The provided credentials are invalid.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get the authenticated user profile' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Authenticated user profile.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'A valid JWT Bearer token is required.' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getMe", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [cqrs_1.CommandBus,
        cqrs_1.QueryBus])
], AuthController);
//# sourceMappingURL=auth.controller.js.map