"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryUserRepository = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const user_entity_1 = require("../domain/user.entity");
const user_role_enum_1 = require("../domain/user-role.enum");
const user_repository_1 = require("../repositories/user.repository");
let InMemoryUserRepository = class InMemoryUserRepository extends user_repository_1.IUserRepository {
    usersById = new Map();
    userIdByEmail = new Map();
    async findByEmail(email) {
        const userId = this.userIdByEmail.get(email);
        return userId === undefined ? null : (this.usersById.get(userId) ?? null);
    }
    async findById(id) {
        return this.usersById.get(id) ?? null;
    }
    async create(input) {
        const now = new Date();
        const user = new user_entity_1.User({
            id: (0, node_crypto_1.randomUUID)(),
            email: input.email,
            passwordHash: input.passwordHash,
            role: input.role ?? user_role_enum_1.UserRole.USER,
            createdAt: now,
            updatedAt: now,
        });
        this.usersById.set(user.id, user);
        this.userIdByEmail.set(user.email, user.id);
        return user;
    }
};
exports.InMemoryUserRepository = InMemoryUserRepository;
exports.InMemoryUserRepository = InMemoryUserRepository = __decorate([
    (0, common_1.Injectable)()
], InMemoryUserRepository);
//# sourceMappingURL=in-memory-user.repository.js.map