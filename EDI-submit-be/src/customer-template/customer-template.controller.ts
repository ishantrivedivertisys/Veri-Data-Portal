import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CustomerTemplateService } from './customer-template.service';
import { CreateCustomerTemplateDto } from './dto/request/create-customer-template.dto';
import { UpdateCustomerTemplateDto } from './dto/request/update-customer-template.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CustomerTemplateParentRoute, CustomerTemplateRoutes } from './customer-template.routes';
import { Public } from 'src/auth/constants';

@ApiTags('Customer-Template')
@ApiBearerAuth()
// @Public()
@Controller({ path: CustomerTemplateParentRoute})
export class CustomerTemplateController {
  constructor(private readonly customerTemplateService: CustomerTemplateService) {}

  @Post(CustomerTemplateRoutes.create)
  create(@Body() createCustomerTemplateDto: CreateCustomerTemplateDto) {
    return this.customerTemplateService.create(createCustomerTemplateDto);
  }

  @Get(CustomerTemplateRoutes.view_all)
  findAll() {
    return this.customerTemplateService.findAll();
  }

  @Get(CustomerTemplateRoutes.view_one)
  findOne(@Param('customerTemplateId') id: string) {
    return this.customerTemplateService.findOne(+id);
  }

  @Post(CustomerTemplateRoutes.update)
  update(@Param('customerTemplateId') id: string, @Body() updateCustomerTemplateDto: UpdateCustomerTemplateDto) {
    return this.customerTemplateService.update(+id, updateCustomerTemplateDto);
  }

  @Delete(CustomerTemplateRoutes.delete)
  remove(@Param('customerTemplateId') id: string) {
    return this.customerTemplateService.remove(+id);
  }

  @Get(CustomerTemplateRoutes.get_db_template_fields)
  getDBTemplateFields() {
    return this.customerTemplateService.getDBTemplateFields();
  }

  @Get(CustomerTemplateRoutes.get_by_customer_no)
  getByCustomerNumber(@Param('customerNo') customerNo: string) {
    return this.customerTemplateService.getByCustomerNumber(+customerNo);
  }

  // @Get(CustomerTemplateRoutes.get_by_customer_no)
  // getHeaderByHeaderRowNo(@Query('headerRows') headerRows: number) {
  //   return this.customerTemplateService.getHeaderByHeaderRowNo(headerRows);
  // }
}
