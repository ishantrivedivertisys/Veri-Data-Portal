import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/request/create-role.dto';
import { UpdateRoleDto } from './dto/request/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Not, Repository } from 'typeorm';
import { IFindAllRoles } from './interface/role.find';
import { RoleStatus } from './entities/roleStatus.enum';
import { Messages } from 'src/common/constants/messages';
import { RolePermission } from 'src/role-permission/entities/role-permission.entity';
import { Permission } from 'src/permission/entities/permission.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(Permission) private permissionRepository: Repository<Permission>,
    @InjectRepository(RolePermission) private rolePermissionRepository: Repository<RolePermission>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const isCharacterOnly = /^[a-zA-Z ]*$/;
    if (!isCharacterOnly.test(createRoleDto.name)) {
      throw new BadRequestException(`${Messages.RoleModule.Name}`);
    }

    const existingRole = await this.roleRepository.findOne({
      where: { name: createRoleDto.name }
    });
    if (existingRole) {
      throw new BadRequestException(`${Messages.RoleModule.RoleExist}`);
    }

    const result = await this.roleRepository.save(createRoleDto);
    const permission = await this.permissionRepository.find();
    let items = permission.map((x) => {
      if(result.id == Number(1)) {
        return {
          roleId: result.id,
          permissionId: x.id,
          status: 'active'
        }
      }
      else {
        return {
          roleId: result.id,
          permissionId: x.id,
          status: 'inActive'
        }
      }
    })
    await this.rolePermissionRepository.save(items);
    if(result) {
      return {
        statusCode: 200,
        message: `${Messages.RoleModule.Created}`,
        data: result
      }
    }    
  }

  async findAll(options: IFindAllRoles) {
    const query = await this.roleRepository.createQueryBuilder('role');
    //query.leftJoinAndSelect('role.user', 'user');
    if (options.search) {
      query.andWhere('role.name like :name', {
        name: `%${options.search}%`,
      });
    }

    if(options.status == RoleStatus.ACTIVE) {
      query.andWhere(`role.status = '${options.status}'`, {
        status: RoleStatus.ACTIVE,
      });
    }else if(options.status == RoleStatus.INACTIVE) {
      query.andWhere(`role.status = '${options.status}'`, {
        status: RoleStatus.INACTIVE,
      });
    }
    
    if (options.skip) query.offset(options.skip);

    if (options.limit) query.limit(options.limit);

    if (options.sortColumn) {
      query.orderBy(`role.${options.sortColumn}`, options.sortType);
    }

    const [result, count] = await query.getManyAndCount();
    let sNo:number =0;
    result.map((role) => {
      sNo = sNo + 1; 
      role["sNo"] = sNo;
    });
    if (result.length > 0) {
      return {
        statusCode: 200,
        message: `${Messages.RoleModule.Found}`,
        totalRows: count,
        data: result,
      };
    } else {
      return {
        statusCode: 404,
        message: `${Messages.RoleModule.NotFound}`,
      };
    }
  }

  async findOne(id: number) {
    try {
      const result = await this.roleRepository.findOne({
        relations: ['user'],
        where: { id: id }
      });
      if(result) {
        return {
          statusCode: 200,
          message: `${Messages.RoleModule.Found}`,
          data: result
        }
      } else {
        return {
          statusCode: 404,
          message: `${Messages.RoleModule.NotFound}`,
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async update(roleId: number, updateRoleDto: UpdateRoleDto) {
    const availableRole = await this.roleRepository.findOne({
      where: {
        id: roleId
      }
    });
    if (availableRole) {
      const existingRole = await this.roleRepository.findOne({
        where: { name: updateRoleDto.name, id: Not(roleId) },
      });
      if (existingRole) {
        throw new BadRequestException(`${Messages.RoleModule.RoleExist}`);
      }

      await this.roleRepository.update(roleId, updateRoleDto);
      const updateResult = await this.roleRepository.findOne({
        where: {
          id: roleId
        }
      });
      return {
        statusCode: 200,
        message: `${Messages.RoleModule.Updated}`,
        data: updateResult
      }
    } else {
      return {
        statusCode: 404,
        message: `${Messages.RoleModule.NotFound}`,
      };
    }
  }

  async remove(roleId: number) {
    const deletedRole = await this.roleRepository.findOne({
      where: {
        id: roleId
      }
    });
    if(deletedRole) {
      await this.roleRepository.delete(roleId);
      return {
        statusCode: 200,
        message: `${Messages.RoleModule.Deleted}`,
        data: deletedRole
      }
    } else {
      return {
        statusCode: 404,
        message: `${Messages.RoleModule.NotFound}`,
      };
    }
  }
  async findRoleByName(name: string) {
      const result = await this.roleRepository.findOne({
        where: { name: name }
      });
      return result;
  }
}
