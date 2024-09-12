import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { HTTP_QUERY_PARAMS } from 'src/const/http.const';

import { CreatePermissionsPayload } from './payloads/createPermissions.payload';
import { UpdatePermissionsPayload } from './payloads/updatePermission.payload';

import { JwtAuthGuard } from '../authentications/guards/jwt.guard';
import { PermissionGuard } from '../authentications/guards/permission.guard';
import { BulkDeletePermissionPayload } from './payloads/bulkDeletePermissions.payload';

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
    @Query('page') page: number = HTTP_QUERY_PARAMS.DEFAULT_PAGE,
    @Query('limit') limit: number = HTTP_QUERY_PARAMS.DEFAULT_LIMIT
    //Todo: Use DTO to handle queries
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

  @Post('bulk-delete')
  @UseGuards(JwtAuthGuard, new PermissionGuard('delete permissions'))
  bulkDelete(@Body() payload: BulkDeletePermissionPayload) {
    return this.permissionsService.bulkDelete(payload);
  }
}
