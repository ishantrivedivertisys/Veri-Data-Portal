import { Controller, Get, Post, Body, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { TempExperienceService } from './temp-experience.service';
import { CreateTempExperienceDto } from './dto/request/create-temp-experience.dto';
import { UpdateTempExperienceDto } from './dto/request/update-temp-experience.dto';
import { TempExperienceParentRoute, TempExperienceRoutes } from './temp-experience.routes';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/auth/constants';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { TempExperienceListPaginated } from './dto/request/temp-experience-list-paginated.dto';
import { getPagination } from 'src/common/utils/pagination';
import { ValidateTemplateAndHeaderTradeDto } from './dto/request/validate-template-and-header-trade-tape.dto';
import { TradeTapeMappingDto } from './dto/request/trade-tape-mapping.dto';
import { FileProcessingDto } from './dto/request/file-processing.dto';
import { FigureDateDto } from './dto/request/figure-date.dto';
import { CreateTemplateStructureDto } from 'src/template-structure/dto/request/create-template-structure.dto';
import { TempDataListPaginated } from 'src/temp-data/dto/request/temp-data-list-paginated.dto';

@ApiTags('Temp-experience')
@ApiBearerAuth()
// @Public()
@Controller({ path: TempExperienceParentRoute})
export class TempExperienceController {
  constructor(private readonly tempExperienceService: TempExperienceService) {}

  @UseGuards(JwtAuthGuard)
  @Post(TempExperienceRoutes.create)
  create(@Body() createTempExperienceDto: CreateTempExperienceDto) {
    return this.tempExperienceService.create(createTempExperienceDto);
  }

  @Get(TempExperienceRoutes.view_all)
  findAll() {
    return this.tempExperienceService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(TempExperienceRoutes.view_one)
  findOne(@Param('tempExperienceId') id: string) {
    return this.tempExperienceService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(TempExperienceRoutes.update)
  update(@Param('tempExperienceId') id: string, @Body() updateTempExperienceDto: UpdateTempExperienceDto) {
    return this.tempExperienceService.update(+id, updateTempExperienceDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(TempExperienceRoutes.delete)
  remove(@Param('tempExperienceId') id: string) {
    return this.tempExperienceService.remove(+id);
  }

  @Post(TempExperienceRoutes.upload_excel)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { 
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadExcel(@UploadedFile() file: Express.Multer.File, @Body() req: any) {
    return await this.tempExperienceService.uploadExcel(file, req);
  }

  @Get(TempExperienceRoutes.get_temp_experience_by_file_upload_id)
  async getTempExperienceByFileUploadId(@Param('fileUploadId') id: number, @Query() queryParams: TempExperienceListPaginated) {
    const { 
      search, 
      status, 
      sortColumn,
      sortType,
      ...paginateParams
    } = queryParams;
    const { skip, limit } = getPagination(paginateParams);
    return await this.tempExperienceService.getTempExperienceByFileUploadId(id, {
      skip,
      limit,
      search,
      sortColumn,
      sortType,
      status,
    });
  }

  // @Post(TempExperienceRoutes.approve)
  // async tradeTapeApproval(@Param('fileUploadId') id: number) {
  //   return await this.tempExperienceService.tradeTapeApproval(id);
  // }

  @Get(TempExperienceRoutes.get_import_history)
  async getImportHistory(@Query() queryParams: TempExperienceListPaginated) {
    const { 
      search,
      sortColumn,
      sortType,
      fromDate,
      toDate,
      memberIds,
      ...paginateParams 
    } = queryParams;
    const { skip, limit } = getPagination(paginateParams);
    return await this.tempExperienceService.getImportHistory({
      skip,
      limit,
      search,
      sortColumn,
      sortType,
      fromDate,
      toDate,
      memberIds
    });
  }

  @Get(TempExperienceRoutes.get_pending_trade_tape_by_file_upload_id)
  async getPendingTradeTapeByFileUploadId(@Param('fileUploadId') id: number, @Query() queryParams: TempDataListPaginated) {
    const { 
      sortColumn,
      sortType,
      ...paginateParams
    } = queryParams;
    const { skip, limit } = getPagination(paginateParams);
    return await this.tempExperienceService.getPendingTradeTapeByFileUploadId(id, {
      skip,
      limit,
      sortColumn,
      sortType,
    });
  }

  @Get(TempExperienceRoutes.get_header_trade_tape_by_file_upload_id)
  async getHeaderTradeTapeByFileUploadId(
    @Query() queryParams: ValidateTemplateAndHeaderTradeDto
  ) {
    const {fileUploadId, customerTemplateId} = queryParams;
    return await this.tempExperienceService.getHeaderTradeTapeByFileUploadId(fileUploadId, customerTemplateId);
  }

  @Post(TempExperienceRoutes.validate_template)
  async validateTemplate(
    @Query() queryParams: ValidateTemplateAndHeaderTradeDto
  ) {
    const {fileUploadId, customerTemplateId} = queryParams;
    return await this.tempExperienceService.validateTemplate(fileUploadId, customerTemplateId);
  }

  @Post(TempExperienceRoutes.trade_tape_mapping)
  async tradeTapeMapping(
    @Query() queryParams: TradeTapeMappingDto
  ) {
    const {tempExperienceId, accountId} = queryParams;
    return await this.tempExperienceService.tradeTapeMapping(tempExperienceId,accountId);
  }

  @Post(TempExperienceRoutes.file_processing)
  @Public()
  async fileProcessing(@Body() request: FileProcessingDto) {
    return await this.tempExperienceService.processUploadedExcel(request.fileUrl, request.customerNo, request.dataSite);
  }

  @Post(TempExperienceRoutes.update_trade_tape_by_file_upload_id)
  async updateTradeTapeByFileUploadId(@Param('fileUploadId') fileUploadId: number, @Body() request: FigureDateDto) {
    return await this.tempExperienceService.updateTradeTapeByFileUploadId(fileUploadId, request);
  }


  @Post(TempExperienceRoutes.delete_trade_tape_by_file_upload_id)
  async deleteTradeTapeByFileUploadId(@Param('fileUploadId') fileUploadId: number) {
    return await this.tempExperienceService.deleteTradeTapeByFileUploadId(fileUploadId);
  }

  @Get(TempExperienceRoutes.un_matched_columns_by_file_upload_id)
  async unMatchedColumnsByFileUploadId(@Param('fileUploadId') fileUploadId: number) {
    return await this.tempExperienceService.getUnMatchedColumnsByFileUploadId(fileUploadId);
  }

  @Post(TempExperienceRoutes.delete_template_column_by_id)
  async deleteTemplateColumnById(@Param('templateStructureId') templateStructureId: number, @Body() req: CreateTemplateStructureDto) {
    return await this.tempExperienceService.deleteTemplateColumnById(templateStructureId, req);
  }
  
}
