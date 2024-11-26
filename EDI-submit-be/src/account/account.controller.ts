import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/request/create-account.dto';
import { UpdateAccountDto } from './dto/request/update-account.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccountParentRoute, AccountRoutes } from './account.routes';
import { AccountListPaginated } from './dto/request/account-list-paginated.dto';
import { getPagination } from 'src/common/utils/pagination';
import { Public } from 'src/auth/constants';

@ApiTags('Account')
@ApiBearerAuth()
// @Public()
@Controller({ path: AccountParentRoute})
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post(AccountRoutes.create)
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.create(createAccountDto);
  }

  @Get(AccountRoutes.view_all)
  findAll(
    @Query() queryParams: AccountListPaginated,
  ) {
    const { search, sortColumn, sortType, city, country, zip_code, state, ...paginateParams } = queryParams;
    const { skip, limit } = getPagination(paginateParams);
    return this.accountService.findAll({
      skip,
      limit,
      search,
      sortColumn,
      sortType,
      city,
      country,
      zip_code,
      state
    });
  }

  @Get(AccountRoutes.view_one)
  findOne(@Param('accountId') id: string) {
    return this.accountService.findOne(+id);
  }

  @Post(AccountRoutes.update)
  update(@Param('accountId') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(+id, updateAccountDto);
  }

  @Delete(AccountRoutes.delete)
  remove(@Param('accountId') id: string) {
    return this.accountService.remove(+id);
  }
}
