import { User } from '../user.entity';

export class BulkDeleteUserPayload {
  readonly users: Array<Partial<User>>;
}