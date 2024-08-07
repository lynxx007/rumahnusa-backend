import { PartialType } from '@nestjs/mapped-types';
import { CreateRolesPayload } from './createRoles.payload';

export class UpdateRolesPayload extends PartialType(CreateRolesPayload) {}
