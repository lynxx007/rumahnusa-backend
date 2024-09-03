import { User } from 'src/applications/users/user.entity';
import { AuthenticatedUser, AuthenticatedUserResponse } from 'src/types/auth.types';

export function mapUserToAuthResponse(user: Partial<User>, jwtToken: string | null ): AuthenticatedUserResponse {
  const mappedUser = mapUserToJwtPayload(user);
  return {
    ...mappedUser,
    token: jwtToken,
  };
}

export function mapUserToJwtPayload(user: Partial<User>): AuthenticatedUser {
  const userPermission = user.role?.permissions?.map((permission) => permission.title);  
  return {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    phone_number: user.phone_number,
    role: user.role?.title,
    permissions: userPermission,
    is_verified: user.is_verified,
  };
}