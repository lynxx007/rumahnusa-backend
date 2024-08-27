import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionsPayload } from './payloads/createPermissions.payload';
import { UpdatePermissionsPayload } from './payloads/updatePermission.payload';
import { QUERY } from 'src/common/const/http/query_parameters';

import { JwtAuthGuard } from '../authentications/strategy/jwt.guard';
import { PermissionGuard } from '../authentications/strategy/permission.guard';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, new PermissionGuard('create permissions'))
  create(@Body() payload: CreatePermissionsPayload) {
    return this.permissionsService.create(payload);
  }

  @Get()
  @UseGuards(JwtAuthGuard, new PermissionGuard('view permissions'))
  index(
    @Query('page') page: number = QUERY.DEFAULT_PAGE,
    @Query('limit') limit: number = QUERY.DEFAULT_LIMIT
  ) {
    return this.permissionsService.paginate({ page, limit });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, new PermissionGuard('edit permissions'))
  update(@Param('id') id: string, @Body() payload: UpdatePermissionsPayload) {
    return this.permissionsService.update(id, payload);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, new PermissionGuard('delete permissions'))
  destroy(@Param('id') id: string) {
    return this.permissionsService.delete(id);
  }
}
