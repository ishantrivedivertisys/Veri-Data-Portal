import { BadRequestException, Injectable } from '@nestjs/common';
import {RolePermission} from './entities/role-permission.entity'
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleStatus } from 'src/role/entities/roleStatus.enum';
import { Messages } from 'src/common/constants/messages';
import { Permission } from 'src/permission/entities/permission.entity';
import { CreateRolePermissionDto } from './dto/request/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/request/update-role-permission.dto';
import { Role } from 'src/role/entities/role.entity';

@Injectable()
export class RolePermissionService {
  constructor(
    @InjectRepository(RolePermission) private rolepermissionRepository: Repository<RolePermission>,
    @InjectRepository(Permission) private permissionRepository: Repository<Permission>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    private dataSource: DataSource
  ) {}

  async create(request: CreateRolePermissionDto) {
    if(request.roleId) {
      const role = await this.roleRepository.findOne({
        where: {id: request.roleId}
      })
      if(!role) {
        throw new BadRequestException('Invalid role')
      }
    }
    if(request.permissionId) {
      const permission = await this.permissionRepository.findOne({
        where: {id: request.permissionId}
      })
      if(!permission) {
        throw new BadRequestException('Invalid permission')
      }
    }
    let result = await this.rolepermissionRepository.createQueryBuilder('rolePermission')
    .where(`rolePermission.roleId = ${Number(request.roleId)}`)
    .andWhere(`rolePermission.permissionId = ${Number(request.permissionId)}`)
    .getOne();
    if(result) {
      return {
        statusCode: 404,
        message: `${Messages.RolePermissionModule.RolePermissionExist}`,
      }
    }
    const rolePermission = await this.rolepermissionRepository.save(request);
    if(rolePermission) {
      return {
        statusCode: 200,
        message: `${Messages.RolePermissionModule.Created}`,
        data: rolePermission
      }
    }
  }

  async findAll() {
    const result = await this.rolepermissionRepository.find({
      relations: ['role', 'permission']
    });
    if(result.length > 0) {
      return {
        statusCode: 200,
        message: `${Messages.RolePermissionModule.Found}`,
        data: result
      }
    } else {
      return {
        statusCode: 404,
        message: `${Messages.RolePermissionModule.NotFound}`,
      }
    }
  }

