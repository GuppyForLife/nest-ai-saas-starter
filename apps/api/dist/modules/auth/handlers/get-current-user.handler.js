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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCurrentUserHandler = void 0;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const user_repository_1 = require("../../user/repositories/user.repository");
const get_current_user_query_1 = require("../queries/get-current-user.query");
let GetCurrentUserHandler = class GetCurrentUserHandler {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(query) {
        const user = await this.userRepository.findById(query.userId);
        if (user === null) {
            throw new common_1.UnauthorizedException('The authenticated user no longer exists.');
        }
        return {
            id: user.id,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
};
exports.GetCurrentUserHandler = GetCurrentUserHandler;
exports.GetCurrentUserHandler = GetCurrentUserHandler = __decorate([
    (0, cqrs_1.QueryHandler)(get_current_user_query_1.GetCurrentUserQuery),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.IUserRepository])
], GetCurrentUserHandler);
//# sourceMappingURL=get-current-user.handler.js.map