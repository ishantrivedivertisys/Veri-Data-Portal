import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { EdisubmitterService } from './edisubmitter.service';
import { CreateEdisubmitterDto } from './dto/request/create-edisubmitter.dto';
import { UpdateEdisubmitterDto } from './dto/request/update-edisubmitter.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EdiSubmitterParentRoute, EdiSubmitterRoutes } from './edisubmitter.routes';
import { CustomerAndDatasiteDto } from './dto/request/customer-and-datasite.dto';
import { EdisubmitterListPaginated } from './dto/request/edisubmitter-list-paginated.dto';
import { getPagination } from 'src/common/utils/pagination';

@ApiTags('Edisubmitter')
@ApiBearerAuth()
@Controller({ path: EdiSubmitterParentRoute})
export class EdisubmitterController {
  constructor(private readonly edisubmitterService: EdisubmitterService) {}

  @Post(EdiSubmitterRoutes.create)
  create(@Body() createEdisubmitterDto: CreateEdisubmitterDto) {
    return this.edisubmitterService.create(createEdisubmitterDto);
  }

  @Get(EdiSubmitterRoutes.view_all)
  findAll(
    @Query() queryParams: EdisubmitterListPaginated,
  ) {
  const { search, sortColumn, sortType, ...paginateParams } = queryParams;
  const { skip, limit } = getPagination(paginateParams);
  return this.edisubmitterService.findAll({
    skip,
    limit,
    search,
    sortColumn,
    sortType,
  });
}

  @Get(EdiSubmitterRoutes.view_one)
  findOne(@Param('ediSubmitterId') id: string) {
    return this.edisubmitterService.findOne(+id);
  }

  @Post(EdiSubmitterRoutes.update)
  update(@Param('ediSubmitterId') id: string, @Body() updateEdisubmitterDto: UpdateEdisubmitterDto) {
    return this.edisubmitterService.update(+id, updateEdisubmitterDto);
  }

  @Delete(EdiSubmitterRoutes.delete)
  remove(@Param('ediSubmitterId') id: string) {
    return this.edisubmitterService.remove(+id);
  }

  @Get(EdiSubmitterRoutes.get_edisubmitter_by_customer_and_datasite)
  getEDISubmitterByCustomerAndDatasite(
    @Query() queryParams: CustomerAndDatasiteDto
  ) {
    const {customer, datasite} = queryParams;
    return this.edisubmitterService.getEDISubmitterByCustomerAndDatasite(customer, datasite);
  }
}
