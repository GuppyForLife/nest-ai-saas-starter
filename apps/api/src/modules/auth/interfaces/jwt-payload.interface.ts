import { UserRole } from '../../user/domain/user-role.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}
