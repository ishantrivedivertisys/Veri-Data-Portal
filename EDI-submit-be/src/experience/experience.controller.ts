import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/request/create-experience.dto';
import { UpdateExperienceDto } from './dto/request/update-experience.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExperienceParentRoute, ExperienceRoutes } from './experience.routes';
import { ExperienceListPaginated } from './dto/request/experience-list-paginated.dto';
import { getPagination } from 'src/common/utils/pagination';
import { Public } from 'src/auth/constants';

@ApiTags('Experience')
@ApiBearerAuth()
// @Public()
@Controller({ path: ExperienceParentRoute})
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Post(ExperienceRoutes.create)
  create(@Body() createExperienceDto: CreateExperienceDto) {
    return this.experienceService.create(createExperienceDto);
  }

  @Get(ExperienceRoutes.view_all)
  findAll(
    @Query() queryParams: ExperienceListPaginated,
  ) {
    const { search, sortColumn, sortType, ...paginateParams } = queryParams;
    const { skip, limit } = getPagination(paginateParams);
    return this.experienceService.findAll({
      skip,
      limit,
      search,
      sortColumn,
      sortType,
    });
  }

  // @Get(ExperienceRoutes.view_one)
  // findOne(@Param('experienceId') id: string) {
  //   return this.experienceService.findOne(+id);
  // }

  // @Post(ExperienceRoutes.update)
  // update(@Param('experienceId') id: string, @Body() updateExperienceDto: UpdateExperienceDto) {
  //   return this.experienceService.update(+id, updateExperienceDto);
  // }

  // @Delete(ExperienceRoutes.delete)
  // remove(@Param('experienceId') id: string) {
  //   return this.experienceService.remove(+id);
  // }
}
