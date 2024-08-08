import { PartialType } from '@nestjs/mapped-types';
import { CreatePermissionsPayload } from './createPermissions.payload';

export class UpdatePermissionsPayload extends PartialType(CreatePermissionsPayload) {}
