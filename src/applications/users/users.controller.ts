import { Body, Controller, Post, Get, Put, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersPayload } from './payloads/createUsers.payload';
import { UpdateUsersPayload } from './payloads/updateUsers.payload';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  index() {
    return this.usersService.findAll();
  }

  @Post()
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
