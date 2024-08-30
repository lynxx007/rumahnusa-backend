import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRolesPayload } from './payloads/createRoles.payload';
import { UpdateRolesPayload } from './payloads/updateRoles.payload';
import { HTTP_QUERY_PARAMS } from 'src/const/http.const';

import { JwtAuthGuard } from '../authentications/guards/jwt.guard';
import { PermissionGuard } from '../authentications/guards/permission.guard';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, new PermissionGuard('create roles'))
  create(@Body() payload: CreateRolesPayload) {
    return this.rolesService.create(payload);
  }

  @Get()
  @UseGuards(JwtAuthGuard, new PermissionGuard('view roles'))
  index(
    @Query('page') page: number = HTTP_QUERY_PARAMS.DEFAULT_PAGE,
    @Query('limit') limit: number = HTTP_QUERY_PARAMS.DEFAULT_LIMIT,
  ) {
    return this.rolesService.paginate({ page, limit });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, new PermissionGuard('view roles'))
  show(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, new PermissionGuard('edit roles'))
  update(@Param('id') id: string, @Body() payload: UpdateRolesPayload) {
    return this.rolesService.update(id, payload);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, new PermissionGuard('delete roles'))
  destroy(@Param('id') id: string) {
    return this.rolesService.delete(id);
  }
}
