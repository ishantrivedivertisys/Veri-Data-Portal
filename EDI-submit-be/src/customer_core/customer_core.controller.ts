import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CustomerCoreService } from './customer_core.service';
import { CreateCustomerCoreDto } from './dto/request/create-customer_core.dto';
import { UpdateCustomerCoreDto } from './dto/request/update-customer_core.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CustomerCoreParentRoute, CustomerCoreRoutes } from './customer_core.routes';
import { Public } from 'src/auth/constants';
import { CustomerListPaginated } from './dto/request/customer-list-paginated.dto';
import { getPagination } from 'src/common/utils/pagination';


@ApiTags('Customer')
@ApiBearerAuth()
// @Public()
@Controller({ path: CustomerCoreParentRoute})
export class CustomerCoreController {
  constructor(private readonly customerCoreService: CustomerCoreService) {}

  @Post(CustomerCoreRoutes.create)
  create(@Body() createCustomerCoreDto: CreateCustomerCoreDto) {
    return this.customerCoreService.create(createCustomerCoreDto);
  }

  @Get(CustomerCoreRoutes.view_all)
  findAll(
    @Query() queryParams: CustomerListPaginated,
  ) {
    const { search, sortColumn, sortType, ...paginateParams } = queryParams;
    const { skip, limit } = getPagination(paginateParams);
    return this.customerCoreService.findAll({
      skip,
      limit,
      search,
      sortColumn,
      sortType,
    });
  }

  @Get(CustomerCoreRoutes.view_one)
  findOne(@Param('customerId') id: string) {
    return this.customerCoreService.findOne(+id);
  }

  @Post(CustomerCoreRoutes.update)
  update(@Param('customerId') id: string, @Body() updateCustomerCoreDto: UpdateCustomerCoreDto) {
    return this.customerCoreService.update(+id, updateCustomerCoreDto);
  }

  @Delete(CustomerCoreRoutes.delete)
  remove(@Param('customerId') id: string) {
    return this.customerCoreService.remove(+id);
  }
}
