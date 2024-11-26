import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { Public } from 'src/auth/constants';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersParentRoute, UsersRoutes } from './users.http.routes';
import { VerifyOtpDto } from './dto/request/verify-otp.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserListPaginated } from './dto/request/user-list-paginated.dto';
import { getPagination } from 'src/common/utils/pagination';
import { UpdateUserStatusDto } from './dto/request/update-user-status.dto';
import { ChangePasswordDto } from './dto/request/change-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
// @Public()
@Controller({ path: UsersParentRoute })
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    ) {}
  
  @Public()
  @Post(UsersRoutes.create)
  createUser(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get(UsersRoutes.all_users)
  findAllUsers(
    @Query() queryParams: UserListPaginated,
  ) {
    const { search, sortColumn, sortType, ...paginateParams } = queryParams;
    const { skip, limit } = getPagination(paginateParams);
    return this.usersService.findAll({
      skip,
      limit,
      search,
      sortColumn,
      sortType
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(UsersRoutes.user)
  findUserById(@Param('userId') id: number) {
    return this.usersService.findOne(+id);
  }

  @Public()
  @Post(UsersRoutes.verify)
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.usersService.verifyOtp(verifyOtpDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(UsersRoutes.update)
  updateUsersById(@Param('userId') id: number, @Body() body: UpdateUserDto) {
    return this.usersService.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(UsersRoutes.delete)
  removeUserById(@Param('userId') id: string) {
    return this.usersService.remove(+id);
  }

  @Public()
  @Post(UsersRoutes.resend_otp)
  resendOtp(@Body() data:any ) {
    return this.usersService.resendOtp(data);
  }

  @Public()
  @Post(UsersRoutes.update_password)
  updatePassword(@Body() data:any){
    return this.usersService.updatePassword(data);
  }

  @UseGuards(JwtAuthGuard)
  @Post(UsersRoutes.updateStatus)
  updateUserStatusById(@Body() body: UpdateUserStatusDto) {
    return this.usersService.updateUserStatus(body);
  }

  @Post(UsersRoutes.change_password)
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return await this.usersService.changePassword(changePasswordDto);
  }

  // @Post(UsersRoutes.file_upload)
  // @UseInterceptors(FileInterceptor('file')) 
  // async uploadFile(@UploadedFile() file: Express.Multer.File) { 
  //   const upload = await this.fileService.uploadFile(file) 
  //   return { upload, message: 'uploaded successfully' } 
  // } 

}
