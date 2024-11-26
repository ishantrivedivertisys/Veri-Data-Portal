import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StateService } from './state.service';
import { CreateStateDto } from './dto/request/create-state.dto';
import { UpdateStateDto } from './dto/request/update-state.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { StateParentRoute, StateRoutes } from './state.routes';
import { Public } from 'src/auth/constants';

@ApiTags('State')
@ApiBearerAuth()
// @Public()
@Controller({ path: StateParentRoute})
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Post(StateRoutes.create)
  create(@Body() createStateDto: CreateStateDto) {
    return this.stateService.create(createStateDto);
  }

  @Get(StateRoutes.view_all)
  findAll() {
    return this.stateService.findAll();
  }

  @Get(StateRoutes.view_one)
  findOne(@Param('stateId') id: string) {
    return this.stateService.findOne(id);
  }

  @Post(StateRoutes.update)
  update(@Param('stateId') id: string, @Body() updateStateDto: UpdateStateDto) {
    return this.stateService.update(id, updateStateDto);
  }

  @Delete(StateRoutes.delete)
  remove(@Param('stateId') id: string) {
    return this.stateService.remove(id);
  }

  @Get(StateRoutes.get_state_list_by_country_id)
  getStateListByCountryId(@Param('countryId') id: string) {
    return this.stateService.getStateListByCountryId(+id);
  }
}
