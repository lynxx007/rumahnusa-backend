import { Body, Controller, Post, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersPayload } from './payloads/createUsers.payload';

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
}
