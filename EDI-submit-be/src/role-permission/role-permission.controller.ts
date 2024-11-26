import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { UpdateRolePermissionDto } from './dto/request/update-role-permission.dto';
import { RolePermissionParentRoute, RolePermissionRoutes } from './role-permission.routes';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateRolePermissionDto } from './dto/request/create-role-permission.dto';

@ApiTags('Role-Permission')
@ApiBearerAuth()
@Controller({ path: RolePermissionParentRoute})
export class RolePermissionController {
  constructor(private readonly rolepermissionService: RolePermissionService) {}

  @UseGuards(JwtAuthGuard)
  @Post(RolePermissionRoutes.create)
  create(@Body() createPermissionDto: CreateRolePermissionDto) {
    return this.rolepermissionService.create(createPermissionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(RolePermissionRoutes.view_all)
  findAll() {
    return this.rolepermissionService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(RolePermissionRoutes.view_one)
  findOne(@Param('rolePermissionId') id: string) {
    return this.rolepermissionService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(RolePermissionRoutes.update)
  update(@Param('rolePermissionId') id: string, @Body() updateRolePermissionDto: CreateRolePermissionDto) {
    return this.rolepermissionService.update(+id, updateRolePermissionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(RolePermissionRoutes.delete)
  remove(@Param('rolePermissionId') id: string) {
    return this.rolepermissionService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(RolePermissionRoutes.get_permission_with_role)
  getPermissionWithRole() {
    return this.rolepermissionService.getPermissionWithRole();
  }

  @UseGuards(JwtAuthGuard)
  @Get(RolePermissionRoutes.get_permissions_by_role_id)
  getPermissionsByRoleId(@Param('roleId') roleId: number) {
    return this.rolepermissionService.getPermissionsByRoleId(roleId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(RolePermissionRoutes.update_role_permission)
  updateRolePermission(@Body() request: UpdateRolePermissionDto[]) {
    return this.rolepermissionService.updateRolePermission(request);
  }
}