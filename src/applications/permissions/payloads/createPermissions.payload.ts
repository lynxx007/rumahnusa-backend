import { IsNotEmpty, IsString } from 'class-validator';
import { IsUnique } from 'src/decorators/IsUnique';

export class CreatePermissionsPayload {
    @IsNotEmpty()
    @IsString()
    @IsUnique({ tableName: 'permissions', column: 'title' })
  readonly title: string;
}
