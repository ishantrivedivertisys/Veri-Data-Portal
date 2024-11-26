import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { PermissionService } from './permission.service';
import {CreatePermisssionDto} from './dto/request/create-permission.dto'
import { UpdatePermissionDto } from './dto/request/update-permission.dto';
import { PermissionParentRoute, PermissionRoutes } from './permission.routes';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Permission')
@ApiBearerAuth()
@Controller({ path: PermissionParentRoute})
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @UseGuards(JwtAuthGuard)
  @Post(PermissionRoutes.create)
  create(@Body() createPermissionDto: CreatePermisssionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(PermissionRoutes.view_all)
  findAll() {
    return this.permissionService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(PermissionRoutes.view_one)
  findOne(@Param('permissionId') id: string) {
    return this.permissionService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(PermissionRoutes.update)
  update(@Param('permissionId') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionService.update(+id, updatePermissionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(PermissionRoutes.delete)
  remove(@Param('permissionId') id: string) {
    return this.permissionService.remove(+id);
  }
}