import { Body, Controller, Post, Get, Put, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersPayload } from './payloads/createUsers.payload';
import { UpdateUsersPayload } from './payloads/updateUsers.payload';
import { HTTP_QUERY_PARAMS } from 'src/const/http.const';
import { JwtAuthGuard } from '../authentications/guards/jwt.guard';
import { PermissionGuard } from '../authentications/guards/permission.guard';
import { ChangePasswordPayload } from './payloads/changePassword.payload';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, new PermissionGuard('view users'))
  index(
    @Req() request,
    @Query('page') page: number = HTTP_QUERY_PARAMS.DEFAULT_PAGE,
    @Query('limit') limit: number = HTTP_QUERY_PARAMS.DEFAULT_LIMIT,
  ) {
    const { id } = request.user;
    return this.usersService.paginate({ page, limit }, id);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  profile(@Req() request) {
    return request.user || null ;
  }

  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  changePassword(@Req() request, @Body() payload: ChangePasswordPayload){
    return this.usersService.changePassword(request.user, payload);
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
