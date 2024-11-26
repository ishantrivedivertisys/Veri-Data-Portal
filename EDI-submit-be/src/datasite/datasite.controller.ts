import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DatasiteService } from './datasite.service';
import { CreateDatasiteDto } from './dto/request/create-datasite.dto';
import { UpdateDatasiteDto } from './dto/request/update-datasite.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/constants';
import { DatasiteParentRoute, DatasiteRoutes } from './datasite.routes';

@ApiTags('Datasite')
@ApiBearerAuth()
// @Public()
@Controller({ path: DatasiteParentRoute})
export class DatasiteController {
  constructor(private readonly datasiteService: DatasiteService) {}

  @Post(DatasiteRoutes.create)
  create(@Body() createDatasiteDto: CreateDatasiteDto) {
    return this.datasiteService.create(createDatasiteDto);
  }

  @Get(DatasiteRoutes.view_all)
  findAll() {
    return this.datasiteService.findAll();
  }

  @Get(DatasiteRoutes.view_one)
  findOne(@Param('datasiteId') id: string) {
    return this.datasiteService.findOne(+id);
  }

  @Post(DatasiteRoutes.update)
  update(@Param('datasiteId') id: string, @Body() updateDatasiteDto: UpdateDatasiteDto) {
    return this.datasiteService.update(+id, updateDatasiteDto);
  }

  @Delete(DatasiteRoutes.delete)
  remove(@Param('datasiteId') id: string) {
    return this.datasiteService.remove(+id);
  }

  @Get(DatasiteRoutes.get_datasite_by_customer_no)
  getDatasiteByCustomerNo(@Param('customerNo') customerNo: number) {
    return this.datasiteService.getDatasiteByCustomerNo(customerNo);
  }
}
