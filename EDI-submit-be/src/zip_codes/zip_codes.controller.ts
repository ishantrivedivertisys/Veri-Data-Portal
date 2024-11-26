import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ZipCodesService } from './zip_codes.service';
import { CreateZipCodeDto } from './dto/request/create-zip_code.dto';
import { UpdateZipCodeDto } from './dto/request/update-zip_code.dto';
import { ZipCodeParentRoute, ZipCodeRoutes } from './zip_codes.routes';
import { Public } from 'src/auth/constants';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Zip-Code')
@ApiBearerAuth()
// @Public()
@Controller({ path: ZipCodeParentRoute})
export class ZipCodesController {
  constructor(private readonly zipCodesService: ZipCodesService) {}

  @Post(ZipCodeRoutes.create)
  create(@Body() createZipCodeDto: CreateZipCodeDto) {
    return this.zipCodesService.create(createZipCodeDto);
  }

  @Get(ZipCodeRoutes.view_all)
  findAll() {
    return this.zipCodesService.findAll();
  }

  @Get(ZipCodeRoutes.view_one)
  findOne(@Param('zipCodeId') id: string) {
    return this.zipCodesService.findOne(+id);
  }

  @Post(ZipCodeRoutes.update)
  update(@Param('zipCodeId') id: string, @Body() updateZipCodeDto: UpdateZipCodeDto) {
    return this.zipCodesService.update(+id, updateZipCodeDto);
  }

  @Delete(ZipCodeRoutes.delete)
  remove(@Param('zipCodeId') id: string) {
    return this.zipCodesService.remove(+id);
  }
}
