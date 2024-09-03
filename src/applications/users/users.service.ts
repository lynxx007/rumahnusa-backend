import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

import { handleHttpError, isEmpty } from 'src/utilities/helper';
import { HTTP_CUSTOM_MESSAGES } from 'src/const/http.const';
import { HttpCustomResponse } from 'src/types/http.types';
import { CreateUsersPayload } from './payloads/createUsers.payload';
import { UpdateUsersPayload } from './payloads/updateUsers.payload';
import { AuthenticationsService } from '../authentications/authentications.service';

import { Role } from '../roles/role.entity';
import { User } from './user.entity';
import { ChangePasswordPayload } from './payloads/changePassword.payload';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private authService: AuthenticationsService,
  ) {}

  async create(payload: CreateUsersPayload): Promise<User> {
    try {
      const hashedPassword: string = await this.authService.hashPassword(payload.password);
      const role: Role = await this.roleRepository.findOne({ where: { id: payload.role_id } });
      if (isEmpty(role)) throw new NotFoundException('Invalid role.');

      const user = new User();
      user.email = payload.email;
      user.password = hashedPassword;
      user.first_name = payload.first_name;
      user.last_name = payload.last_name;
      user.phone_number = payload.phone_number;
      user.role = role;

      return this.userRepository.save(user);
    } catch (error) {
      handleHttpError(error);
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({ relations: ['role'] });
  }

  async update(payload: UpdateUsersPayload, id: string): Promise<HttpCustomResponse> {
    const user: User = await this.userRepository.findOne({ where: { id } });
    if (isEmpty(user)) throw new NotFoundException(HTTP_CUSTOM_MESSAGES.NOT_FOUND);
    try {
      
      const data: Partial<User> = {
        email: payload.email,
        phone_number: payload.phone_number,
        password: payload.password ? await this.authService.hashPassword(payload.password) : user.password,
        first_name: payload.first_name,
        last_name: payload.last_name,
      };

      await this._validateUpdate(id, data);
      await this.userRepository.update({ id }, data );  

      return new HttpCustomResponse(HTTP_CUSTOM_MESSAGES.UPDATE_SUCCESS);
    } catch (error) {
      handleHttpError(error);
    }
    
  }

  async destroy(id: string): Promise<HttpCustomResponse> {
    try {
      const user: User = await this.userRepository.findOne({ where: { id } });
      if (isEmpty(user)) throw new NotFoundException(HTTP_CUSTOM_MESSAGES.NOT_FOUND);
      await this.userRepository.softDelete(id);
      return new HttpCustomResponse(HTTP_CUSTOM_MESSAGES.DELETE_SUCCESS);
    } catch (error) {
      handleHttpError(error);
    }
  }

  async findOne(id: string): Promise<HttpCustomResponse> {
    try {
      const user: User = await this.userRepository.findOne({ where: { id } });
      if (isEmpty(user)) throw new NotFoundException(HTTP_CUSTOM_MESSAGES.NOT_FOUND);
      return new HttpCustomResponse(
        HTTP_CUSTOM_MESSAGES.DEFAULT,
        'ok', 
        user
      );
    } catch (error) {
      handleHttpError(error);
    }
  }

  async paginate(options: IPaginationOptions, userId: string): Promise<Pagination<User>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder
      .where('user.id != :id', { id: userId })
      .leftJoinAndSelect('user.role', 'role')
      .orderBy('user.created_at', 'DESC');

    return paginate<User>(queryBuilder, options);
  }

  async _validateUpdate(id: string, data: Partial<User>): Promise<void> {
    const user = await this.userRepository.createQueryBuilder('user')
      .where(
        '(user.email = :email AND user.id != :id) OR (user.phone_number = :phone_number AND user.id != :id)',
        {
          email: data.email,
          phone_number: data.phone_number,
          id: id,
        }
      )
      .getOne();

    if (user) throw new UnprocessableEntityException(HTTP_CUSTOM_MESSAGES.UNPROCESSABLE_ENTITY);
  }

  async changePassword(userContext: any, payload: ChangePasswordPayload): Promise<HttpCustomResponse> {
    try {
      const user: User = await this.userRepository.findOneBy({ id: userContext.id });
      const isCurrentPasswordCorrect = await this.authService.validatePassword(payload.current_password, user.password);
  
      if (!isCurrentPasswordCorrect) throw new UnprocessableEntityException('Invalid current password.'); 

      const hashedPassword: string = await this.authService.hashPassword(payload.password);

      await this.userRepository.update({ id: user.id }, { password: hashedPassword });

      return new HttpCustomResponse(HTTP_CUSTOM_MESSAGES.UPDATE_SUCCESS, 'Success');
    } catch (error) {
      handleHttpError(error);
    }
  }
}
