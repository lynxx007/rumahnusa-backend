import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

import { HTTP_CUSTOM_MESSAGES } from 'src/const/http.const';
import { HttpCustomResponse } from 'src/types/http.types';
import { isEmpty } from 'src/utilities/helper';

import { CreateRolesPayload } from './payloads/createRoles.payload';
import { UpdateRolesPayload } from './payloads/updateRoles.payload';

import { Role } from './role.entity';
@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>
  ){}
  async create(payload: CreateRolesPayload): Promise<Role> {
    try {
      return this.roleRepository.save(payload);
    } catch (error) {
      throw new InternalServerErrorException(HTTP_CUSTOM_MESSAGES.INTERNAL_SERVER);
    }
  }

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async findOne(id: string): Promise<Role> {
    try {
      const role: Role = await this.roleRepository.findOne({ where: { id }, relations: ['users', 'permissions'] });
      if (isEmpty(role)) throw new NotFoundException(HTTP_CUSTOM_MESSAGES.NOT_FOUND);
      return role;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(HTTP_CUSTOM_MESSAGES.INTERNAL_SERVER);
    }
  }

  async update(id: string, payload: UpdateRolesPayload): Promise<HttpCustomResponse> {
    try {
      const role: Role = await this.roleRepository.findOne({ where: { id } });
      if (isEmpty(role)) throw new NotFoundException(HTTP_CUSTOM_MESSAGES.NOT_FOUND);

      const data: Partial<Role> = {
        id,
        title: payload.title,
        permissions: payload.permissions,
      };

      const res = await this.roleRepository.save(data);

      return new HttpCustomResponse(HTTP_CUSTOM_MESSAGES.UPDATE_SUCCESS, null, res); 
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(HTTP_CUSTOM_MESSAGES.INTERNAL_SERVER);
    }
    
  }

  async delete(id: string): Promise<HttpCustomResponse> {
    try {
      const role: Role = await this.roleRepository.findOne({ where: { id } });
      if (isEmpty(role)) throw new NotFoundException(HTTP_CUSTOM_MESSAGES.NOT_FOUND);
      
      await this.roleRepository.softDelete(id);
      return new HttpCustomResponse(HTTP_CUSTOM_MESSAGES.DELETE_SUCCESS);

    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Role>> {
    const queryBuilder = this.roleRepository.createQueryBuilder('role');
    queryBuilder.orderBy('role.created_at', 'DESC');

    return paginate<Role>(queryBuilder, options);
  }
}
