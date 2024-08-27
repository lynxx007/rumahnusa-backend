import { Body, Controller, Post, Get, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersPayload } from './payloads/createUsers.payload';
import { UpdateUsersPayload } from './payloads/updateUsers.payload';
import { QUERY } from 'src/common/const/http/query_parameters';
import { JwtAuthGuard } from '../authentications/strategy/jwt.guard';
import { PermissionGuard } from '../authentications/strategy/permission.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, new PermissionGuard('view users'))
  index(
    @Query('page') page: number = QUERY.DEFAULT_PAGE,
    @Query('limit') limit: number = QUERY.DEFAULT_LIMIT,
  ) {
    return this.usersService.paginate({ page, limit });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, new PermissionGuard('view users'))
  show(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, new PermissionGuard('create users'))
  create(@Body() payload: CreateUsersPayload) {
    return this.usersService.create(payload);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, new PermissionGuard('edit users'))
  update(@Body() payload: UpdateUsersPayload, @Param('id') id: string) {
    return this.usersService.update(payload, id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, new PermissionGuard('delete users'))
  destroy(@Param('id') id: string) {
    return this.usersService.destroy(id);
  }
}