  async findOne(rolePermissionId: number) {
    try {
      const result = await this.rolepermissionRepository.findOne({
        where: { id: rolePermissionId }
      });
      if(result) {
        return {
          statusCode: 200,
          message: `${Messages.RolePermissionModule.Found}`,
          data: result
        }
      } else {
        return {
          statusCode: 404,
          message: `${Messages.RolePermissionModule.NotFound}`,
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async update(rolePermissionId: number, request: CreateRolePermissionDto) {
    const rolePermission = await this.rolepermissionRepository.findOne({
      where: {id: rolePermissionId}
    });
    if(rolePermission) {
      if(request.roleId) {
        const role = await this.roleRepository.findOne({
          where: {id: request.roleId}
        })
        if(!role) {
          throw new BadRequestException('Invalid role')
        }
      }
      if(request.permissionId) {
        const permission = await this.permissionRepository.findOne({
          where: {id: request.permissionId}
        })
        if(!permission) {
          throw new BadRequestException('Invalid permission')
        }
      }
      await this.rolepermissionRepository.update(rolePermissionId, request);
      const result = await this.rolepermissionRepository.findOne({
        where: {
          id: rolePermissionId
        }
      });
      return {
        statusCode: 200,
        message: `${Messages.RolePermissionModule.Updated}`,
        data: result
      }
    }
    else {
      return {
        statusCode: 404,
        message: `${Messages.RolePermissionModule.NotFound}`,
      }
    }
  }

  async remove(rolePermissionId: number) {
    const deleteRolePermission = await this.rolepermissionRepository.findOne({
      where: {
        id: rolePermissionId
      }
    });
    if(deleteRolePermission) {
      await this.rolepermissionRepository.delete(rolePermissionId);
      return {       
        statusCode: 200,
        message: `${Messages.RolePermissionModule.Deleted}`,
        data: deleteRolePermission
      };
    } else {
      return {
        statusCode: 404,
        message: `${Messages.RolePermissionModule.NotFound}`,
      }
    }
  }

  async getPermissionWithRole() {
    let queryRunner = await this.dataSource.createQueryRunner();
    const permission = await queryRunner.manager.query(`Select r.id as roleId, r.name as roleName, 
    p.id as permissionId, p.name as permissionName,
    (Select rp.id from role_permission rp where rp.roleId =r.id  and rp.permissionId = p.id  ) permissionvalue
    From [role] r , permission p 
    Where r.status = '${RoleStatus.ACTIVE}'
    Order by r.id`);
    
    return permission;
  }

  async getPermissionsByRoleId(roleId: number) {
    let permissionGroups = [],
    permissionSubGroups: any,
    data: any;
    const allPermission = await this.permissionRepository.createQueryBuilder('permission')
    .leftJoinAndSelect('permission.rolePermission', 'rolePermission')
    .where('rolePermission.roleId =:roleId', {roleId: roleId})
    .getMany();

    const permissionGroup = await this.rolepermissionRepository.createQueryBuilder('rolePermission')
    .leftJoin('rolePermission.permission', 'permission')
    .select('permission.permissionGroupName AS permissionGroupName')
    .where('permission.permissionGroupName IS NOT NULL')
    .andWhere('rolePermission.roleId =:roleId', {roleId: roleId})
    .groupBy('permission.permissionGroupName')
    .getRawMany();

    const subGroup = await this.rolepermissionRepository.createQueryBuilder('rolePermission')
    .select(['permission.permissionGroupName AS permissionGroupName',
    'permission.permissionSubGroupName AS permissionSubGroupName'])
    .leftJoin('rolePermission.permission', 'permission')
    .where('permission.permissionGroupName IS NOT NULL')
    .andWhere('rolePermission.roleId =:roleId', {roleId: roleId})
    .groupBy('permission.permissionGroupName')
    .addGroupBy('permission.permissionSubGroupName')
    .getRawMany();

    permissionGroups = permissionGroup.map((x) => {
      permissionSubGroups = subGroup.filter((z) => {
          return z.permissionGroupName === x.permissionGroupName 
      })

      return {
        permissionGroupName: x.permissionGroupName,
        subGroups: permissionSubGroups.map((z) => {
          data = allPermission.filter((y) => {
            if(y.permissionSubGroupName != '') {
              return y.permissionSubGroupName === z.permissionSubGroupName       
            }
            else if(y.permissionSubGroupName == ''){
              return y.permissionGroupName === z.permissionGroupName
            }
          })

          return {
            permissionSubGroupName: z.permissionSubGroupName,
            permissions: data.map((y) => {
              return {
                id: Number((y.rolePermission.map((x) => {
                  return x.id
                })).toString()),
                key: y.permissionKey,
                name: y.name,
                status: (y.rolePermission.map((x) => {
                  return x.status
                })).toString()
              }
            })
          }
        })
      }
    })
    return {
      statusCode: 200,
      message: `${Messages.RolePermissionModule.PermissionGroup}`,
      data: permissionGroups
    }
  }

  async updateRolePermission(request: UpdateRolePermissionDto[]) {
    let result = [];
    for(let i = 0; i < request.length; i++) {
      const permission = await this.rolepermissionRepository.findOne({
        where: {id: request[i].id}
      })
      if(!permission) {
        return {
          statusCode: 404,
          message: `${Messages.RoleModule.NotFound}`,
        }
      }
    }
    for(let i = 0; i < request.length; i++) {
      await this.rolepermissionRepository.update(request[i].id, {status: request[i].status});
      const rolePermission = await this.rolepermissionRepository.findOne({where: {id: request[i].id}});
      result.push(rolePermission);
    }
    return {
      statusCode: 200,
      message: `${Messages.RoleModule.Updated}`,
      data: result
    }
  }
}