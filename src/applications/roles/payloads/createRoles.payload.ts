import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { IsUnique } from 'src/decorators/IsUnique';

import { Permission } from 'src/applications/permissions/permission.entity';

export class CreateRolesPayload {
    @IsString()
    @IsNotEmpty()
    @IsUnique({ tableName: 'roles', column: 'title' })
  readonly title: string;
  
    @IsOptional()
    readonly permissions: Permission[];
}
