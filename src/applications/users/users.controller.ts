import { Body, Controller, Post, Get, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersPayload } from './payloads/createUsers.payload';
import { UpdateUsersPayload } from './payloads/updateUsers.payload';
import { QUERY } from 'src/common/const/http/query_parameters';
import { JwtAuthGuard } from '../authentications/strategy/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  index(
    @Query('page') page: number = QUERY.DEFAULT_PAGE,
    @Query('limit') limit: number = QUERY.DEFAULT_LIMIT,
  ) {
    return this.usersService.paginate({ page, limit });
  }

  @Get(':id')
  show(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() payload: CreateUsersPayload) {
    return this.usersService.create(payload);
  }

  @Put(':id')
  update(@Body() payload: UpdateUsersPayload, @Param('id') id: string) {
    return this.usersService.update(payload, id);
  }

  @Delete(':id')
  destroy(@Param('id') id: string) {
    return this.usersService.destroy(id);
  }
}
