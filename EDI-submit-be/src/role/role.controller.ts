import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/request/create-role.dto';
import { UpdateRoleDto } from './dto/request/update-role.dto';
import { RoleParentRoute, RoleRoutes } from './role.routes';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { getPagination } from 'src/common/utils/pagination';
import { RoleListPaginated } from './dto/request/role-list-paginated.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Role')
@ApiBearerAuth()
@Controller({ path: RoleParentRoute})
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @UseGuards(JwtAuthGuard)
  @Post(RoleRoutes.create)
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(RoleRoutes.view_all)
  findAllRole(
    @Query() queryParams: RoleListPaginated,
  ) {
    const { search, sortColumn, sortType, status, ...paginateParams } = queryParams;
    const { skip, limit } = getPagination(paginateParams);
    return this.roleService.findAll({
      skip,
      limit,
      search,
      sortColumn,
      sortType,
      status
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(RoleRoutes.view_one)
  findOne(@Param('roleId') id: number) {
    return this.roleService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(RoleRoutes.update)
  update(@Param('roleId') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(RoleRoutes.delete)
  remove(@Param('roleId') id: number) {
    return this.roleService.remove(+id);
  }
}
