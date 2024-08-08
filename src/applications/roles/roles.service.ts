import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateRolesPayload } from './payloads/createRoles.payload';
import { UpdateRolesPayload } from './payloads/updateRoles.payload';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from './role.entity';
import { HttpExceptionMessages } from 'src/common/const/exceptions/message';
import { CustomResponse } from 'src/common/const/types/response';
import { HttpCustomMessages } from 'src/common/const/http/message';

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
      throw new InternalServerErrorException(HttpExceptionMessages.INTERNAL_SERVER);
    }
  }

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async findOne(id: string): Promise<Role> {
    try {
      //TODO: get with permissions
      const role: Role = await this.roleRepository.findOne({ where: { id }, relations: ['users'] });
      if (!role) throw new NotFoundException(HttpExceptionMessages.NOT_FOUND);
      return role;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(HttpExceptionMessages.INTERNAL_SERVER);
    }
  }

  async update(id: string, payload: UpdateRolesPayload): Promise<CustomResponse> {
    // TODO: update with permissions
    try {
      const role: Role = await this.roleRepository.findOne({ where: { id } });
      if (!role) throw new NotFoundException(HttpExceptionMessages.NOT_FOUND);

      const data: Partial<Role> = {
        title: payload.title,
      };

      await this.roleRepository.update({ id }, data);

      return new CustomResponse(HttpCustomMessages.UPDATE_SUCCESS); 
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(HttpExceptionMessages.INTERNAL_SERVER);
    }
    
  }

  async delete(id: string): Promise<CustomResponse> {
    // TODO: delete with permission
    try {
      const role: Role = await this.roleRepository.findOne({ where: { id } });
      if (!role) throw new NotFoundException(HttpExceptionMessages.NOT_FOUND);
      
      await this.roleRepository.softDelete(id);
      return new CustomResponse(HttpCustomMessages.DELETE_SUCCESS);

    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }
}
