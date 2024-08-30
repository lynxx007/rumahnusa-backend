import { User } from 'src/applications/users/user.entity';
import { AuthenticatedUser, AuthenticatedUserResponse } from 'src/common/const/types/auth';

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
    role: user.role?.title,
    permissions: userPermission,
  };
}