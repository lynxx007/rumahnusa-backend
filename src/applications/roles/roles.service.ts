import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateRolesPayload } from './payloads/createRoles.payload';
import { UpdateRolesPayload } from './payloads/updateRoles.payload';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
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
      const role: Role = await this.roleRepository.findOne({ where: { id }, relations: ['users', 'permissions'] });
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
        id,
        title: payload.title,
        permissions: payload.permissions,
      };

      const res = await this.roleRepository.save(data);

      return new CustomResponse(HttpCustomMessages.UPDATE_SUCCESS, null, res); 
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

  async paginate(options: IPaginationOptions): Promise<Pagination<Role>> {
    const queryBuilder = this.roleRepository.createQueryBuilder('role');
    queryBuilder.orderBy('role.created_at', 'DESC');

    return paginate<Role>(queryBuilder, options);
  }
}
