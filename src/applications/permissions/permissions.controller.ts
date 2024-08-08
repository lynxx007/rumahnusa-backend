import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionsPayload } from './payloads/createPermissions.payload';
import { UpdatePermissionsPayload } from './payloads/updatePermission.payload';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  create(@Body() payload: CreatePermissionsPayload) {
    return this.permissionsService.create(payload);
  }

  @Get()
  index() {
    return this.permissionsService.findAll();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() payload: UpdatePermissionsPayload) {
    return this.permissionsService.update(id, payload);
  }

  @Delete(':id')
  destroy(@Param('id') id: string) {
    return this.permissionsService.delete(id);
  }
}
