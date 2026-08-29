import { UserRole } from './user-role.enum';

export interface UserProperties {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export class User implements UserProperties {
  readonly id: string;
  readonly email: string;
  readonly passwordHash: string;
  readonly role: UserRole;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(properties: UserProperties) {
    this.id = properties.id;
    this.email = properties.email;
    this.passwordHash = properties.passwordHash;
    this.role = properties.role;
    this.createdAt = properties.createdAt;
    this.updatedAt = properties.updatedAt;
  }
}
