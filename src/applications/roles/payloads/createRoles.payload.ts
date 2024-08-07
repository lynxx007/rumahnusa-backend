import { IsString, IsNotEmpty } from 'class-validator';
import { IsUnique } from 'src/common/decorators/IsUnique';

export class CreateRolesPayload {
    @IsString()
    @IsNotEmpty()
    @IsUnique({ tableName: 'roles', column: 'title' })
  readonly title: string;
}
