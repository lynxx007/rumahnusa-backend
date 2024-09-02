import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

import { CreatePermissionsPayload } from './payloads/createPermissions.payload';
import { UpdatePermissionsPayload } from './payloads/updatePermission.payload';

import { HTTP_CUSTOM_MESSAGES } from 'src/const/http.const';
import { HttpCustomResponse } from 'src/types/http.types';

import { handleHttpError, isEmpty } from 'src/utilities/helper';

@Injectable()
export class PermissionsService {
  
  constructor(@InjectRepository(Permission) private permissionRepository: Repository<Permission>) {}

  async create(payload: CreatePermissionsPayload): Promise<Permission> {
    try {
      return this.permissionRepository.save(payload);
    } catch (error) {
      handleHttpError(error);
    }
  }

  async findAll(): Promise<Permission[]> {
    return this.permissionRepository.find();
  }

  async update(id: string, payload: UpdatePermissionsPayload): Promise<HttpCustomResponse> {
    try {
      const permission: Permission = await this.permissionRepository.findOne({ where: { id } });
      if (isEmpty(permission)) throw new NotFoundException(HTTP_CUSTOM_MESSAGES.NOT_FOUND);

      const data: Partial<Permission> = { title: payload.title };
      await this.permissionRepository.update({ id }, data);

      return new HttpCustomResponse(HTTP_CUSTOM_MESSAGES.UPDATE_SUCCESS);

    } catch (error) {
      handleHttpError(error);
    }
  }

  async delete(id: string): Promise<HttpCustomResponse> {
    try {
      const permission: Permission = await this.permissionRepository.findOneBy({ id });
      if (isEmpty(permission)) throw new NotFoundException(HTTP_CUSTOM_MESSAGES.NOT_FOUND);

      await this.permissionRepository.delete(id);

      return new HttpCustomResponse(HTTP_CUSTOM_MESSAGES.DELETE_SUCCESS);
    } catch (error) {
      handleHttpError(error);
    }
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Permission>> {
    const queryBuilder = this.permissionRepository.createQueryBuilder('permission');
    queryBuilder.orderBy('permission.created_at', 'DESC');

    return paginate<Permission>(queryBuilder, options);
  }
}
