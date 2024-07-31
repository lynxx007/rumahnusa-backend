import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUsersPayload } from './payloads/createUsers.payload';

// Services
import { AuthenticationsService } from '../authentications/authentications.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private authService: AuthenticationsService,
  ) {}

  async create(payload: CreateUsersPayload): Promise<User> {
    const hashedPassword: string = await this.authService.hashPassword(payload.password);

    const user = new User();
    user.email = payload.email;
    user.password = hashedPassword;
    user.first_name = payload.first_name;
    user.last_name = payload.last_name;

    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }
}
