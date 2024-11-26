import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TemplateStructureService } from './template-structure.service';
import { CreateTemplateStructureDto } from './dto/request/create-template-structure.dto';
import { UpdateTemplateStructureDto } from './dto/request/update-template-structure.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TemplateStructureParentRoute, TemplateStructureRoutes } from './template-structure.routes';

@ApiTags('Template-structure')
@ApiBearerAuth()
@Controller({ path: TemplateStructureParentRoute})
export class TemplateStructureController {
  constructor(private readonly templateStructureService: TemplateStructureService) {}

  @Post(TemplateStructureRoutes.create)
  create(@Body() createTemplateStructureDto: CreateTemplateStructureDto) {
    return this.templateStructureService.create(createTemplateStructureDto);
  }

  @Get(TemplateStructureRoutes.view_all)
  findAll() {
    return this.templateStructureService.findAll();
  }

  @Get(TemplateStructureRoutes.view_one)
  findOne(@Param('templateStructureId') id: string) {
    return this.templateStructureService.findOne(+id);
  }

  @Post(TemplateStructureRoutes.update)
  update(@Body() updateTemplateStructureDto: UpdateTemplateStructureDto[]) {
    return this.templateStructureService.update(updateTemplateStructureDto);
  }

  @Delete(TemplateStructureRoutes.delete)
  remove(@Param('templateStructureId') id: string) {
    return this.templateStructureService.remove(+id);
  }
}
