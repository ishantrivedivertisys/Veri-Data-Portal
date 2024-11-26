import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/request/create-country.dto';
import { UpdateCountryDto } from './dto/request/update-country.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CountryParentRoute, CountryRoutes } from './country.routes';
import { Public } from 'src/auth/constants';

@ApiTags('Country')
@ApiBearerAuth()
// @Public()
@Controller({ path: CountryParentRoute})
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post(CountryRoutes.create)
  create(@Body() createCountryDto: CreateCountryDto) {
    return this.countryService.create(createCountryDto);
  }

  @Get(CountryRoutes.view_all)
  findAll() {
    return this.countryService.findAll();
  }

  @Get(CountryRoutes.view_one)
  findOne(@Param('countryId') id: string) {
    return this.countryService.findOne(+id);
  }

  @Post(CountryRoutes.update)
  update(@Param('countryId') id: string, @Body() updateCountryDto: UpdateCountryDto) {
    return this.countryService.update(+id, updateCountryDto);
  }

  @Delete(CountryRoutes.delete)
  remove(@Param('countryId') id: string) {
    return this.countryService.remove(+id);
  }
}
