"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    id;
    email;
    passwordHash;
    role;
    createdAt;
    updatedAt;
    constructor(properties) {
        this.id = properties.id;
        this.email = properties.email;
        this.passwordHash = properties.passwordHash;
        this.role = properties.role;
        this.createdAt = properties.createdAt;
        this.updatedAt = properties.updatedAt;
    }
}
exports.User = User;
//# sourceMappingURL=user.entity.js.map