import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUsersPayload } from './payloads/createUsers.payload';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(payload: CreateUsersPayload): Promise<User> {
    const user = new User();
    user.email = payload.email;
    user.password = payload.password; // Todo: Encrypt Password
    user.first_name = payload.first_name;
    user.last_name = payload.last_name;

    return await this.userRepository.save(user);
  }
}
