import { Injectable } from '@nestjs/common';
import {CreatePermisssionDto} from './dto/request/create-permission.dto'
import {UpdatePermissionDto} from './dto/request/update-permission.dto'
import {Permission} from './entities/permission.entity'
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Messages } from 'src/common/constants/messages';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission) private permissionRepository: Repository<Permission>
  ) {}

  async create(request: CreatePermisssionDto) {
    const result = this.permissionRepository.create(request);
    await this.permissionRepository.save(result);
    if(result) {
      return {
        statusCode: 200,
        message: `${Messages.PermissionModule.Created}`,
        data: result
      }
    }
  }

  async findAll() {
    const result = await this.permissionRepository.find();
    if (result.length > 0) {
      return {
        statusCode: 200,
        message: `${Messages.PermissionModule.Found}`,
        data: result
      }
    } else {
      return {
        statusCode: 404,
        message: `${Messages.PermissionModule.NotFound}`,
      };
    }
  }

  async findOne(permissionId: number) {
    try {
      const result = await this.permissionRepository.findOne({
        where: { id: permissionId }
      });
      if(result) {
        return {
          statusCode: 200,
          message: `${Messages.PermissionModule.Found}`,
          data: result
        }
      } else {
        return {
          statusCode: 404,
          message: `${Messages.PermissionModule.NotFound}`,
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async update(permissionId: number, request: UpdatePermissionDto) {
    const permission = await this.permissionRepository.findOne({
      where: {id:permissionId}
    });
    if(permission) {
      await this.permissionRepository.update(permissionId, request);
      const result = await this.permissionRepository.findOne({
        where: {
          id:permissionId
        }
      });
      return {
        statusCode: 200,
        message: `${Messages.PermissionModule.Updated}`,
        data: result
      }
    } else {
      return {
        statusCode: 404,
        message: `${Messages.PermissionModule.NotFound}`,
      }
    }
    
  }

  async remove(permissionId: number) {
    const deletedPermission = await this.permissionRepository.findOne({
      where: {
        id: permissionId
      }
    });
    if(deletedPermission) {
      await this.permissionRepository.delete(permissionId);
      return {       
        statusCode: 200,
        message: `${Messages.PermissionModule.Deleted}`,
        data: deletedPermission
      };
    } else {
      return {
        statusCode: 404,
        message: `${Messages.PermissionModule.NotFound}`,
      }
    }
  }

  async findPermission() {
    return await this.permissionRepository.find()
  }
}
