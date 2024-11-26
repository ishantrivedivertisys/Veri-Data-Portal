import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AccountxrefCoreService } from './accountxref_core.service';
import { CreateAccountxrefCoreDto } from './dto/request/create-accountxref_core.dto';
import { UpdateAccountxrefCoreDto } from './dto/request/update-accountxref_core.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccountXrefParentRoute, AccountXrefRoutes } from './accountxref_core.routes';
import { Public } from 'src/auth/constants';

@ApiTags('AccountXref-Core')
@ApiBearerAuth()
// @Public()
@Controller({ path: AccountXrefParentRoute})
export class AccountxrefCoreController {
  constructor(private readonly accountxrefCoreService: AccountxrefCoreService) {}

  @Post(AccountXrefRoutes.create)
  create(@Body() createAccountxrefCoreDto: CreateAccountxrefCoreDto) {
    return this.accountxrefCoreService.create(createAccountxrefCoreDto);
  }

  @Get(AccountXrefRoutes.view_all)
  findAll() {
    return this.accountxrefCoreService.findAll();
  }

  @Get(AccountXrefRoutes.view_one)
  findOne(@Param('accountXrefId') id: string) {
    return this.accountxrefCoreService.findOne(id);
  }

  @Post(AccountXrefRoutes.update)
  update(@Param('accountXrefId') id: string, @Body() updateAccountxrefCoreDto: UpdateAccountxrefCoreDto) {
    return this.accountxrefCoreService.update(id, updateAccountxrefCoreDto);
  }

  @Delete(AccountXrefRoutes.delete)
  remove(@Param('accountXrefId') id: string) {
    return this.accountxrefCoreService.remove(id);
  }
}
