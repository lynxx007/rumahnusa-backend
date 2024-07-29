import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersPayload } from './payloads/createUsers.payload';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() payload: CreateUsersPayload) {
    return this.usersService.create(payload);
  }
}
