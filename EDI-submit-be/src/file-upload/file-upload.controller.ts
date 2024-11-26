import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { CreateFileUploadDto } from './dto/request/create-file-upload.dto';
import { UpdateFileUploadDto } from './dto/request/update-file-upload.dto';
import { FileUploadParentRoute, FileUploadRoutes } from './file-upload.routes';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/constants';

@ApiTags('File-upload')
@ApiBearerAuth()
// @Public()
@Controller({ path: FileUploadParentRoute})
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @UseGuards(JwtAuthGuard)
  @Post(FileUploadRoutes.create)
  create(@Body() createFileUploadDto: CreateFileUploadDto) {
    return this.fileUploadService.create(createFileUploadDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(FileUploadRoutes.view_all)
  findAll() {
    return this.fileUploadService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(FileUploadRoutes.view_one)
  findOne(@Param('fileUploadId') id: string) {
    return this.fileUploadService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(FileUploadRoutes.update)
  update(@Param('fileUploadId') id: string, @Body() updateFileUploadDto: UpdateFileUploadDto) {
    return this.fileUploadService.update(+id, updateFileUploadDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(FileUploadRoutes.delete)
  remove(@Param('fileUploadId') id: string) {
    return this.fileUploadService.remove(+id);
  }
}
