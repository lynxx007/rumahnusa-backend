import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionsPayload } from './payloads/createPermissions.payload';
import { UpdatePermissionsPayload } from './payloads/updatePermission.payload';
import { QUERY } from 'src/common/const/http/query_parameters';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  create(@Body() payload: CreatePermissionsPayload) {
    return this.permissionsService.create(payload);
  }

  @Get()
  index(
    @Query('page') page: number = QUERY.DEFAULT_PAGE,
    @Query('limit') limit: number = QUERY.DEFAULT_LIMIT
  ) {
    return this.permissionsService.paginate({ page, limit });
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
