import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly requiredPermission: string) {};

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const { user } = context.switchToHttp().getRequest();
    const userGrantedPermissions: Array<string | null> = user?.permissions || [];

    return userGrantedPermissions.includes(this.requiredPermission);
  }
}