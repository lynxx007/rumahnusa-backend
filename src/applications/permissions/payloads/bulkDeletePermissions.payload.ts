import { Permission } from '../permission.entity';

export class BulkDeletePermissionPayload {
  readonly permissions: Array<Partial<Permission>>;
}