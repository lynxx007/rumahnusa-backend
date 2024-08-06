import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpExceptionMessages } from 'src/common/const/exceptions/message';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CustomResponse } from 'src/common/const/types/response';
// Payloads
import { CreateUsersPayload } from './payloads/createUsers.payload';
import { UpdateUsersPayload } from './payloads/updateUsers.payload';

// Services
import { AuthenticationsService } from '../authentications/authentications.service';
import { HttpCustomMessages } from 'src/common/const/http/message';

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
    // TODO: Exclude currently logged in user in the response
    return await this.userRepository.find();
  }

  async update(payload: UpdateUsersPayload, id: string): Promise<CustomResponse> {
    const user: User = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(HttpExceptionMessages.NOT_FOUND);
    try {
      
      const data: Partial<User> = {
        email: payload.email,
        password: payload.password ? await this.authService.hashPassword(payload.password) : user.password,
        first_name: payload.first_name,
        last_name: payload.last_name,
      };

      await this.userRepository.update({ id }, data );  

      return new CustomResponse(HttpCustomMessages.UPDATE_SUCCESS);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(HttpExceptionMessages.INTERNAL_SERVER);
    }
    
  }

  async destroy(id: string): Promise<CustomResponse> {
    try {
      const user: User = await this.userRepository.findOne({ where: { id } });
      if (!user) throw new NotFoundException(HttpExceptionMessages.NOT_FOUND);
      await this.userRepository.softDelete(id);
      return new CustomResponse(HttpCustomMessages.DELETE_SUCCESS);
    } catch (error) {
      // TODO: Create a custom error translator
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(HttpExceptionMessages.INTERNAL_SERVER);
    }
  }

  async findOne(id: string): Promise<CustomResponse> {
    try {
      const user: User = await this.userRepository.findOne({ where: { id } });
      if (!user) throw new NotFoundException(HttpExceptionMessages.NOT_FOUND);
      return new CustomResponse(
        HttpCustomMessages.DEFAULT,
        'ok', 
        user
      );
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(HttpExceptionMessages.INTERNAL_SERVER);
    }
  }
}
