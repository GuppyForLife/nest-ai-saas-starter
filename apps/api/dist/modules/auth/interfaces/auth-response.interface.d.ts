import { UserRole } from '../../user/domain/user-role.enum';
export interface AuthenticatedUserResponse {
    id: string;
    email: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}
export interface LoginResponse {
    accessToken: string;
}
