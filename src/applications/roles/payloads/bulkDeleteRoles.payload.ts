import { Role } from '../role.entity';

export class BulkDeleteRolePayload {
  readonly roles: Array<Partial<Role>>;
}