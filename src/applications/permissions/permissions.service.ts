import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePermissionsPayload } from './payloads/createPermissions.payload';
import { UpdatePermissionsPayload } from './payloads/updatePermission.payload';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity';
import { HttpExceptionMessages } from 'src/common/const/exceptions/message';
import { CustomResponse } from 'src/common/const/types/response';
import { HttpCustomMessages } from 'src/common/const/http/message';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class PermissionsService {
  
  constructor(@InjectRepository(Permission) private permissionRepository: Repository<Permission>) {}

  async create(payload: CreatePermissionsPayload): Promise<Permission> {
    //Todo: Admin Only
    try {
      return this.permissionRepository.save(payload);
    } catch (error) {
      throw new InternalServerErrorException(HttpExceptionMessages.INTERNAL_SERVER);
    }
  }

  async findAll(): Promise<Permission[]> {
    return this.permissionRepository.find();
  }

  async update(id: string, payload: UpdatePermissionsPayload): Promise<CustomResponse> {
    try {
      const permission: Permission = await this.permissionRepository.findOne({ where: { id } });
      if (!permission) throw new NotFoundException(HttpExceptionMessages.NOT_FOUND);

      const data: Partial<Permission> = { title: payload.title };
      await this.permissionRepository.update({ id }, data);

      return new CustomResponse(HttpCustomMessages.UPDATE_SUCCESS);

    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(HttpExceptionMessages.INTERNAL_SERVER);
    }
  }

  async delete(id: string): Promise<CustomResponse> {
    try {
      const permission: Permission = await this.permissionRepository.findOneBy({ id });
      if (!permission) throw new NotFoundException(HttpExceptionMessages.NOT_FOUND);

      await this.permissionRepository.delete(id);

      return new CustomResponse(HttpCustomMessages.DELETE_SUCCESS);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Permission>> {
    const queryBuilder = this.permissionRepository.createQueryBuilder('permission');
    queryBuilder.orderBy('permission.created_at', 'DESC');

    return paginate<Permission>(queryBuilder, options);
  }
}
