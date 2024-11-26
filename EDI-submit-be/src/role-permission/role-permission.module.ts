import { Module } from '@nestjs/common';
import {RolePermissionService} from './role-permission.service';
import {RolePermissionController} from './role-permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermission } from './entities/role-permission.entity';
import { Permission } from 'src/permission/entities/permission.entity';
import { Role } from 'src/role/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RolePermission, Permission, Role])],
  controllers: [RolePermissionController],
  providers: [RolePermissionService]
})
export class RolePermissionModule {}