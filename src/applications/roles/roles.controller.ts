import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRolesPayload } from './payloads/createRoles.payload';
import { UpdateRolesPayload } from './payloads/updateRoles.payload';
import { QUERY } from 'src/common/const/http/query_parameters';

@Controller('roles')
export class RolesController {
  // TODO: Admin only
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() payload: CreateRolesPayload) {
    return this.rolesService.create(payload);
  }

  @Get()
  index(
    @Query('page') page: number = QUERY.DEFAULT_PAGE,
    @Query('limit') limit: number = QUERY.DEFAULT_LIMIT,
  ) {
    return this.rolesService.paginate({ page, limit });
  }

  @Get(':id')
  show(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() payload: UpdateRolesPayload) {
    return this.rolesService.update(id, payload);
  }

  @Delete(':id')
  destroy(@Param('id') id: string) {
    return this.rolesService.delete(id);
  }
}
