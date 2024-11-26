import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TempDataService } from './temp-data.service';
import { CreateTempDataDto } from './dto/request/create-temp-data.dto';
import { UpdateTempDataDto } from './dto/request/update-temp-data.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TempDataParentRoute, TempDataRoutes } from './temp-data.routes';
import { Public } from 'src/auth/constants';

@ApiTags('Temp-Data')
@ApiBearerAuth()
// @Public()
@Controller({ path: TempDataParentRoute})
export class TempDataController {
  constructor(private readonly tempDataService: TempDataService) {}

  @Post(TempDataRoutes.create)
  create(@Body() createTempDataDto: CreateTempDataDto) {
    return this.tempDataService.create(createTempDataDto);
  }

  @Get(TempDataRoutes.view_all)
  findAll() {
    return this.tempDataService.findAll();
  }

  @Get(TempDataRoutes.view_one)
  findOne(@Param('tempDataId') id: string) {
    return this.tempDataService.findOne(+id);
  }

  @Post(TempDataRoutes.update)
  update(@Param('tempDataId') id: string, @Body() updateTempDataDto: UpdateTempDataDto) {
    return this.tempDataService.update(+id, updateTempDataDto);
  }

  @Delete(TempDataRoutes.delete)
  remove(@Param('tempDataId') id: string) {
    return this.tempDataService.remove(+id);
  }
}
