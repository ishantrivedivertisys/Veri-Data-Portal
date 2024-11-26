import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CurrencyRateService } from './currency-rate.service';
import { CreateCurrencyRateDto } from './dto/request/create-currency-rate.dto';
import { UpdateCurrencyRateDto } from './dto/request/update-currency-rate.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrencyRateParentRoute, CurrencyRateRoutes } from './currency-rate.routes';

@ApiTags('Currency-Rate')
@ApiBearerAuth()
@Controller({ path: CurrencyRateParentRoute})
export class CurrencyRateController {
  constructor(private readonly currencyRateService: CurrencyRateService) {}

  @Post(CurrencyRateRoutes.create)
  create(@Body() createCurrencyRateDto: CreateCurrencyRateDto) {
    return this.currencyRateService.create(createCurrencyRateDto);
  }

  @Get(CurrencyRateRoutes.view_all)
  findAll() {
    return this.currencyRateService.findAll();
  }

  @Get(CurrencyRateRoutes.view_one)
  findOne(@Param('currencyRateId') id: string) {
    return this.currencyRateService.findOne(+id);
  }

  @Post(CurrencyRateRoutes.update)
  update(@Param('currencyRateId') id: string, @Body() updateCurrencyRateDto: UpdateCurrencyRateDto) {
    return this.currencyRateService.update(+id, updateCurrencyRateDto);
  }

  @Delete(CurrencyRateRoutes.delete)
  remove(@Param('currencyRateId') id: string) {
    return this.currencyRateService.remove(+id);
  }
}
