import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTempExperienceDto } from './dto/request/create-temp-experience.dto';
import { UpdateTempExperienceDto } from './dto/request/update-temp-experience.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TempExperience } from './entities/temp-experience.entity';
import { Between, Brackets, DataSource, In, IsNull, Not, QueryRunner, Repository } from 'typeorm';
import { Messages } from 'src/common/constants/messages';
import { FileUpload } from 'src/file-upload/entities/fileUpoad.entity';
import { FileUploadStatus } from 'src/file-upload/entities/fileUploadStatus.enum';
import { TEMPLATECONFIG } from 'src/common/constants/template.config';
const lodash = require("lodash");
import { read, utils } from 'xlsx';
import axios, { AxiosResponse } from 'axios';
// const { Engine } = require('json-rules-engine');
const moment = require('moment');
moment.suppressDeprecationWarnings = true;
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

import { Engine } from 'json-rules-engine';
import { v4 as uuid } from 'uuid';
import { Account } from 'src/account/entities/account.entity';
import { Country } from 'src/country/entities/country.entity';
import { State } from 'src/state/entities/state.entity';
import { Accountxref } from 'src/accountxref_core/entities/accountxref_core.entity';
import { TempExperienceStatus } from './entities/temp-experience.status.enum';
import { Experience } from 'src/experience/entities/experience.entity';
import { CustomerTemplate } from 'src/customer-template/entities/customer-template.entity';
import { TempData } from 'src/temp-data/entities/temp-data.entity';
import { IFindAllTempExperience } from './interface/temp-experience.find';
import { Customer } from 'src/customer_core/entities/customer_core.entity';
import { ZipCode } from 'src/zip_codes/entities/zip_code.entity';
import { FileProcessingDto } from './dto/request/file-processing.dto';
import { Datasite } from 'src/datasite/entities/datasite.entity';
import { IMail } from 'src/common/model/interface/IMail';
import { TemplateTypes } from 'src/common/helpers/mail/enums/template.code.enum';
import { MailService } from 'src/common/helpers/mail/mail.service';
import { getCheckDigit } from 'src/common/utils/get-check-digit';
import { FigureDateDto } from './dto/request/figure-date.dto';
import { ExtraFields } from 'src/common/constants/extra.fields';
import { CurrencyRate } from 'src/currency-rate/entities/currency-rate.entity';
import { HeaderRowKeyword } from 'src/common/constants/header-row-keyword';
import { ProcessStatus } from 'src/file-upload/entities/processStatus.enum';
import { TEMPLATESCONFIG } from 'src/common/constants/templates.config';
import { TemplateStructure } from 'src/template-structure/entities/template-structure.entity';
import { IFindAllTempData } from 'src/temp-data/interface/temp-data.find';
import { AlreadyExistsException } from 'src/common/helpers/exception/AlreadyExistsException';
// import moment from 'moment';

type ConfigItem = {
  TableColumnName: string;
  Validation: string[];
};

type ValidationResult = Record<string, string>;

@Injectable()
export class TempExperienceService {
  allowedExcelExtensions = ['xlsx', 'xls', 'csv'];
  allowedTextExtensions = ['txt', 'dat'];
  constructor(
    @InjectRepository(TempExperience) private tempExperienceRepository: Repository<TempExperience>,
    @InjectRepository(FileUpload) private fileUploadRepository: Repository<FileUpload>,
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    @InjectRepository(Country) private countryRepository: Repository<Country>,
    @InjectRepository(State) private stateRepository: Repository<State>,
    @InjectRepository(Accountxref) private accountXrefRepository: Repository<Accountxref>,
    @InjectRepository(Experience) private experienceRepository: Repository<Experience>,
    @InjectRepository(CustomerTemplate) private customerTemplateRepository: Repository<CustomerTemplate>,
    @InjectRepository(TempData) private tempDataRepository: Repository<TempData>,
    @InjectRepository(Customer) private customerRepository: Repository<Customer>,
    @InjectRepository(ZipCode) private zipCodeRepository: Repository<ZipCode>,
    @InjectRepository(Datasite) private datasiteRepository: Repository<Datasite>,
    @InjectRepository(CurrencyRate) private currencyRateRepository: Repository<CurrencyRate>,
    @InjectRepository(TemplateStructure) private templateStructureRepository: Repository<TemplateStructure>,
    private configService: ConfigService,
    private dataSource: DataSource,
    private mailService: MailService,
  ) { }
  async create(request: CreateTempExperienceDto) {
    const result = await this.tempExperienceRepository.create(request);
    await this.tempExperienceRepository.save(result);

    if (result) {
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.TempExperienceModule.Created}`,
        data: result
      }
    }
  }

  async findAll() {
    const result = await this.tempExperienceRepository.find();

    if (result.length > 0) {
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.TempExperienceModule.Found}`,
        data: result,
      };
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.TempExperienceModule.NotFound}`,
      };
    }
  }

  async findOne(tempExperienceId: number) {
    try {
      const result = await this.tempExperienceRepository.findOne({
        where: { id: tempExperienceId }
      });
      if (result) {
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.TempExperienceModule.Found}`,
          data: result
        }
      } else {
        return {
          statusCode: HttpStatus.NO_CONTENT,
          message: `${Messages.TempExperienceModule.NotFound}`,
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async update(tempExperienceId: number, request: UpdateTempExperienceDto) {
    let isEmailSend = false;
    const tempExperience = await this.tempExperienceRepository.findOne({
      where: { id: tempExperienceId }
    });
    // const before1MonthDate = moment(new Date()).subtract(1, 'months');
    // const after1DayDate = moment(new Date()).add(1, 'day');
    if (tempExperience) {
      // if (request.figureDate) {
      //   const figureDate = moment(request.figureDate);
      //   request.figureDate = moment(request.figureDate).format('YYYY-MM-DD');
      //   if (figureDate.isSameOrBefore(before1MonthDate) || figureDate.isSameOrAfter(after1DayDate)) {
      //     throw new BadRequestException('Figuredate is older then 30 days');
      //   }
      //   await this.tempExperienceRepository.createQueryBuilder()
      //     .update(TempExperience)
      //     .set({
      //       figureDate: request.figureDate,
      //       error: () => {
      //         return `CASE 
      //           WHEN "warning" LIKE '%Different figure dates available in a file,%'
      //             OR "warning" LIKE '%Figuredate is older then 30 days,%'
      //           THEN REPLACE(REPLACE("warning", 'Different figure dates available in a file,', ''), 'Figuredate is older then 30 days,', '')
      //             ELSE "warning"
      //           END`;
      //       }
      //     })
      //     .where(`fileUploadId = ${tempExperience.fileUploadId}`)
      //     .execute();
      //   tempExperience.id = undefined;
      // }
      await this.tempExperienceRepository.update(tempExperienceId, request);
      await this.validationCheckedEmptyRowsAndDataType(isEmailSend, tempExperience.fileUploadId, tempExperience.id);
      const updatedTempExperience = await this.tempExperienceRepository.findOne({
        where: { id: tempExperienceId }
      });
      const tempExperienceData = await this.tempExperienceRepository.find({
        where: { fileUploadId: updatedTempExperience.fileUploadId }
      });
      const updatedTempExperienceData = [...tempExperienceData.reduce((res, obj) => {
        res.has(obj.customerRefNo) || res.set(obj.customerRefNo, Object.assign({}, obj,
          { highCredit: 0, totalOwing: 0, current: 0, dating: 0, aging1_30: 0, aging31_60: 0, aging61_90: 0, agingOver90: 0 }));
        const item = res.get(obj.customerRefNo);
        item.highCredit += +obj.highCredit;
        item.totalOwing += +obj.totalOwing;
        item.current += +obj.current;
        item.dating += +obj.dating;
        item.aging1_30 += +obj.aging1_30;
        item.aging31_60 += +obj.aging31_60;
        item.aging61_90 += +obj.aging61_90;
        item.agingOver90 += +obj.agingOver90;

        return res;
      }, new Map()).values()];
      let newTempExperience;
      if (updatedTempExperienceData.length !== tempExperienceData.length) {
        for (let temp of updatedTempExperienceData) {
          await this.tempExperienceRepository.update(temp.id, temp);
        }
        await this.tempExperienceRepository.update(tempExperienceId, { status: TempExperienceStatus.DISABLE });
        newTempExperience = await this.tempExperienceRepository.findOne({
          where: { id: tempExperienceId }
        });
      } else {
        newTempExperience = await this.tempExperienceRepository.findOne({
          where: { id: tempExperienceId }
        });
      }

      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.TempExperienceModule.Updated}`,
        // data: newTempExperience
      }
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.TempExperienceModule.NotFound}`,
      }
    }
  }

  async remove(tempExperienceId: number) {
    const deletedTempExperience = await this.tempExperienceRepository.findOne({
      where: {
        id: tempExperienceId
      }
    });
    if (deletedTempExperience) {
      await this.tempExperienceRepository.delete(tempExperienceId);
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.TempExperienceModule.Deleted}`,
        data: deletedTempExperience
      };
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.TempExperienceModule.NotFound}`,
      }
    }
  }

  async processUploadedExcel(fileUrl: string, customerNo: number, dataSite: number, fileName?: any): Promise<any> {
    var result: any;
    let resFileUpload;
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // const customerData = await this.customerRepository.findOne({
    //   where: { id: customerNo },
    // });
    // if (!customerData) {
    //   throw new BadRequestException('Invalid customer');
    // }
    // const datasiteData = await this.datasiteRepository.findOne({
    //   where: {
    //     id: dataSite,
    //     customer: customerNo
    //   },
    // });
    // if (!datasiteData) {
    //   throw new BadRequestException('Datasite not found');
    // }

    try {
      const awsS3Bucket = this.configService.get('AWS_S3_BUCKET');
      const s3 = new AWS.S3({
        signatureVersion: 'v4',
        accessKeyId: this.configService.get('ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('SECRET_ACCESS_KEY'),
        region: this.configService.get('REGION'),
      });

      const parts = fileUrl.split('/');
      const key = parts.pop();
      const params = {
        Bucket: `${awsS3Bucket}/${customerNo}/${dataSite}`,
        Key: key,
      };
      let s3url = s3.getSignedUrl('getObject', {Bucket: params.Bucket, Key: params.Key});
      let rows;
      console.log("******3. Read sheet from s3 url******");
      const extension = key.split('.').pop().toLowerCase();
      if (extension == 'dat') {
        rows = await this.readDatFileFromURL(s3url);
      }
      else {
        rows = await this.readTemplateFromURL(s3url);
      }

      const isFileExist = await this.fileUploadRepository.findOne({
        where: { fileName: fileName ? fileName : key }
      })
      if (isFileExist) {
        console.log("******3.1. Validation for file existance******");
        return;
      }

      console.log("******4. Save in file upload table******");
      const fileUpload = {
        fileName: fileName ? fileName : key,
        filePath: s3url,
        fileSize: 0,
        noOfRows: rows.length > 0 ? rows.length : 0,
        status: FileUploadStatus.PENDING,
        customerNo: customerNo,
        datasite: dataSite
      };

      resFileUpload = await this.fileUploadRepository.save(fileUpload);

      console.log('@@@', rows.statusCode)
      // if(rows.statusCode == 400) {
      //   throw new BadRequestException('Empty File Not allowed!')
      // }
      if (rows.statusCode == 400) {
        await this.fileUploadRepository.update(resFileUpload.id, {status: FileUploadStatus.EMPTY, statusReason: 'Empty File'});
        return {
          statusCode: HttpStatus.NO_CONTENT,
          message: `${Messages.FileUploadModule.EmptyFile}`,
        };
      }

      console.log("******5. Save sheet data in tempData table******");

      const formatCell = (cell) => {
        if (moment(cell, 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid()) {
          return moment(cell).utcOffset(9).format('YYYY-MM-DD');
        }
        if (typeof cell === 'string' && (cell.includes('$'))) {
          const cleanValue = cell.replace(/[$,]/g, '');
          const numValue = parseFloat(cleanValue);
          if (!isNaN(numValue)) {
              return numValue;
          }
        }
        if (this.isDecimal(cell)) {
          return Math.trunc(+cell);
        }
        return cell;
      };

      const temp = rows.updatedArrayData.map(row => {
        const formattedRow = { fileUploadId: resFileUpload.id };
        for (let i = 0; i < 50; i++) {
          formattedRow[`column${i + 1}`] = formatCell(row[i]);
        }
        formattedRow.fileUploadId = resFileUpload.id;
        return formattedRow;
      });

      // let temp = rows.updatedArrayData.map(row => {
      //   return {
      //     column1: moment(row[0], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[0]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[0]) ? Math.trunc(+row[0]) : row[0],

      //     column2: moment(row[1], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[1]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[1]) ? Math.trunc(+row[1]) : row[1],

      //     column3: moment(row[2], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[2]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[2]) ? Math.trunc(+row[2]) : row[2],

      //     column4: moment(row[3], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[3]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[3]) ? Math.trunc(+row[3]) : row[3],

      //     column5: moment(row[4], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[4]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[4]) ? Math.trunc(+row[4]) : row[4],

      //     column6: moment(row[5], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[5]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[5]) ? Math.trunc(+row[5]) : row[5],

      //     column7: moment(row[6], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[6]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[6]) ? Math.trunc(+row[6]) : row[6],

      //     column8: moment(row[7], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[7]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[7]) ? Math.trunc(+row[7]) : row[7],

      //     column9: moment(row[8], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[8]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[8]) ? Math.trunc(+row[8]) : row[8],

      //     column10: moment(row[9], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[9]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[9]) ? Math.trunc(+row[9]) : row[9],

      //     column11: moment(row[10], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[10]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[10]) ? Math.trunc(+row[10]) : row[10],

      //     column12: moment(row[11], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[11]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[11]) ? Math.trunc(+row[11]) : row[11],

      //     column13: moment(row[12], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[12]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[12]) ? Math.trunc(+row[12]) : row[12],

      //     column14: moment(row[13], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[13]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[13]) ? Math.trunc(+row[13]) : row[13],

      //     column15: moment(row[14], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[14]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[14]) ? Math.trunc(+row[14]) : row[14],

      //     column16: moment(row[15], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[15]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[15]) ? Math.trunc(+row[15]) : row[15],

      //     column17: moment(row[16], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[16]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[16]) ? Math.trunc(+row[16]) : row[16],

      //     column18: moment(row[17], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[17]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[17]) ? Math.trunc(+row[17]) : row[17],

      //     column19: moment(row[18], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[18]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[18]) ? Math.trunc(+row[18]) : row[18],

      //     column20: moment(row[19], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[19]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[19]) ? Math.trunc(+row[19]) : row[19],

      //     column21: moment(row[20], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[20]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[20]) ? Math.trunc(+row[20]) : row[20],

      //     column22: moment(row[21], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[21]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[21]) ? Math.trunc(+row[21]) : row[21],

      //     column23: moment(row[22], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[22]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[22]) ? Math.trunc(+row[22]) : row[22],

      //     column24: moment(row[23], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[23]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[23]) ? Math.trunc(+row[23]) : row[23],

      //     column25: moment(row[24], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[24]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[24]) ? Math.trunc(+row[24]) : row[24],

      //     column26: moment(row[25], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[25]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[25]) ? Math.trunc(+row[25]) : row[25],

      //     column27: moment(row[26], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[26]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[26]) ? Math.trunc(+row[26]) : row[26],

      //     column28: moment(row[27], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[27]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[27]) ? Math.trunc(+row[27]) : row[27],

      //     column29: moment(row[28], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[28]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[28]) ? Math.trunc(+row[28]) : row[28],

      //     column30: moment(row[29], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[29]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[29]) ? Math.trunc(+row[29]) : row[29],

      //     column31: moment(row[30], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[30]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[30]) ? Math.trunc(+row[30]) : row[30],

      //     column32: moment(row[31], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[31]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[31]) ? Math.trunc(+row[31]) : row[31],

      //     column33: moment(row[32], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[32]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[32]) ? Math.trunc(+row[32]) : row[32],

      //     column34: moment(row[33], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[33]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[33]) ? Math.trunc(+row[33]) : row[33],

      //     column35: moment(row[34], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[34]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[34]) ? Math.trunc(+row[34]) : row[34],

      //     column36: moment(row[35], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[35]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[35]) ? Math.trunc(+row[35]) : row[35],

      //     column37: moment(row[36], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[36]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[36]) ? Math.trunc(+row[36]) : row[36],

      //     column38: moment(row[37], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[37]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[37]) ? Math.trunc(+row[37]) : row[37],

      //     column39: moment(row[38], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[38]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[38]) ? Math.trunc(+row[38]) : row[38],

      //     column40: moment(row[39], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[39]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[39]) ? Math.trunc(+row[39]) : row[39],

      //     column41: moment(row[40], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[40]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[40]) ? Math.trunc(+row[40]) : row[40],

      //     column42: moment(row[41], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[41]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[41]) ? Math.trunc(+row[41]) : row[41],

      //     column43: moment(row[42], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[42]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[42]) ? Math.trunc(+row[42]) : row[42],

      //     column44: moment(row[43], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[43]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[43]) ? Math.trunc(+row[43]) : row[43],

      //     column45: moment(row[44], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[44]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[44]) ? Math.trunc(+row[44]) : row[44],

      //     column46: moment(row[45], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[45]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[45]) ? Math.trunc(+row[45]) : row[45],

      //     column47: moment(row[46], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[46]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[46]) ? Math.trunc(+row[46]) : row[46],

      //     column48: moment(row[47], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[47]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[47]) ? Math.trunc(+row[47]) : row[47],

      //     column49: moment(row[48], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[48]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[48]) ? Math.trunc(+row[48]) : row[48],

      //     column50: moment(row[49], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ?
      //       moment(row[49]).utcOffset(9).format('YYYY-MM-DD') :
      //       this.isDecimal(row[49]) ? Math.trunc(+row[49]) : row[49],
      //     fileUploadId: resFileUpload.id
      //   };
      // })

      await this.tempDataRepository.save(temp);
      await queryRunner.commitTransaction();
      console.log("******6. Check template availability for Customer******");

      if(rows.updatedArrayData[0].includes('column1')) {
        result = await this.validateTemplate(resFileUpload.id);
      } else {
        result = await this.validateTemplateWithHeader(resFileUpload.id);
      }      
      //** Data validation function */

      if (result.statusCode == 200) {
        // await this.tradeTapeApproval(resFileUpload.id);
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.TempExperienceModule.BulkUpload.BulkTempExperience}`,
          data: resFileUpload
        };
      } else {
        return result;
      }
    }
    catch (err) {
      // since we have errors let's rollback changes we made
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // release query runner which is manually created
      await queryRunner.release();
    }
  }


  async uploadExcel(file: Express.Multer.File, req: any): Promise<any> {
    /**
     * 1. Validate file extension
     * 2. Save file in S3
     * 3. Read sheet from s3 url
     * 4. Save in file upload table
     * 5. Save sheet data in tempData table
     * 6. Check template availability for Customer
     *    6.a. if template not available -> RESPONSE
     *    6.b. if template available, get header column name from tempData based on HEADERROW No, match it with Fieldmapping
     *        6.b.b1. if matched, import data from tempData to tempExperience -> RESPONSE success
     *        6.b.b2. if not matched -> RESPONSE
     */
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const customer =
        await this.customerRepository.findOne({
          where: { id: req.customerNo },
        });

      if (!customer) {
        throw new BadRequestException('Invalid customer');
      }

      if (req.dataSite == 0) {
        req.dataSite = +req.dataSite;
      } else if (!req.dataSite || req.dataSite == null || !Number(req.dataSite)) {
        throw new BadRequestException('Datasite should not be empty and should be integer type');
      } else if (req.dataSite > 0) {
        const datasite = await this.datasiteRepository.findOne({
          where: {
            id: req.dataSite,
            customer: req.customerNo
          },
        });
        if (!datasite) {
          throw new BadRequestException('Datasite not found');
        }
      } else if (req.dataSite < 0) {
        throw new BadRequestException('Invalid datasite');
      }

      console.log("******1. Validate file extension******");
      const extension = file.originalname.split('.').pop().toLowerCase();
      if (!this.allowedExcelExtensions.includes(extension) && !this.allowedTextExtensions.includes(extension)) {
        throw new BadRequestException('File type should be excel|text');
      }

      console.log("******2. Save file in S3******");
      const awsS3Bucket = this.configService.get('AWS_S3_BUCKET');
      const s3 = new AWS.S3({
        signatureVersion: 'v4',
        accessKeyId: this.configService.get('ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('SECRET_ACCESS_KEY'),
        region: this.configService.get('REGION'),
      });

     // const key = uuid() + '.' + extension
      //Saurabh
      const timeStamp = moment(new Date()).utc().format('MM-DD-YYYYTHH:mm:ss[Z]');
      const key = `${file.originalname.trim().split(`.${extension}`)[0]}_${timeStamp}.${extension}`;
      // const updatedkey = key.replace(/\s+/g, '_').replace(/:/g, '_');
      const updatedkey = key.replace(/\s+/g, '_').replace(/[:,&!@#$%^*()<>?{}\[\];'"|\/\\~`+=]/g, '_');
      console.log('key', updatedkey)
      const params = {
        Bucket: `${awsS3Bucket}/${req.customerNo}/${req.dataSite}`,
        Key: updatedkey,
        Body: file.buffer,
      };
      let s3Response = await s3.upload(params).promise();
      // await this.processUploadedExcel(s3Response.Location, req.customerNo, req.dataSite, file.originalname);
    }
    catch (err) {
      // since we have errors let's rollback changes we made
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // release query runner which is manually created
      await queryRunner.release();
    }
  }

  async readTemplateFromURL(url: string): Promise<any> {
    let updatedArrayData = [];
    try {
      // Make a GET request to the URL
      const response: AxiosResponse<ArrayBuffer> = await axios.get(url, {
        responseType: 'arraybuffer',
      });

      // Parse the Excel file
      const workbook = read(response.data, { type: 'array', cellDates: true, dateNF: "yyyy-mm-dd" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      // Get the data of "Sheet1"
      const options = { header: 1, defval: null, blankrows: false };
      const arrayData: any = utils.sheet_to_json(sheet, options);
      const data: any = utils.sheet_to_json(sheet);

      if(arrayData.length <= 1) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
        }
      } else {
        /**findHeaderRow : find the header row based on column name comparing with Template_Structure -> TemplateColumnName */
        const headerRow = await this.findHeaderRow(arrayData);
        const headerIndex = arrayData.indexOf(headerRow) < 0 ? 0 : arrayData.indexOf(headerRow);

        /**findSkipRows : find all the datarows based on removing empty, required , mandatory rows... aslo checking if any rows has same values as HEADERROW */
        const dataRows = await this.findSkipRows(arrayData.slice(headerIndex), headerRow);
        if(dataRows.length == 0) {
          return {
            statusCode: HttpStatus.BAD_REQUEST,
          }
        } else {
          updatedArrayData.push(headerRow, ...dataRows);
          return { length: data.length, updatedArrayData };
        }
      }
    } catch (error) {
      // Handle errors appropriately
      throw new Error(`Failed to read Excel : ${error.message}`);
    }
  }

  async readDatFileFromURL(url: string): Promise<any> {
    let updatedArrayData = [];
    try {
    // Make a GET request to the URL
    const response: AxiosResponse<ArrayBuffer> = await axios.get(url, {
      responseType: 'arraybuffer',
    });
    const buffer = Buffer.from(response.data);

    const data1 = buffer.toString('utf8'); // Convert buffer to string assuming UTF-8 encoding
    const lines = data1.replace(/,/g, '-'); // Split into lines assuming newline-separated
    const fieldWidths = [
      1,
      9,
      20,
      34,
      34,
      34,
      34,
      20,
      9,
      2,
      3,
      2,
      2,
      4,
      2,
      4,
      4,
      16,
      16,
      1,
      1,
      10,
      10,
      10,
      10,
      10,
      10,
      10,
      10,
      1,
      1,
      1,
      1,
      24,
      24,
      24,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      60,
      6
    ];
    const cleanedBuffer = Buffer.from(lines, 'utf8');
    // Parse the Excel file
    const workbook = read(cleanedBuffer, { type: 'array', cellDates: true, dateNF: "yyyy-mm-dd" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    // Get the data of "Sheet1"
    const options = { header: 1, defval: null, blankrows: false };
    const arrayData: any = utils.sheet_to_json(sheet, options);
    const flattenedData = arrayData.flat().filter(line => line !== null);

    // Parse each line based on the column widths
    const processedData = flattenedData.map(line => {
        let position = 0;
        let result = fieldWidths.map(width => {
          const field = line.slice(position, position + width).trim();
          position += width;
          return field == '' ? null : field;
      });

        // Combine and reformat the date fields
        const figureMonth = result[11];
        const figureDay = result[12];
        const figureYear = result[13];
        const figureDate = result[11] && result[12] && result[13] ? `${figureYear}-${figureMonth}-${figureDay}`: null;
        
        const lastSaleMonth = result[14];
        const lastSaleYear = result[15];
        const lastSaleDate = result[14] && result[15] ? `${lastSaleYear}-${lastSaleMonth}-${Number(0o1)}` : null;
        
        // Replace the year, month, and day fields with the formatted date
        result.splice(11, 3, figureDate);
        result.splice(12, 2, lastSaleDate);
        return result;
      });
  // }
      
  // Parse the sample data
    const data: any = utils.sheet_to_json(sheet);
    const headerRow = await this.findHeaderRowForDatFile(processedData);
    if(processedData.length <= 1) {
      return {
        statusCode: 400,
      }
    }
    else {
      const dataRows = await this.findSkipRows(processedData, headerRow);
      updatedArrayData.push(headerRow, ...dataRows);
      return { length: data.length, updatedArrayData };
    }

    } catch (error) {
      // Handle errors appropriately
      throw new Error(`Failed to read Excel : ${error.message}`);
    }
  }

  async findHeaderRowForDatFile(arrayData) {
    const templateStructure = await this.templateStructureRepository.find();
    const mergedTemplateColumnNames = Array.from(new Set(
      templateStructure.flatMap(template => {
          let columns = template.templateColumnName;
          if (typeof columns === 'string') {
              columns = JSON.parse(columns.replace(/'/g, '"'));
          }
          return columns;
      })
    ));
    let headerRows = arrayData.filter(row => row.some(keyword => mergedTemplateColumnNames.includes(keyword)));
    if(headerRows.length > 0 && !headerRows[0].some(keyword => HeaderRowKeyword.FigureDateKeyword.includes(keyword))) {
      headerRows[0].push('FigureDate');
    }
    if (headerRows.length === 1) {
      return headerRows[0];
    }
    if (headerRows.length > 1) {
      return headerRows.reduce((acc, curr) => (acc.length >= curr.length ? acc : curr));
    }
    const header = [
      'Record Type', 'Duns No', 'Customer Ref No',
      'Account Name', 'Account Name 2', 'Address 1',
      'Address 2', 'City', 'Zip Code',
      'State Code', 'Country Code', 'Figure Date',
      'Last Sale Date', 'Year Acct Opened', 'Primary Terms',
      'Secondary Terms', 'Primary Terms Open', 'Secondary Terms Open',
      'High Credit', 'Dollars Total', 'Dollars Current',
      'Dollars Dating', 'Dollars 1 to 30', 'Dollars 31 to 60',
      'Dollars 61 to 90', 'Dollars Over 90', 'Dispute 1 to 30',
      'Dispute 31 to 60', 'Dispute 61 to 90', 'Dispute Over 90',
      'Phone Number 1', 'Phone Number 2', 'Phone Number 3',
      'Comment Code 1', 'Comment Code 2', 'Comment Code 3',
      'Comment Code 4', 'Comment Code 5', 'Comment Code 6',
      'Comment Code 7', 'Comment Code 8', 'Comments',
      'Average Days Pay'
    ]
    return header;
  }

  async findHeaderRow(arrayData) {
    const templateStructure = await this.templateStructureRepository.find();
    let mergedTemplateColumnNames = [];
    try {
      mergedTemplateColumnNames = Array.from(new Set(
        templateStructure.flatMap(template => {
            let columns = template.templateColumnName;
            if (typeof columns === 'string') {
              columns = JSON.parse(columns.replace(/'/g, '"')).map(column => column.toLowerCase());
            }
            return columns;
        })
      ));
    } catch (error) {
      console.log("Error in template reading");
      
    }
    let headerRows = arrayData.filter(row =>
      row.some(keyword => {
        if(keyword !== 'TOTAL') {
          return typeof keyword === 'string' && mergedTemplateColumnNames.includes(keyword.toLowerCase()) // Ensure keyword is a string
        }
      }),
    );
    if(headerRows.length == 1 && !headerRows[0].some(keyword => HeaderRowKeyword.FigureDateKeyword.includes(keyword))) {
      headerRows[0].push('FigureDate');
    }
    if (headerRows.length === 1) {
      return headerRows[0];
    }
    // Two header rows
    let mergedHeaderRow;
    if (headerRows.length >= 2) {
      // Remove "USD" from the second row
      headerRows[1] = headerRows[1].map(keyword => keyword === ExtraFields.USD || keyword == ExtraFields.ESSENTIAL || keyword == ExtraFields.MANDATORY || keyword == ExtraFields.REQUIRED ? '' : keyword);
      // Merge the two rows
      mergedHeaderRow = headerRows[0].map((item, index) => {
          return item !== null && item !== '' ? item.trim() : headerRows[1][index].trim();
      });
      if(!mergedHeaderRow.some(keyword => HeaderRowKeyword.FigureDateKeyword.includes(keyword))) {
        mergedHeaderRow.push('FigureDate');
      }
      // Return the merged row
      return mergedHeaderRow;
    }
    if (headerRows.length > 1) {
      return headerRows.reduce((acc, curr) => (acc.length >= curr.length ? acc : curr));
    }
    // let secondaryFilteredRows = headerRows.filter(row => row.some(keyword => HeaderRowKeyword.SecondaryKeyword.includes(keyword)));
    // if (secondaryFilteredRows.length === 1) {
    //   return secondaryFilteredRows[0];
    // }
    // if (secondaryFilteredRows.length > 1) {
    //   return secondaryFilteredRows.reduce((acc, curr) => (acc.length >= curr.length ? acc : curr));
    // }
    const header = [
      'column1', 'column2', 'column3',
      'column4', 'column5', 'column6',
      'column7', 'column8', 'column9',
      'column10', 'column11', 'column12',
      'column13', 'column14', 'column15',
      'column16', 'column17', 'column18',
      'column19', 'column20', 'column21',
      'column22', 'column23', 'column24',
      'column25', 'column27', 'column28',
      'column29', 'column30', 'column31',
      'column32', 'column33', 'column34',
      'column35', 'column36', 'column37',
      'column38', 'column39', 'column40',
      'column41', 'column42', 'column43',
      'column44', 'column45', 'column46',
      'column47', 'column48', 'column49',
      'column50'
    ]
    return header;
  }

  async findSkipRows(arrayData: any, headerRow: any) {
    const dataRows = arrayData.filter(x => {
      let shouldExclude = x.filter(y =>
        y === ExtraFields.REQUIRED ||
        y === ExtraFields.ESSENTIAL ||
        y === ExtraFields.MANDATORY ||
        y === ExtraFields.USD
      ).length > 1;

      let isHeaderRow = JSON.stringify(x) === JSON.stringify(headerRow);
      let skipRows = x.some(y => headerRow.includes(y) && !headerRow.includes(null));
      return !shouldExclude && !isHeaderRow && !skipRows;
    })
    return dataRows;
  }

  async validateTemplate(fileUploadId: number, customerTemplateId?: number) {
    let templateHeaderRow;
    let result;
    let validate = false;
    let isEmailSend = false;
    const file = await this.fileUploadRepository.findOne({
      where: { id: fileUploadId }
    })
    if (!file) {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.FileUploadModule.NotFound}`,
      }
    }
    const query = await this.customerTemplateRepository.createQueryBuilder('customerTemplate')
      .where({ customerId: String(file.customerNo) });
    if (customerTemplateId) {
      query.andWhere('customerTemplate.id = :customerTemplateId', { customerTemplateId: customerTemplateId })
    }
    const customerTemplateData = await query.getMany();

    if (customerTemplateData.length == 0) {
      await this.fileUploadRepository.update(fileUploadId, { status: FileUploadStatus.NOTEMPLATE });
      console.log("******6.a. if template not available -> RESPONSE******");
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `Configuration not added for the customer`,
        data: {
          fileUploadId: fileUploadId,
          //templateData: temp5Data
        }
      }
    }

    const tempData = await this.tempDataRepository.find({
      where: { fileUploadId: fileUploadId }
    });


    // let temp5Data = await this.tempDataRepository.find({
    //   where: {
    //     fileUploadId: fileUploadId,
    //   },
    //   take: 5,
    // });

    let validationResults;
    if (customerTemplateData.length > 0) {
      try {
        for (let customerTemplate of customerTemplateData) {
          let newCustomerTemplate = JSON.parse(
            JSON.stringify(customerTemplate),
          );
          let newCustomerTemplateData = JSON.parse(
            JSON.stringify(customerTemplate),
          );

          let updatedTempData1 = JSON.parse(
            JSON.stringify(tempData),
          );
          let updatedTempData = updatedTempData1.sort((a, b) => a.id - b.id);

          //skip-columns
          // const skipColumn = customerTemplate.skipColumns?.split(',').map(x => +x);
          // if (skipColumn[0] > 0) {
          //   for (let x of skipColumn) {
          //     let temp: any;
          //     for (temp of updatedTempData) {
          //       delete temp.id;
          //       temp[(Object.keys(temp))[x - 1]] = 'eloped'
          //       temp = updatedTempData
          //     }
          //   }
          // }

          // updatedTempData.forEach((obj) => {
          //   Object.keys(obj).forEach((x: any) => {
          //     if (obj[x] == 'eloped') {
          //       delete obj[x];
          //     }
          //   })
          // });
          
          //1. getting header row
          templateHeaderRow = updatedTempData[0];
          
          // skip-rows
          // const skipRow = customerTemplate.skipRows?.split(',').map((x) => +x);
          // if (skipRow[0] > 0) {
          //   for (let x of skipRow) {
          //     if (customerTemplate.headerRows === x) {
          //       throw new BadRequestException('Header rows should not be equal to skip rows')
          //     }

          //     delete updatedTempData[x - 1].id;
          //     delete updatedTempData[x - 1].fileUploadId;
          //     delete updatedTempData[x - 1].createdDate;
          //     delete updatedTempData[x - 1].updatedDate;
          //     let columns = Object.values(updatedTempData[x - 1])
          //     if (updatedTempData[x - 1]) {
          //       let filteredColumns = columns.filter((col) => { return (col !== ExtraFields.REQUIRED && col !== ExtraFields.ESSENTIAL && col !== ExtraFields.MANDATORY && col !== ExtraFields.USD && col !== null) })
          //       if (filteredColumns.length > 5) {
          //         await this.fileUploadRepository.update(fileUploadId, { status: FileUploadStatus.TEMPLATEMISMATCH, statusReason: 'Invalid Skip Row number' });
          //         // return {
          //         //   statusCode: HttpStatus.NO_CONTENT,
          //         //   message: `${Messages.TempDataModule.TemplateSettingNotMatched}`,
          //         // };
          //       } else {
          //         for (let temp in updatedTempData[x - 1]) {
          //           updatedTempData[x - 1][temp] = 'eloped';
          //         }
          //       }
          //     }
          //   }
          // }
          let newTempData = updatedTempData.slice(
            1,
          );
          // const templateDataRow = newTempData.filter((x) => x.column1 !== 'eloped');


          //2. replacing header row value as 'eloped' for not needed columns
          Object.keys(templateHeaderRow).forEach((key) => {
            if (
              templateHeaderRow[key] === null ||
              key == 'id' ||
              key == 'fileUploadId' ||
              key == 'createdDate' ||
              key == 'updatedDate' ||
              templateHeaderRow[key].startsWith('Column')
            ) {
              templateHeaderRow[key] = 'eloped';
            }
          });
          const templateColumn = Object.values(templateHeaderRow).map(
            (value) => {
              if (value !== 'eloped') {
                return value.toString().trim();
              }
            }
          ).filter((value) => value !== undefined);
          if (
            customerTemplate?.customerRefNo ||
            customerTemplate?.accountName1 ||
            customerTemplate?.accountName2 ||
            customerTemplate?.address1 ||
            customerTemplate?.address2 ||
            customerTemplate?.city ||
            customerTemplate?.zipCode ||
            customerTemplate?.stateCode ||
            customerTemplate?.countryCode ||
            customerTemplate?.phone ||
            customerTemplate?.figureDate ||
            customerTemplate?.lastSaleDate ||
            customerTemplate?.yearAccountOpened ||
            customerTemplate?.term1 ||
            customerTemplate?.term2 ||
            customerTemplate?.open_term1 ||
            customerTemplate?.open_term2 ||
            customerTemplate?.highCredit ||
            customerTemplate?.totalOwing ||
            customerTemplate?.current ||
            customerTemplate?.dating ||
            customerTemplate?.aging1_30 ||
            customerTemplate?.aging31_60 ||
            customerTemplate?.aging61_90 ||
            customerTemplate?.agingOver90 ||
            customerTemplate?.dispute1_30 ||
            customerTemplate?.dispute31_60 ||
            customerTemplate?.dispute61_90 ||
            customerTemplate?.disputeOver90 ||
            customerTemplate?.averageDays ||
            customerTemplate?.mannerOfPayment ||
            customerTemplate?.contact ||
            customerTemplate?.contactJobTitle ||
            customerTemplate?.contactTelephone ||
            customerTemplate?.contactEmail ||
            customerTemplate?.commentCode ||
            customerTemplate?.comments ||
            customerTemplate?.currencies
          ) {

            const templateColumnName = [customerTemplate]?.map((temp: any) => {
              delete temp.id;
              delete temp.customerId;
              delete temp.datasite;
              delete temp.name;
              // delete temp.headerRows;
              // delete temp.skipRows;
              // delete temp.skipColumns;
              delete temp.createdDate;
              delete temp.updatedDate;
              return Object.values(temp)?.map((values: any) => {
                return values?.split('+').map(part => part.trim());
              }).flat();
            }).flat();
            let templateColumnNameMapped = templateColumnName.flatMap((x) => String(x).trim()).filter((x) => String(x) !== 'undefined');
            // console.log('templateColumnNameMapped', templateColumnNameMapped)
            // console.log('templateColumn', templateColumn)
            if (this.areArraysIdentical(templateColumnNameMapped, templateColumn)) {
              console.log(
                '******6.b.b1. if matched, import data from tempData to tempExperience -> RESPONSE success******',
              );
              validationResults = this.validateDataType(customerTemplate, tempData);
              // console.log('newTempData', newTempData);
              console.log('hello there2===>', validationResults)
              if (Object.keys(validationResults).length > 0) {
                validate = false;
                break;
              }
              // let templateDataRow = newTempData.slice(
              //   Number(newCustomerTemplateData.headerRows),
              // );
              
              const tempExperienceData = this.replaceKeysInArray(
                newTempData,
                templateHeaderRow,
              );

              tempExperienceData.forEach((obj) => {
                delete obj['eloped'];
              });

              const transformedObject: { [key: string]: string } = {};

              [newCustomerTemplateData].forEach((temped) => {
                delete temped.id;
                delete temped.customerId;
                delete temped.datasite;
                delete temped.name;
                // delete temped.headerRows;
                // delete temped.skipRows;
                // delete temped.skipColumns;
                delete temped.createdDate;
                delete temped.updatedDate;
                for (let [key, value] of Object.entries(temped)) {
                  if (value !== null) {
                    transformedObject[value as string] = key;
                  }
                }
              });
              const newTransformObject = {};
              Object.keys(transformedObject).forEach(key => {
                if (key.includes('+')) {
                  const subKeys = key.split('+');
                  subKeys.forEach(subKey => {
                    let keys = subKey.trim();
                    newTransformObject[keys] = transformedObject[key];
                  });
                } else {
                  newTransformObject[key] = transformedObject[key];
                }
              });
              const tempExperienceData1 = this.replaceKeysInArray2(
                tempExperienceData,
                newTransformObject,
              );
              const remainingColumns = {
                customerNo: file.customerNo,
                datasite: file.datasite,
                fileUploadId: fileUploadId,
                status: TempExperienceStatus.PENDING,
              };

              tempExperienceData1.forEach((obj) => {
                const history = {
                  customerRefNo_history: obj.customerRefNo,
                  accountName1_history: obj.accountName1,
                  accountName2_history: obj.accountName2,
                  address1_history: obj.address1,
                  address2_history: obj.address2,
                  city_history: obj.city,
                  zipCode_history: obj.zipCode,
                  stateCode_history: obj.stateCode,
                  countryCode_history: obj.countryCode,
                  phone_history: obj.phone,
                  figureDate_history: obj.figureDate,
                  lastSaleDate_history: obj.lastSaleDate,
                  yearAccountOpened_history: obj.yearAccountOpened,
                  term1_history: obj.term1,
                  term2_history: obj.term2,
                  open_term1_history: obj.open_term1,
                  open_term2_history: obj.open_term2,
                  highCredit_history: obj.highCredit,
                  totalOwing_history: obj?.totalOwing,
                  current_history: obj.current,
                  dating_history: obj.dating,
                  aging1_30_history: obj.aging1_30,
                  aging31_60_history: obj.aging31_60,
                  aging61_90_history: obj.aging61_90,
                  agingOver90_history: obj.agingOver90,
                  dispute1_30_history: obj.dispute1_30,
                  dispute31_60_history: obj.dispute31_60,
                  dispute61_90_history: obj.dispute61_90,
                  disputeOver90_history: obj.disputeOver90,
                  averageDays_history: obj.averageDays,
                  mannerOfPayment_history: obj.mannerOfPayment,
                  contact_history: obj.contact,
                  contactJobTitle_history: obj.contactJobTitle,
                  contactTelephone_history: obj.contactTelephone,
                  contactEmail_history: obj.contactEmail,
                  commentCode_history: obj.commentCode,
                  comments_history: obj.comments,
                };
                let accountName1 = obj.accountName1 == null ? obj.accountName1 = '' : obj.accountName1;
                let accountName2 = obj.accountName2 == null ? obj.accountName2 = '' : obj.accountName2;
                let address1 = obj.address1 == null ? obj.address1 = '' : obj.address1;
                let address2 = obj.address2 == null ? obj.address2 = '' : obj.address2;
                obj.accountName1 !== obj.accountName2 ? ((obj.accountName1 = accountName1 + ' ' + accountName2) && (obj.accountName2 = null)) : obj.accountName1;
                obj.accountName1 == obj.accountName2 ? obj.accountName2 = null : obj.accountName2;
                obj.address1 !== obj.address2 ? ((obj.address1 = address1 + ' ' + address2) && (obj.address2 = null)) : obj.address1;
                obj.address1 == obj.address2 ? obj.address2 = null : obj.address2;
                Object.assign(obj, remainingColumns, history);
              });

              const updatedTempExperienceData = [...tempExperienceData1.reduce((res, obj) => {
                res.has(obj.customerRefNo) || res.set(obj.customerRefNo, Object.assign({}, obj,
                  { highCredit: 0, totalOwing: 0, current: 0, dating: 0, aging1_30: 0, aging31_60: 0, aging61_90: 0, agingOver90: 0 }));
                const item = res.get(obj.customerRefNo);

                item.highCredit += +obj.highCredit || 0;
                item.totalOwing += +obj.totalOwing || 0;
                item.current += +obj.current || 0;
                item.dating += +obj.dating || 0;
                item.aging1_30 += +obj.aging1_30 || 0;
                item.aging31_60 += +obj.aging31_60 || 0;
                item.aging61_90 += +obj.aging61_90 || 0;
                item.agingOver90 += +obj.agingOver90 || 0;

                return res;
              }, new Map()).values()];


              if (file.status !== FileUploadStatus.APPROVED) {
                result = await this.tempExperienceRepository.save(
                  updatedTempExperienceData,
                  { chunk: 55 },
                );

                const date = moment(new Date()).format('DD-MMM-YY');
                const currencyRateData = await this.currencyRateRepository.createQueryBuilder('A')
                  .innerJoin(
                    (subQuery) => {
                      return subQuery
                        .from(CurrencyRate, 'currencyRate')
                        .select(['currencyRate.currency AS currency', 'MAX(currencyRate.wefDate) AS wefDate'])
                        .where('currencyRate.wefDate <= :date', { date: date })
                        .groupBy('currencyRate.currency');
                    },
                    'B',
                    'A.currency = B.currency AND A.wefDate = B.wefDate'
                  )
                  .select('A.wefDate', 'wefDate')
                  .addSelect('A.currency', 'currency')
                  .addSelect('A.dollar', 'dollar')
                  .execute();
                if (currencyRateData.length > 0) {
                  for (let rate of currencyRateData) {
                    const queryBuilder = this.tempExperienceRepository.createQueryBuilder()
                      .update(TempExperience)
                      .set({
                        aging1_30: () => `aging1_30 * (CASE 
                                WHEN currencies = 'CAD' THEN '${rate.dollar}'
                                WHEN currencies = 'GBP' THEN '${rate.dollar}'
                                WHEN currencies = 'EUR' THEN '${rate.dollar}'
                                ELSE TO_CHAR(aging1_30)
                              END)`,
                        aging31_60: () => `aging31_60 * (CASE 
                                WHEN currencies = 'CAD' THEN '${rate.dollar}'
                                WHEN currencies = 'GBP' THEN '${rate.dollar}'
                                WHEN currencies = 'EUR' THEN '${rate.dollar}'
                                ELSE TO_CHAR(aging31_60)
                              END)`,
                        aging61_90: () => `aging61_90 * (CASE 
                                WHEN currencies = 'CAD' THEN '${rate.dollar}'
                                WHEN currencies = 'GBP' THEN '${rate.dollar}'
                                WHEN currencies = 'EUR' THEN '${rate.dollar}'
                                ELSE TO_CHAR(aging61_90)
                              END)`,
                        agingOver90: () => `agingOver90 * (CASE 
                                WHEN currencies = 'CAD' THEN '${rate.dollar}'
                                WHEN currencies = 'GBP' THEN '${rate.dollar}'
                                WHEN currencies = 'EUR' THEN '${rate.dollar}'
                                ELSE TO_CHAR(agingOver90)
                              END)`,
                        highCredit: () => `highCredit * (CASE 
                                WHEN currencies = 'CAD' THEN '${rate.dollar}'
                                WHEN currencies = 'GBP' THEN '${rate.dollar}'
                                WHEN currencies = 'EUR' THEN '${rate.dollar}'
                                ELSE TO_CHAR(highCredit)
                              END)`,
                        totalOwing: () => `totalOwing * (CASE 
                                WHEN currencies = 'CAD' THEN '${rate.dollar}'
                                WHEN currencies = 'GBP' THEN '${rate.dollar}'
                                WHEN currencies = 'EUR' THEN '${rate.dollar}'
                                ELSE TO_CHAR(totalOwing)
                              END)`,
                        current: () => `current * (CASE 
                                WHEN currencies = 'CAD' THEN '${rate.dollar}'
                                WHEN currencies = 'GBP' THEN '${rate.dollar}'
                                WHEN currencies = 'EUR' THEN '${rate.dollar}'
                                ELSE TO_CHAR(current)
                              END)`,
                        dating: () => `dating * (CASE 
                                WHEN currencies = 'CAD' THEN '${rate.dollar}'
                                WHEN currencies = 'GBP' THEN '${rate.dollar}'
                                WHEN currencies = 'EUR' THEN '${rate.dollar}'
                                ELSE TO_CHAR(dating)
                              END)`,
                      })
                      .where({ fileUploadId: fileUploadId })
                      .andWhere({ currencies: rate.currency })
                    const res = await queryBuilder.execute();
                  }
                }

                const updatedResultData = await this.tempExperienceRepository.find({
                  where: { fileUploadId: fileUploadId }
                })
                //correction
                for (let res of updatedResultData) {
                  let countryQuery = this.countryRepository.createQueryBuilder('country')
                  .select('country.two_char_code');

                  if (isNaN(Number(res.countryCode))) {
                    // If `res.countryCode` is a string, check with `code`, `name`, and `two_char_code`
                    countryQuery = countryQuery
                      .where('country.code = :countryCode', { countryCode: res.countryCode })
                      .orWhere('country.name = :countryName', { countryName: res.countryCode })
                      .orWhere('country.two_char_code = :twoCharCode', { twoCharCode: res.countryCode });
                  } else {
                    // If `res.countryCode` is a number, check with `id`
                    countryQuery = countryQuery
                      .where('country.id = :countryId', { countryId: res.countryCode });
                  }
                  const country = await countryQuery.getOne();

                  const data = {
                    accountName1: res.accountName1?.trimStart(),
                    accountName2: res.accountName2?.trimStart(),
                    address1: res.address1?.trimStart(),
                    address2: res.address2?.trimStart(),
                    countryCode: res.countryCode !== null && country !== null ? country.two_char_code : res.countryCode == null ? 'US' : res.countryCode,
                    highCredit: Math.trunc(+res.highCredit).toFixed(0),
                    totalOwing: res.totalOwing == '0' ? res.totalOwing = Math.trunc(Number(res?.current) + Number(res?.aging1_30) +
                      Number(res?.aging31_60) + Number(res?.aging61_90) + Number(res?.agingOver90)).toFixed(0) : Math.trunc(+res.totalOwing).toFixed(0),
                    current: Math.trunc(+res.current).toFixed(0),
                    dating: Math.trunc(+res.dating).toFixed(0),
                    aging1_30: Math.trunc(+res.aging1_30).toFixed(0),
                    aging31_60: Math.trunc(+res.aging31_60).toFixed(0),
                    aging61_90: Math.trunc(+res.aging61_90).toFixed(0),
                    agingOver90: Math.trunc(+res.agingOver90).toFixed(0),
                    zipCode: String(res.zipCode).length == 4 && res.zipCode !== null ? "0" + res.zipCode : res.zipCode,
                    figureDate: res.figureDate == null ? moment(new Date()).format('YYYY-MM-DD') : res.figureDate
                  };
                  if (res.figureDate !== null) {
                    await this.tempExperienceRepository.createQueryBuilder()
                      .update(TempExperience)
                      .set({ figureDate: res.figureDate })
                      .where({ figureDate: IsNull() })
                      .execute();
                  }

                  await this.tempExperienceRepository.update(res.id, data);
                };

                await this.fileUploadRepository
                  .createQueryBuilder()
                  .update(FileUpload)
                  .set({ status: FileUploadStatus.APPROVED, customerTemplateId: newCustomerTemplate.id, statusReason: null, processStatus : ProcessStatus.INPROGRESS})
                  .where({ id: fileUploadId })
                  .execute();

                const customer = await this.customerRepository.findOne({
                  where: { id: file.customerNo }
                });
                const date2 = new Date();
                if (customer.rcTrackerEnabled == 0 || customer.rcTrackerEnabled == null) {
                  await this.tempExperienceRepository.createQueryBuilder()
                    .update(TempExperience)
                    .set({ status: TempExperienceStatus.INACTIVE })
                    .where({ fileUploadId: fileUploadId })
                    .andWhere({ totalOwing: Number(0.00) })
                    .andWhere(`lastSaleDate IS NULL OR lastSaleDate <= '${moment(date2).subtract(1, 'years').format('YYYY-MM-DD')}'`)
                    .execute();
                }
              }
              await this.tempExperienceRepository.find({
                where: { fileUploadId: fileUploadId }
              })
              isEmailSend = true;
              this.validationCheckedEmptyRowsAndDataType(isEmailSend, fileUploadId);
              // this.autoMapping(updatedResult);

              validate = true;
              if (validate == true) {
                break;
              };
            }
          }
        }
      } catch (err) {
        await this.fileUploadRepository.update(fileUploadId, { status: FileUploadStatus.TEMPLATEMISMATCH, statusReason: 'Unknown reason.' });
        return {
          statusCode: HttpStatus.NO_CONTENT,
          message: `${Messages.TempDataModule.TemplateSettingNotMatched}`,
        };
      }
      if (!validate) {
        console.log('******6.b.b2. if not matched -> RESPONSE******');
        await this.fileUploadRepository.update(fileUploadId, { status: FileUploadStatus.TEMPLATEMISMATCH, statusReason: `${JSON.stringify(validationResults)}` });
        return {
          statusCode: HttpStatus.NO_CONTENT,
          message: `${Messages.TempDataModule.TemplateSettingNotMatched}`,
        };
      }
      else {
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.TempDataModule.TemplateSettingMatched}`
        }
      }
    }
  }

  async validateTemplateWithHeader(fileUploadId: number) {
    let templateHeaderRow;
    let validate = false;
    let isEmailSend = false;

    console.log("validateTemplateWithHeader method");

    const file = await this.fileUploadRepository.findOne({
      where: { id: fileUploadId }
    })
    if (!file) {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.FileUploadModule.NotFound}`,
      }
    }

    console.log("step 1");

    const templateStructure = await this.templateStructureRepository.find({order: {id: 'ASC'}});

    const tempData = await this.tempDataRepository.find({
      where: { fileUploadId: fileUploadId }
    });

    console.log("step 2");

    // try {
      let updatedTempData1 = JSON.parse(
        JSON.stringify(tempData),
      );
      let updatedTempData = updatedTempData1.sort((a, b) => a.id - b.id);

      //1. getting header row
      templateHeaderRow = updatedTempData[0];
      const tableColumnNames = {};
      let headerValue;
      let newTempData = updatedTempData.slice(1);

      console.log("step 3");
      
      const unmatchedColumns = [];
      Object.keys(templateHeaderRow).forEach((key) => {
        if (
          templateHeaderRow[key] === null ||
          key == 'id' ||
          key == 'fileUploadId' ||
          key == 'createdDate' ||
          key == 'updatedDate' ||
          templateHeaderRow[key].startsWith('Column')
        ) {
          templateHeaderRow[key] = 'eloped';
        } else {
          headerValue = templateHeaderRow[key].trim();
          let checkHeaderLowerCase = templateHeaderRow[key].toLowerCase().trim();
          let matched = false;
          for (let config of templateStructure) {
            if(config.templateColumnName) {
              const jsonString = config.templateColumnName.replace(/'/g, '"');
              const array = JSON.parse(jsonString).map(item => item.toLowerCase());
              if (array.includes(checkHeaderLowerCase)) {  
                tableColumnNames[headerValue] = config.tableColumnName;
                matched = true;
                break;
              }
            }
          } 
          if (!matched) {
            unmatchedColumns.push(headerValue);
          }
        }
      });

      console.log("step 4");

      // checked multiple allow columns
      const assignedTableColumnNames = {};
      const processTemplateStructure = (templateStructure) => {
        for (const config of templateStructure) {      
          if (!config.isMultipleAllow && config.templateColumnName && config.tableColumnName !== 'ignore') {
            const jsonString = config.templateColumnName.replace(/'/g, '"');
            const array = JSON.parse(jsonString);     
            for (const columnName of array) {     
              if (tableColumnNames[columnName]) {
                if (assignedTableColumnNames[config.tableColumnName]) {
                  return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: `${config.tableColumnName} cannot be assigned multiple times.`
                  };
                }
                assignedTableColumnNames[config.tableColumnName] = true;
              }
            }
          }
        }
      };
      const response = processTemplateStructure(templateStructure);

      console.log("step 5");
      
      if (response) {
        return response;
      }

      console.log("step 6");

      //get unmatched columns
      if (unmatchedColumns.length > 0) {
        await this.fileUploadRepository.update(fileUploadId, {unmatchedColumns: JSON.stringify(unmatchedColumns), status: FileUploadStatus.UNMATCHED_COLUMNS, statusReason: 'Unmatched Columns'});
        return {
          statusCode: HttpStatus.NO_CONTENT,
          message: `${Messages.TempDataModule.UnmatchedColumns}`,
        };
      }

      console.log(
        '******6.b.b1. if matched, validate first data rows datatype as per Template Structure******',
      );
      Object.keys(tableColumnNames).forEach((key) => {
        if(tableColumnNames[key] == 'ignore') {
          delete tableColumnNames[key];
        }
      })
      const validationResults = this.validateDataType(tableColumnNames, tempData); 
      console.log('hello there2===>', validationResults)
      if (Object.keys(validationResults).length > 0) {
        validate = false;
        // break;
      }

      console.log(
        '******6.b.b2. if matched, import data from tempData to tempExperience -> RESPONSE success******',
      );
      const tempExperienceData = this.replaceKeysInArray(
        newTempData,
        templateHeaderRow,
      );
      tempExperienceData.forEach((obj) => {
        delete obj['eloped'];
      });

      /**handing multiple aging+ columns */
      const newTransformObject: { [key: string]: string } = {};
      Object.keys(tableColumnNames).forEach(key => {
        if (key.includes('+')) {
          const subKeys = key.split('+');
          subKeys.forEach(subKey => {
            let keys = subKey.trim();
            newTransformObject[keys] = tableColumnNames[key];
          });
        } else {
          newTransformObject[key] = tableColumnNames[key];
        }
      });
      const tempExperienceData1 = this.replaceKeysInArray2(
        tempExperienceData,
        newTransformObject,
      );
      /**handing multiple aging+ columns END*/


      const remainingColumns = {
        customerNo: file.customerNo,
        datasite: file.datasite,
        fileUploadId: fileUploadId,
        status: TempExperienceStatus.PENDING,
      };

      tempExperienceData1.forEach((obj) => {
        const history = {
          customerRefNo_history: obj.customerRefNo,
          accountName1_history: obj.accountName1,
          accountName2_history: obj.accountName2,
          address1_history: obj.address1,
          address2_history: obj.address2,
          city_history: obj.city,
          zipCode_history: obj.zipCode,
          stateCode_history: obj.stateCode,
          countryCode_history: obj.countryCode,
          phone_history: obj.phone,
          figureDate_history: obj.figureDate,
          lastSaleDate_history: obj.lastSaleDate,
          yearAccountOpened_history: obj.yearAccountOpened,
          term1_history: obj.term1,
          term2_history: obj.term2,
          open_term1_history: obj.open_term1,
          open_term2_history: obj.open_term2,
          highCredit_history: obj.highCredit,
          totalOwing_history: obj?.totalOwing,
          current_history: obj.current,
          dating_history: obj.dating,
          aging1_30_history: obj.aging1_30,
          aging31_60_history: obj.aging31_60,
          aging61_90_history: obj.aging61_90,
          agingOver90_history: obj.agingOver90,
          dispute1_30_history: obj.dispute1_30,
          dispute31_60_history: obj.dispute31_60,
          dispute61_90_history: obj.dispute61_90,
          disputeOver90_history: obj.disputeOver90,
          averageDays_history: obj.averageDays,
          mannerOfPayment_history: obj.mannerOfPayment,
          contact_history: obj.contact,
          contactJobTitle_history: obj.contactJobTitle,
          contactTelephone_history: obj.contactTelephone,
          contactEmail_history: obj.contactEmail,
          commentCode_history: obj.commentCode,
          comments_history: obj.comments,
        };
        let accountName1 = obj.accountName1 == null ? obj.accountName1 = '' : obj.accountName1;
        let accountName2 = obj.accountName2 == null ? obj.accountName2 = '' : obj.accountName2;
        let address1 = obj.address1 == null ? obj.address1 = '' : obj.address1;
        let address2 = obj.address2 == null ? obj.address2 = '' : obj.address2;
        obj.accountName1 !== obj.accountName2 ? ((obj.accountName1 = accountName1 + ' ' + accountName2) && (obj.accountName2 = null)) : obj.accountName1;
        obj.accountName1 == obj.accountName2 ? obj.accountName2 = null : obj.accountName2;
        obj.address1 !== obj.address2 ? ((obj.address1 = address1 + ' ' + address2) && (obj.address2 = null)) : obj.address1;
        obj.address1 == obj.address2 ? obj.address2 = null : obj.address2;

        Object.assign(obj, remainingColumns, history);
      });

      /**handling sum of various rows having same customerrefno */
      const updatedTempExperienceData = [...tempExperienceData1.reduce((res, obj) => {
        res.has(obj.customerRefNo) || res.set(obj.customerRefNo, Object.assign({}, obj,
          { highCredit: 0, totalOwing: 0, current: 0, dating: 0, aging1_30: 0, aging31_60: 0, aging61_90: 0, agingOver90: 0 }));
        const item = res.get(obj.customerRefNo);

        item.highCredit += +obj.highCredit || 0;
        item.totalOwing += +obj.totalOwing || 0;
        item.current += +obj.current || 0;
        item.dating += +obj.dating || 0;
        item.aging1_30 += +obj.aging1_30 || 0;
        item.aging31_60 += +obj.aging31_60 || 0;
        item.aging61_90 += +obj.aging61_90 || 0;
        item.agingOver90 += +obj.agingOver90 || 0;

        return res;
      }, new Map()).values()];
      /**handling sum of various rows having same customerrefno END*/

      if (file.status !== FileUploadStatus.APPROVED) {
        await this.tempExperienceRepository.save(
          updatedTempExperienceData,
          { chunk: 55 },
        );

        /**handling currency conversion as per giving currency code */
        const date = moment(new Date()).format('DD-MMM-YY');
        const currencyRateData = await this.currencyRateRepository.createQueryBuilder('A')
          .innerJoin(
            (subQuery) => {
              return subQuery
                .from(CurrencyRate, 'currencyRate')
                .select(['currencyRate.currency AS currency', 'MAX(currencyRate.wefDate) AS wefDate'])
                .where('currencyRate.wefDate <= :date', { date: date })
                .groupBy('currencyRate.currency');
            },
            'B',
            'A.currency = B.currency AND A.wefDate = B.wefDate'
          )
          .select('A.wefDate', 'wefDate')
          .addSelect('A.currency', 'currency')
          .addSelect('A.dollar', 'dollar')
          .execute();
        if (currencyRateData.length > 0) {
          for (let rate of currencyRateData) {
            const queryBuilder = this.tempExperienceRepository.createQueryBuilder()
              .update(TempExperience)
              .set({
                aging1_30: () => `aging1_30 * (CASE 
                                WHEN currencies = 'CAD' THEN '${rate.dollar}'
                                WHEN currencies = 'GBP' THEN '${rate.dollar}'
                                WHEN currencies = 'EUR' THEN '${rate.dollar}'
                                ELSE TO_CHAR(aging1_30)
                              END)`,
                aging31_60: () => `aging31_60 * (CASE 
                                WHEN currencies = 'CAD' THEN '${rate.dollar}'
                                WHEN currencies = 'GBP' THEN '${rate.dollar}'
                                WHEN currencies = 'EUR' THEN '${rate.dollar}'
                                ELSE TO_CHAR(aging31_60)
                              END)`,
                aging61_90: () => `aging61_90 * (CASE 
                                WHEN currencies = 'CAD' THEN '${rate.dollar}'
                                WHEN currencies = 'GBP' THEN '${rate.dollar}'
                                WHEN currencies = 'EUR' THEN '${rate.dollar}'
                                ELSE TO_CHAR(aging61_90)
                              END)`,
                agingOver90: () => `agingOver90 * (CASE 
                                WHEN currencies = 'CAD' THEN '${rate.dollar}'
                                WHEN currencies = 'GBP' THEN '${rate.dollar}'
                                WHEN currencies = 'EUR' THEN '${rate.dollar}'
                                ELSE TO_CHAR(agingOver90)
                              END)`,
                highCredit: () => `highCredit * (CASE 
                                WHEN currencies = 'CAD' THEN '${rate.dollar}'
                                WHEN currencies = 'GBP' THEN '${rate.dollar}'
                                WHEN currencies = 'EUR' THEN '${rate.dollar}'
                                ELSE TO_CHAR(highCredit)
                              END)`,
                totalOwing: () => `totalOwing * (CASE 
                                WHEN currencies = 'CAD' THEN '${rate.dollar}'
                                WHEN currencies = 'GBP' THEN '${rate.dollar}'
                                WHEN currencies = 'EUR' THEN '${rate.dollar}'
                                ELSE TO_CHAR(totalOwing)
                              END)`,
                current: () => `current * (CASE 
                                WHEN currencies = 'CAD' THEN '${rate.dollar}'
                                WHEN currencies = 'GBP' THEN '${rate.dollar}'
                                WHEN currencies = 'EUR' THEN '${rate.dollar}'
                                ELSE TO_CHAR(current)
                              END)`,
                dating: () => `dating * (CASE 
                                WHEN currencies = 'CAD' THEN '${rate.dollar}'
                                WHEN currencies = 'GBP' THEN '${rate.dollar}'
                                WHEN currencies = 'EUR' THEN '${rate.dollar}'
                                ELSE TO_CHAR(dating)
                              END)`,
              })
              .where({ fileUploadId: fileUploadId })
              .andWhere({ currencies: rate.currency })
            const res = await queryBuilder.execute();
          }
        }

        /**handling currency conversion as per giving currency code END*/

        const updatedResultData = await this.tempExperienceRepository.find({
          where: { fileUploadId: fileUploadId }
        });
        console.log('header end...1')
        /**handling corrections for all the fields*/
        for (let res of updatedResultData) {
          let countryQuery = this.countryRepository.createQueryBuilder('country')
          .select('country.two_char_code');

          if (isNaN(Number(res.countryCode))) {
            // If `res.countryCode` is a string, check with `code`, `name`, and `two_char_code`
            countryQuery = countryQuery
              .where('country.code = :countryCode', { countryCode: res.countryCode })
              .orWhere('country.name = :countryName', { countryName: res.countryCode })
              .orWhere('country.two_char_code = :twoCharCode', { twoCharCode: res.countryCode });
          } else {
            // If `res.countryCode` is a number, check with `id`
            countryQuery = countryQuery
              .where('country.id = :countryId', { countryId: res.countryCode });
          }
          const country = await countryQuery.getOne();

          const data = {
            accountName1: res.accountName1?.trimStart(),
            accountName2: res.accountName2?.trimStart(),
            address1: res.address1?.trimStart(),
            address2: res.address2?.trimStart(),
            countryCode: res.countryCode !== null && country !== null ? country.two_char_code : res.countryCode == null ? 'US' : res.countryCode,
            highCredit: Math.trunc(+res.highCredit).toFixed(0),
            totalOwing: res.totalOwing == '0' ? res.totalOwing = Math.trunc(Number(res?.current) + Number(res?.aging1_30) +
              Number(res?.aging31_60) + Number(res?.aging61_90) + Number(res?.agingOver90)).toFixed(0) : Math.trunc(+res.totalOwing).toFixed(0),
            current: Math.trunc(+res.current).toFixed(0),
            dating: Math.trunc(+res.dating).toFixed(0),
            aging1_30: Math.trunc(+res.aging1_30).toFixed(0),
            aging31_60: Math.trunc(+res.aging31_60).toFixed(0),
            aging61_90: Math.trunc(+res.aging61_90).toFixed(0),
            agingOver90: Math.trunc(+res.agingOver90).toFixed(0),
            zipCode: String(res.zipCode).length == 4 && res.zipCode !== null ? "0" + res.zipCode : res.zipCode,
            figureDate: res.figureDate == null ? moment(new Date()).format('YYYY-MM-DD') : res.figureDate
          };
          if (res.figureDate !== null) {
            await this.tempExperienceRepository.createQueryBuilder()
              .update(TempExperience)
              .set({ figureDate: res.figureDate })
              .where({ figureDate: IsNull() })
              .execute();
          }

          await this.tempExperienceRepository.update(res.id, data);
        };
        console.log('header end...2')
        /**handling corrections for all the fields END*/

        await this.fileUploadRepository
          .createQueryBuilder()
          .update(FileUpload)
          .set({ status: FileUploadStatus.APPROVED, statusReason: null, processStatus : ProcessStatus.INPROGRESS})
          .where({ id: fileUploadId })
          .execute();

          /**Handing inactive status update of trade data */
        const customer = await this.customerRepository.findOne({
          where: { id: file.customerNo }
        });
        const date2 = new Date();
        if (customer.rcTrackerEnabled == 0 || customer.rcTrackerEnabled == null) {
          await this.tempExperienceRepository.createQueryBuilder()
            .update(TempExperience)
            .set({ status: TempExperienceStatus.INACTIVE })
            .where({ fileUploadId: fileUploadId })
            .andWhere({ totalOwing: Number(0.00) })
            .andWhere(`lastSaleDate IS NULL OR lastSaleDate <= '${moment(date2).subtract(1, 'years').format('YYYY-MM-DD')}'`)
            .execute();
        }

        /**Handing inactive status update of trade data END */
      }

      // await this.tempExperienceRepository.find({
      //   where: { fileUploadId: fileUploadId }
      // })
      isEmailSend = true;
      this.validationCheckedEmptyRowsAndDataType(isEmailSend, fileUploadId);
      // this.autoMapping(updatedResult);

      validate = true;
      // if (validate == true) {
        // break;
      // };



    // } catch (err) {
      // await this.fileUploadRepository.update(fileUploadId, { status: FileUploadStatus.TEMPLATEMISMATCH, statusReason: 'Unknown reason.' });
      // return {
      //   statusCode: HttpStatus.NO_CONTENT,
      //   message: `${Messages.TempDataModule.TemplateSettingNotMatched}`,
      // };
      if (!validate) {
        console.log('******6.b.b2. if not matched -> RESPONSE******');
        await this.fileUploadRepository.update(fileUploadId, { status: FileUploadStatus.TEMPLATEMISMATCH, statusReason: 'Unknown reason.' });
        return {
          statusCode: HttpStatus.NO_CONTENT,
          message: `${Messages.TempDataModule.TemplateSettingNotMatched}`,
        };
      }
      else {
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.TempDataModule.TemplateSettingMatched}`
        }
      }
    // }
  }

  /**
   * Checks if a value is an integer.
   * @param value The value to check.
   * @returns True if the value is an integer, false otherwise.
   */
  isInteger(value: any) {
    return /^[-+]?\d+$/.test(value.trim());
  }

  /**
   * Checks if a value contains only alphabetic characters.
   * @param value The value to check.
   * @returns True if the value contains only alphabetic characters, false otherwise.
   */
  isCharacter(value: any) {
    return typeof value === 'string' && /^[a-zA-Z\s]+$/.test(value);
  }

  /**
   * Checks if a value is a valid date.
   * @param value The value to check.
   * @returns True if the value is a valid date, false otherwise.
   */
  isDate(value: any) {
    return !isNaN(Date.parse(value));
  }

  /**
   * Checks if a value is a valid decimal number.
   * @param value The value to check.
   * @returns True if the value is a valid decimal number, false otherwise.
   */
  isDecimalNumber(value: any): boolean {
    return /^-?\d*\.\d+$/.test(value.trim());
  }

  /**
   * Validates the data in `resultData` against the provided configuration.
   * @param customerTemplate The customer template object.
   * @param tempData The temp data array.
   * @returns An object containing validation results where keys are field names and values are error messages.
   */
  public validateDataType(
    customerTemplate: Record<string, any>,
    tempData: Record<string, any>[]
  ): ValidationResult {
    const validationResults: ValidationResult = {};
    const invertedTemplate: Record<string, string> = {};

    for (let key in customerTemplate) {
      if (customerTemplate[key]) {
        invertedTemplate[customerTemplate[key]] = key;
      }
    }

    const firstRow = tempData[0];
    const secondRow = tempData[1];
    const resultData: Record<string, any> = {};

    for (let key in firstRow) {
      if (key.startsWith('column') && firstRow[key] !== null && invertedTemplate[firstRow[key]]) {
        const templateKey = invertedTemplate[firstRow[key]];
        resultData[templateKey] = secondRow[key];
      }
    }
    console.log(resultData);
    TEMPLATECONFIG.forEach(field => {
      const { TableColumnName, Validation } = field;
      const value = resultData[TableColumnName];

      Validation.forEach(validationType => {
        switch (validationType) {
          case 'integer':
            if (value !== null && value !== undefined && !this.isInteger(value)) {
              validationResults[TableColumnName] = `Invalid integer: ${value}`;
            }
            break;
          case 'character':
            if (value !== null && value !== undefined && !this.isCharacter(value)) {
              validationResults[TableColumnName] = `Invalid character: ${value}`;
            }
            break;
          case 'date':
            if (value !== null && value !== undefined && !this.isDate(value)) {
              validationResults[TableColumnName] = `Invalid date: ${value}`;
            }
            break;
          case 'decimal':
            if (value !== null && value !== undefined && !this.isDecimalNumber(value)) {
              validationResults[TableColumnName] = `Invalid decimal: ${value}`;
            }
            break;
          default:
            break;
        }
      });
    });

    return validationResults;
  }

  /**function for validating if array1 and array2 are identical or not */
  areArraysIdentical<T>(array1: T[], array2: T[]): boolean {
    // Check if arrays have the same length
    // if (array1.length !== array2.length) {
    //   return false;
    // }

    // Check if each element in array1 is equal to the corresponding element in array2
    for (let i = 0; i < array1.length; i++) {
      let keys;
      keys = array2.filter((y) => {
        return y == array1[i]
      })
      if (array1[i] !== keys[0]) {
        return false;
      }
    }

    // Arrays are identical
    return true;
  }

  /**function for replacing keys of jsonArray with value of replacementObject's same key. 
     Structure of jsonArray and replacementObject must be same */
  replaceKeysInArray(jsonArray: any[], replacementObject: any): any[] {
    return jsonArray.map(obj => {
      const newObj: any = {};
      Object.keys(obj).forEach(key => {
        newObj[replacementObject[key]] = obj[key];
      });
      return newObj;
    });
  }

  replaceKeysInArray2(jsonArray: any[], replacementObject: any): any[] {  
    return jsonArray.map(obj => {
      const newObj = {};
      Object.keys(obj).forEach(key => {
        if (key.trim() === 'Cust ref number cust name') {
          const firstSpaceIndex = obj[key].indexOf(' ');
        
          if (firstSpaceIndex !== -1) {
            // Extract customer ref number and customer name
            const custRefNumber = obj[key].substring(0, firstSpaceIndex).trim();
            const custName = obj[key].substring(firstSpaceIndex + 1).trim();
            
            // Add the new columns
            newObj['customerRefNo'] = custRefNumber || '';
            newObj['accountName1'] = custName || '';
          } else {
            // If there's no space, treat the entire value as the customer ref number
            newObj['customerRefNo'] = obj[key].trim();
            newObj['accountName1'] = '';
          }
        } else if (key.trim() === 'C-S-Z') {
          // Split the 'C-S-Z' value into city, state, and zip code
          const parts = obj[key].split(' ').filter(Boolean);
          
          // The last part is the zip code, the second last is the state, and the rest is the city
          const zipCode = parts.pop();
          const stateCode = parts.pop();
          const city = parts.join(' ');

          // Add the new columns
          newObj['zipCode'] = zipCode || '';
          newObj['stateCode'] = stateCode || '';
          newObj['city'] = city || '';
        } else if (key.trim() === 'City, State') {
          // Split the 'City, State' value by both commas and spaces, filtering out empty strings
          const parts = obj[key].split(/[, ]+/).filter(Boolean);

          // The last part is the state code, and the remaining parts form the city name
          const stateCode = parts.pop();
          const city = parts.join(' ');

          // Add the new columns
          newObj['city'] = city || '';
          newObj['stateCode'] = stateCode || '';
        } if (key.trim() === 'Postal Code City') {
          const firstSpaceIndex = obj[key].indexOf(' ');
        
          if (firstSpaceIndex !== -1) {
            // Extract customer ref number and customer name
            const zipCode = obj[key].substring(0, firstSpaceIndex).trim();
            const city = obj[key].substring(firstSpaceIndex + 1).trim();
            
            // Add the new columns
            newObj['zipCode'] = zipCode || '';
            newObj['city'] = city || '';
          } else {
            // If there's no space, treat the entire value as the customer ref number
            newObj['zipCode'] = obj[key].trim();
            newObj['city'] = '';
          }
        } else if(key.trim() == 'Figure date day' || key.trim() == 'Figure date Month' || key.trim() == 'Figure date Year') {
          // Collect the day, month, and year values
          const day = obj['Figure date day'];
          const month = obj['Figure date Month'];
          const year = obj['Figure date Year'];
          if (day && month && year) {
            // Construct the full date in YYYY-MM-DD format
            const figureDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            newObj['figureDate'] = figureDate;
          }
        } else if(key.trim() == 'Last Sale Month' || key.trim() == 'Last Sale Year') {
          // Collect the day, month, and year values
          const month = obj['Last Sale Month'];
          const year = obj['Last Sale Year'];
          if (month && year) {
            // Construct the full date in YYYY-MM-DD format
            const lastSaleDate = `${year}-${month.padStart(2, '0')}-01`;
            newObj['lastSaleDate'] = lastSaleDate;
          }
        } else if(key.trim() == 'Last Sale Code') {
          const lastSaleCode = obj['Last Sale Code'];
          if (lastSaleCode && lastSaleCode.length === 2) {
            // Construct the full date in YYYY-MM-DD format
            const currentYear = moment(new Date()).format('YYYY');
            const lastSaleDate = `${currentYear}- ${lastSaleCode}-01`;
            newObj['lastSaleDate'] = lastSaleDate;
          } else if(lastSaleCode && lastSaleCode.length === 4) {
            const lastSaleDate = `${lastSaleCode}-01-01`;
            newObj['lastSaleDate'] = lastSaleDate;
          }
        } else if(key.trim() == 'Fig Date YMD') {
          const dayMonthYear = obj['Fig Date YMD'];
          if (dayMonthYear && dayMonthYear.length === 8) {
            const year = dayMonthYear.slice(0, 4);
            const month = dayMonthYear.slice(4, 6);
            const day = dayMonthYear.slice(6, 8);
            const formattedDate = `${year}-${month}-${day}`;
            newObj['figureDate'] = formattedDate;
          }
        } else if(key.trim() == 'Last Sale YMD') {
          const dayMonthYear = obj['Last Sale YMD'];
          if (dayMonthYear && dayMonthYear.length === 8) {
            const year = dayMonthYear.slice(0, 4);
            const month = dayMonthYear.slice(4, 6);
            const day = dayMonthYear.slice(6, 8);
            const formattedDate = `${year}-${month}-${day}`;
            newObj['lastSaleDate'] = formattedDate;
          }
        } else if(key.trim() == 'Opened YMD') {
          const dayMonthYear = obj['Opened YMD'];
          if (dayMonthYear && dayMonthYear.length === 8) {
            const year = dayMonthYear.slice(0, 4);
            const month = dayMonthYear.slice(4, 6);
            const day = dayMonthYear.slice(6, 8);
            const formattedDate = `${year}-${month}-${day}`;
            newObj['yearAccountOpened'] = formattedDate;
          }
        } else {
          if (newObj[replacementObject[key]] === undefined) {
            // Initialize key in newObj if it doesn't exist
            newObj[replacementObject[key]] = obj[key];
          } else {
            // Concatenate values if key already exists in newObj
            if (!isNaN(parseFloat(obj[key]))) {
              // If the current value is numeric, parse and add it
              newObj[replacementObject[key]] = parseFloat(newObj[replacementObject[key]]) + parseFloat(obj[key]);
            } else {
              // Otherwise, concatenate the values as strings
              newObj[replacementObject[key]] += obj[key];
            }
          }
        }
      });
      return newObj;
    });
  }

  async validationCheckedEmptyRowsAndDataType(isEmailSend: boolean, fileUploadId?: number, tempExperienceId?: number) {
    console.log('Validation Started');
    const regexPatterns = {
      isCharacterOnly: /^[a-zA-Z ]*$/,
      isDecimalOnly: /^-?\d+(\.\d{1,20})?$/,
      isDate: /^(\d{4})(\/|-)(\d{1,2})(\/|-)(\d{1,2})$/,
      isEmail: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
      isInteger: /^-?\d+$/
    };
  
    const columnsByType = {
      mandatory: [],
      integer: [],
      character: [],
      date: [],
      decimal: [],
      email: []
    };
  
    // Extract validation types from TEMPLATECONFIG
    const templateStructure = await this.templateStructureRepository.find({order: {id: 'ASC'}});
    for (let config of templateStructure) {
      if(config.templateColumnName) {
        const validationString = config.validation?.replace(/'/g, '"');
        let validation = [];
        if(validationString !== undefined) {
          validation  = JSON.parse(validationString).map(item => item.toLowerCase()).filter(validation => validation.trim() !== '');
        }
        if(validation.length > 0) {
          validation.forEach(validationType => {
            if (!columnsByType[validationType]) {
              columnsByType[validationType] = [];
            }
            columnsByType[validationType].push(config.tableColumnName);
          });
        }
      }
    }
  
    // Get temp-experience data
    let query = this.tempExperienceRepository.createQueryBuilder('tempExperience')
      .where('tempExperience.fileUploadId = :fileUploadId', { fileUploadId })
      .andWhere({ status: Not('inactive') });
  
    if (tempExperienceId) {
      query = query.andWhere('tempExperience.id = :id', { id: tempExperienceId });
    }
  
    const rows = await query.getMany();
  
    // Clear error and warning for the relevant records
    await this.tempExperienceRepository.createQueryBuilder()
      .update(TempExperience)
      .set({ warning: null, error: null })
      .where({ fileUploadId, ...(tempExperienceId && { id: tempExperienceId }) })
      .execute();
  
    // Validation updates
    for (const row of rows) {
      const errors = [];
      const warnings = [];
  
      // Validate mandatory columns
      columnsByType.mandatory.forEach(column => {
        if (row[column] == null) {
          errors.push(`${this.capitalize(column)} should be mandatory`);
        } else if(row[column] == 'customerRefNo') {
          warnings.push(`${this.capitalize(column)} should be mandatory`);
        }
      });
  
      // Validate integer columns
      columnsByType.integer.forEach(column => {
        if (row[column] != null && !regexPatterns.isInteger.test(row[column])) {
          errors.push(`${this.capitalize(column)} should be integer type only`);
        }
      });
  
      // Validate character columns
      columnsByType.character.forEach(column => {
        if (row[column] != null && !regexPatterns.isCharacterOnly.test(row[column])) {
          errors.push(`${this.capitalize(column)} should be character type only`);
        }
      });
  
      // Validate date columns
      columnsByType.date.forEach(column => {
        if (row[column] != null && !regexPatterns.isDate.test(row[column])) {
          errors.push(`${this.capitalize(column)} should be date type only`);
        }
      });
  
      // Validate decimal columns
      columnsByType.decimal.forEach(column => {
        if (row[column] != null && !regexPatterns.isDecimalOnly.test(row[column])) {
          errors.push(`${this.capitalize(column)} should be decimal type only`);
        }
      });
  
      // Validate email columns
      columnsByType.email.forEach(column => {
        // if (row[column] != null && !regexPatterns.isEmail.test(row[column])) {
        if (row[column] != null) {
          // errors.push(`${this.capitalize(column)} should be in email format`);
          errors.push(`${this.capitalize(column)} should be character type only`);
        }
      });
  
      // Specific validations
      if (row.countryCode === 'CA' && Number(row.zipCode)) {
        errors.push('ZipCode should be alpha-numeric');
      }

      // Check if the totalOwing is equal to the sum of current, aging1_30, aging31_60, aging61_90 and agingOver90
      let current = Number(row?.current) || 0;
      let aging1_30 = Number(row?.aging1_30) || 0;
      let aging31_60 = Number(row?.aging31_60) || 0;
      let aging61_90 = Number(row?.aging61_90) || 0;
      let agingOver90 = Number(row?.agingOver90) || 0;
      let sumOfOtherFields = Math.trunc(current) + Math.trunc(aging1_30) + Math.trunc(aging31_60) + Math.trunc(aging61_90) + Math.trunc(agingOver90);
      if (Number(row.totalOwing) != Number(sumOfOtherFields.toFixed(0))) {
        errors.push('Total owing is not equals to the aging columns');
      }

      // Check for valid country
      const country = await this.countryRepository.createQueryBuilder('country')
        .where({ two_char_code: row.countryCode })
        .getOne();
      if (!country) {
        warnings.push('Country not found');
      }
  
      // Check for Riemer account
      const account = await this.accountRepository.createQueryBuilder('account')
      .where('LOWER(account.name_1) = LOWER(:name_1)', { name_1: row.accountName1 })
      .andWhere('LOWER(account.address_1) = LOWER(:address_1)', { address_1: row.address1 })
      .andWhere('LOWER(account.city) = LOWER(:city)', { city: row.city })
      .andWhere('account.zip_code = :zip_code', { zip_code: row.zipCode })
      .andWhere('LOWER(account.state) = LOWER(:state)', { state: row.stateCode })
      .andWhere('account.country = :country', { country: country ? country.id : 160 })
      .getOne();
      if (!account) {
        warnings.push('Riemer number not found');
      }
  
      // Check for valid state
      // const state = await this.stateRepository.createQueryBuilder('state')
      //   .where({ code: row.stateCode })
      //   .getOne();
      // if (!state) {
      //   warnings.push('State not found');
      // }
      let state;
      try {
        state = await this.stateRepository.createQueryBuilder('state')
          .where('state.code = :code', { code: row.stateCode })
          .getOne();
      } catch (error) {
        console.error('Error fetching state:', error);
      }

      if (!state) {
        warnings.push('State not found');
      }


      // Check for valid zip code
      const zipCode = await this.zipCodeRepository.createQueryBuilder('zip-code')
        .where({ zip_code: row.zipCode })
        .getOne();
      if (!zipCode) {
        // warnings.push('ZipCode not found');
      } else if (zipCode.state !== row.stateCode) {
        errors.push('StateCode is not appropriate as per the given zip');
      }
  
      // Update errors and warnings
      if (errors.length > 0) {
        console.log('update error');
        await this.tempExperienceRepository.createQueryBuilder()
          .update(TempExperience)
          .set({ error: () => `CONCAT(COALESCE(TO_CHAR(error), ''), '${errors},')` })
          .where({ id: row.id })
          .execute();
      }
  
      if (warnings.length > 0) {
        console.log('update warning')
        await this.tempExperienceRepository.createQueryBuilder()
          .update(TempExperience)
          .set({ warning: () => `CONCAT(COALESCE(TO_CHAR(warning), ''), '${warnings},')` })
          .where({ id: row.id })
          .execute();
      }
    } 
  
    // Check for different figure dates in case of multiple rows
    if (fileUploadId && !tempExperienceId) {
      const uniqueFigureDates = await this.tempExperienceRepository.createQueryBuilder('temp')
        .select('DISTINCT temp.figureDate')
        .where({ fileUploadId })
        .getRawMany();
  
      if (uniqueFigureDates.length > 1) {
        await this.tempExperienceRepository.createQueryBuilder()
          .update(TempExperience)
          .set({ warning: () => `CONCAT(COALESCE(TO_CHAR(warning), ''), 'Different figure dates available in a file,')` })
          .where({ fileUploadId })
          .execute();
      }
  
      const before1MonthDate = moment().subtract(1, 'month').format("YYYY-MM-DD");
      const after1DayDate = moment().add(1, 'day').format("YYYY-MM-DD");
  
      await this.tempExperienceRepository.createQueryBuilder()
        .update(TempExperience)
        .set({ warning: () => `CONCAT(COALESCE(TO_CHAR(warning), ''), 'Figuredate is older than 30 days,')` })
        .where({ fileUploadId })
        .andWhere(`figureDate NOT BETWEEN '${before1MonthDate}' AND '${after1DayDate}'`)
        .execute();
    } else if(fileUploadId && tempExperienceId) {
      const before1MonthDate = moment().subtract(1, 'month').format("YYYY-MM-DD");
      const after1DayDate = moment().add(1, 'day').format("YYYY-MM-DD");
  
      await this.tempExperienceRepository.createQueryBuilder()
        .update(TempExperience)
        .set({ warning: () => `CONCAT(COALESCE(TO_CHAR(warning), ''), 'Figuredate is older than 30 days,')` })
        .where({ fileUploadId })
        .andWhere(`figureDate NOT BETWEEN '${before1MonthDate}' AND '${after1DayDate}'`)
        .execute();
    }
  
    // Update result and status
    await this.tempExperienceRepository.createQueryBuilder()
      .update(TempExperience)
      .set({
        result: TempExperienceStatus.PASS,
        status: TempExperienceStatus.PENDING
      })
      .where({ error: IsNull() })
      .andWhere({ status: Not('mapped') })
      .andWhere({ status: Not('inactive') })
      .andWhere({ fileUploadId, ...(tempExperienceId && { id: tempExperienceId }) })
      .execute();
  
    await this.tempExperienceRepository.createQueryBuilder()
      .update(TempExperience)
      .set({
        result: TempExperienceStatus.FAIL,
        status: TempExperienceStatus.DATAERROR
      })
      .where({ error: Not(IsNull()) })
      .andWhere({ status: Not('mapped') })
      .andWhere({ status: Not('inactive') })
      .andWhere({ fileUploadId, ...(tempExperienceId && { id: tempExperienceId }) })
      .execute();
      console.log('Validation ended');

    if(fileUploadId && !tempExperienceId) {
      await this.updateTempExperienceOnBasisOfPreviousMonth(fileUploadId);
    } 

    this.autoMapping(isEmailSend, fileUploadId, tempExperienceId);
  }

  // async validationCheckedEmptyRowsAndDataType(isEmailSend: boolean, fileUploadId?: number, tempExperienceId?: number) {
  //   console.log('Validation Started');
  //   const regexPatterns = {
  //     isCharacterOnly: /^[a-zA-Z ]*$/,
  //     isDecimalOnly: /^-?\d+(\.\d{1,20})?$/,
  //     isDate: /^(\d{4})(\/|-)(\d{1,2})(\/|-)(\d{1,2})$/,
  //     isEmail: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
  //     isInteger: /^-?\d+$/
  //   };
  
  //   const columnsByType = { mandatory: [], integer: [], character: [], date: [], decimal: [], email: [] };
  
  //   const templateStructure = await this.templateStructureRepository.find({ order: { id: 'ASC' } });
  //   templateStructure.forEach(config => {
  //     if (config.templateColumnName && config.validation) {
  //       const validations = JSON.parse(config.validation.replace(/'/g, '"')).map(v => v.toLowerCase().trim());
  //       validations.forEach(type => columnsByType[type]?.push(config.tableColumnName));
  //     }
  //   });
  
  //   const rowsQuery = this.tempExperienceRepository.createQueryBuilder('tempExperience')
  //     .where('tempExperience.fileUploadId = :fileUploadId', { fileUploadId })
  //     .andWhere({ status: Not('inactive') });
  //   if (tempExperienceId) rowsQuery.andWhere('tempExperience.id = :id', { id: tempExperienceId });
  //   const rows = await rowsQuery.getMany();
  
  //   await this.tempExperienceRepository.createQueryBuilder()
  //     .update(TempExperience)
  //     .set({ warning: null, error: null })
  //     .where({ fileUploadId, ...(tempExperienceId && { id: tempExperienceId }) })
  //     .execute();
  
  //   const validateColumn = (row, column, pattern, errorMsg) => {
  //     if (row[column] != null && !pattern.test(row[column])) return `${this.capitalize(column)} ${errorMsg}`;
  //     return null;
  //   };
  
  //   for (const row of rows) {
  //     const errors = [];
  //     const warnings = [];
  
  //     // Validate columns by type
  //     Object.keys(columnsByType).forEach(type => {
  //       columnsByType[type].forEach(column => {
  //         let errorMsg;
  //         if (type === 'mandatory' && row[column] == null) errorMsg = 'should be mandatory';
  //         else if (type === 'integer') errorMsg = validateColumn(row, column, regexPatterns.isInteger, 'should be integer type only');
  //         else if (type === 'character') errorMsg = validateColumn(row, column, regexPatterns.isCharacterOnly, 'should be character type only');
  //         else if (type === 'date') errorMsg = validateColumn(row, column, regexPatterns.isDate, 'should be date type only');
  //         else if (type === 'decimal') errorMsg = validateColumn(row, column, regexPatterns.isDecimalOnly, 'should be decimal type only');
  //         else if (type === 'email') errorMsg = validateColumn(row, column, regexPatterns.isEmail, 'should be in email format');
  //         if (errorMsg) errors.push(errorMsg);
  //       });
  //     });
  
  //     // Specific validations
  //     if (row.countryCode === 'CA' && Number(row.zipCode)) errors.push('ZipCode should be alpha-numeric');
  //     const account = await this.accountRepository.createQueryBuilder('account')
  //       .where({
  //         name_1: row.accountName1,
  //         address_1: row.address1,
  //         city: row.city,
  //         zip_code: row.zipCode,
  //         state: row.stateCode
  //       }).getOne();
  //     if (!account) warnings.push('Riemer number not found');
  
  //     const country = await this.countryRepository.findOne({ where: { two_char_code: row.countryCode } });
  //     if (!country) warnings.push('Country not found');

  //     const state = await this.stateRepository.findOne({ where: { code: row.stateCode } });
  //     if (!state) warnings.push('State not found');
  
  //     const zipCode = await this.zipCodeRepository.findOne({ where: { zip_code: row.zipCode } });
  //     if (!zipCode) warnings.push('ZipCode not found');
  //     else if (zipCode.state !== row.stateCode) errors.push('StateCode is not appropriate as per the given zip');
  
  //     // Update errors and warnings
  //     if (errors.length > 0) await this.updateErrorOrWarning(row.id, errors, 'error');
  //     if (warnings.length > 0) await this.updateErrorOrWarning(row.id, warnings, 'warning');
  //   }
  
  //   // Check for figure dates
  //   if (fileUploadId && !tempExperienceId) {
  //     const uniqueFigureDates = await this.tempExperienceRepository.createQueryBuilder('temp')
  //       .select('DISTINCT temp.figureDate')
  //       .where({ fileUploadId })
  //       .getRawMany();
  
  //     if (uniqueFigureDates.length > 1) await this.updateErrorOrWarning(null, ['Different figure dates available in a file'], 'warning', fileUploadId);
  
  //     const before1MonthDate = moment().subtract(1, 'month').format("YYYY-MM-DD");
  //     const after1DayDate = moment().add(1, 'day').format("YYYY-MM-DD");
  
  //     await this.tempExperienceRepository.createQueryBuilder()
  //       .update(TempExperience)
  //       .set({ warning: () => `CONCAT(COALESCE(TO_CHAR(warning), ''), 'Figure date is older than 30 days,')` })
  //       .where({ fileUploadId })
  //       .andWhere(`figureDate NOT BETWEEN '${before1MonthDate}' AND '${after1DayDate}'`)
  //       .execute();
  //   }
  
  //   // Update result and status
  //   await this.updateResultStatus(fileUploadId, tempExperienceId, TempExperienceStatus.PASS, TempExperienceStatus.PENDING);
  //   await this.updateResultStatus(fileUploadId, tempExperienceId, TempExperienceStatus.FAIL, TempExperienceStatus.DATAERROR, true);
    
  //   console.log('Validation ended');
  //   this.autoMapping(isEmailSend, fileUploadId, tempExperienceId);
  // }
  
  // async updateErrorOrWarning(id, messages, field, fileUploadId = null) {
  //   const query = this.tempExperienceRepository.createQueryBuilder()
  //     .update(TempExperience)
  //     .set({ [field]: () => `CONCAT(COALESCE(TO_CHAR(${field}), ''), '${messages},')` });
  //   if (id) query.where({ id });
  //   if (fileUploadId) query.where({ fileUploadId });
  //   await query.execute();
  // }
  
  // async updateResultStatus(fileUploadId, tempExperienceId, result, status, hasError = false) {
  //   await this.tempExperienceRepository.createQueryBuilder()
  //     .update(TempExperience)
  //     .set({ result, status })
  //     .where({ fileUploadId, ...(tempExperienceId && { id: tempExperienceId }), ...(hasError ? { error: Not(IsNull()) } : { error: IsNull() }) })
  //     .andWhere({ status: Not('mapped') })
  //     .andWhere({ status: Not('inactive') })
  //     .execute();
  // }
  
  
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  async updateTempExperienceOnBasisOfPreviousMonth(fileUploadId) {
    const tempExperienceData = await this.tempExperienceRepository.find({
      where: { fileUploadId: fileUploadId, status: TempExperienceStatus.DATAERROR }
    })

    if (tempExperienceData.length > 0) {
      for (let temp of tempExperienceData) {
        const tempFigureDate = moment(temp.figureDate).format('YYYY-MM-DD');
        const firstDayOfPreviousMonth = moment(tempFigureDate).subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
        const lastDayOfPreviousMonth = moment(tempFigureDate).subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
        
        const mappedExperience = await this.tempExperienceRepository.createQueryBuilder('tempExperience')
          .where('tempExperience.customerRefNo = :customerRefNo', { customerRefNo: temp.customerRefNo })
          .andWhere('tempExperience.customerNo = :customerNo', { customerNo: temp.customerNo })
          .andWhere('tempExperience.datasite = :datasite', { datasite: temp.datasite })
          .andWhere('tempExperience.figureDate BETWEEN :firstDayOfPreviousMonth AND :lastDayOfPreviousMonth', {
            firstDayOfPreviousMonth,
            lastDayOfPreviousMonth
          })
          .andWhere('tempExperience.status = :status', { status: TempExperienceStatus.MAPPED })
          .getOne();

        // If a 'MAPPED' record exists, update it
        if (mappedExperience) {
          await this.tempExperienceRepository.createQueryBuilder()
            .update(TempExperience)
            .set({
              accountId: mappedExperience.accountId,
              accountName1: mappedExperience.accountName1,
              accountName2: mappedExperience.accountName2,
              address1: mappedExperience.address1,
              address2: mappedExperience.address2,
              city: mappedExperience.city,
              stateCode: mappedExperience.stateCode,
              zipCode: mappedExperience.zipCode,
              countryCode: mappedExperience.countryCode,
              status: mappedExperience.status,
              error: null,
              warning: null
            })
            .where({
              fileUploadId: fileUploadId,
              id: temp.id
            })
            .execute();
        } else {
          // If no 'MAPPED' record, check for 'PENDING' and update it
          const pendingExperience = await this.tempExperienceRepository.createQueryBuilder('tempExperience')
            .where('tempExperience.customerRefNo = :customerRefNo', { customerRefNo: temp.customerRefNo })
            .andWhere('tempExperience.customerNo = :customerNo', { customerNo: temp.customerNo })
            .andWhere('tempExperience.datasite = :datasite', { datasite: temp.datasite })
            .andWhere('tempExperience.figureDate BETWEEN :firstDayOfPreviousMonth AND :lastDayOfPreviousMonth', {
              firstDayOfPreviousMonth,
              lastDayOfPreviousMonth
            })
            .andWhere('tempExperience.status = :status', { status: TempExperienceStatus.PENDING })
            .getOne();

          if (pendingExperience) {
            await this.tempExperienceRepository.createQueryBuilder()
              .update(TempExperience)
              .set({
                accountId: pendingExperience?.accountId,
                accountName1: pendingExperience.accountName1,
                accountName2: pendingExperience.accountName2,
                address1: pendingExperience.address1,
                address2: pendingExperience.address2,
                city: pendingExperience.city,
                stateCode: pendingExperience.stateCode,
                zipCode: pendingExperience.zipCode,
                countryCode: pendingExperience.countryCode,
                status: pendingExperience.status,
                error: null,
              })
              .where({
                fileUploadId: fileUploadId,
                id: temp.id
              })
              .execute();
          }
        }
      }
    }
  }

  async autoMapping(isEmailSend: boolean, fileUploadId?: number, tempExperienceId?: number) {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      console.log('isEmailSend', isEmailSend);
  
      const file = await this.fileUploadRepository.findOne({
        where: { id: fileUploadId }
      });
      console.log('7. Auto Mapping start');

      const query = await this.tempExperienceRepository.createQueryBuilder('tempExperience');

      // In case of update temp-experience
      if (fileUploadId && tempExperienceId) {
        query.where('tempExperience.fileUploadId = :fileUploadId', { fileUploadId: fileUploadId });
        query.andWhere('tempExperience.id = :id', { id: tempExperienceId });
        query.andWhere(new Brackets(qb => {
          qb.where({ status: TempExperienceStatus.PENDING })
            .orWhere({ status: TempExperienceStatus.DATAERROR });
        }));
      } // In case of after added temp-experience
      else if (fileUploadId && !tempExperienceId) {
        query.where('tempExperience.fileUploadId = :fileUploadId', { fileUploadId: fileUploadId });
        query.andWhere(new Brackets(qb => {
          qb.where({ status: TempExperienceStatus.PENDING })
            .orWhere({ status: TempExperienceStatus.DATAERROR });
        }));
      }
      const tempExperienceData = await query.getMany();
  
      if (tempExperienceData.length > 0) {
        for (let temp of tempExperienceData) {
          const account = await this.accountXrefRepository.findOne({
            where: {
              custNo: temp.customerNo,
              custRefNo: temp.customerRefNo,
              dataSite: temp.datasite
            }
          });
          if (account) {
            console.log('7.a. if matched, account updated in temp-experience');

            // Check if the totalOwing is equal to the sum of current, aging1_30, aging31_60, aging61_90 and agingOver90
            let current = Number(temp?.current) || 0;
            let aging1_30 = Number(temp?.aging1_30) || 0;
            let aging31_60 = Number(temp?.aging31_60) || 0;
            let aging61_90 = Number(temp?.aging61_90) || 0;
            let agingOver90 = Number(temp?.agingOver90) || 0;
            let sumOfOtherFields = Math.trunc(current) + Math.trunc(aging1_30) + Math.trunc(aging31_60) + Math.trunc(aging61_90) + Math.trunc(agingOver90);
            if (Number(temp.totalOwing) == Number(sumOfOtherFields.toFixed(0))) {
              await queryRunner.manager.createQueryBuilder()
              .update(TempExperience)
              .set({
                error: null,
                result: TempExperienceStatus.PASS,
                accountId: account.account,
                status: TempExperienceStatus.MAPPED,
                warning: () => `REPLACE("warning", 'Riemer number not found,', '')`
              })
              .where({
                fileUploadId: fileUploadId,
                customerNo: account.custNo,
                customerRefNo: account.custRefNo,
                datasite: account.dataSite,
                status: Not('inactive')
              })
              .execute();
            }
          }
        }
      }

      const duplicateRecords = await queryRunner.manager.createQueryBuilder(TempExperience, 'tempExp')
        .select(['tempExp.id AS id', 'tempExp.accountId AS accountId'])
        .where({ fileUploadId: fileUploadId })
        .andWhere({ status: TempExperienceStatus.MAPPED })
        .andWhere(qb => {
          const subQuery = qb.subQuery()
            .select('subTemp.accountId')
            .from(TempExperience, 'subTemp')
            .where({ fileUploadId: fileUploadId })
            .andWhere({ status: TempExperienceStatus.MAPPED })
            .groupBy('subTemp.accountId')
            .having('COUNT(subTemp.accountId) > 1')
            .getQuery();
          return 'tempExp.accountId IN ' + subQuery;
        })
        .andWhere(tempExperienceId ? 'tempExp.id = :id' : '1=1', { id: tempExperienceId })
        .orderBy('tempExp.accountId', 'ASC')
        .addOrderBy('tempExp.id', 'ASC')
        .execute();

      const uniqueRecords = lodash.uniqBy(duplicateRecords, 'ACCOUNTID');
      for (const record of uniqueRecords) {
        await queryRunner.manager.createQueryBuilder()
          .update(TempExperience)
          .set({
            status: FileUploadStatus.PENDING,
            warning: () => `CONCAT(COALESCE(TO_CHAR(warning), ''), 'Details already available in Experience,')`
          })
          .where({ id: record.ID })
          .execute();
      }
  
      const finalResult = await queryRunner.manager.find(TempExperience, {
        where: 
          { 
            fileUploadId: fileUploadId, 
            status: TempExperienceStatus.MAPPED,
            ...(tempExperienceId ? { id: tempExperienceId } : {}) // Add ID condition if tempExperienceId exists
          }
      });
  
      if (finalResult.length > 0) {
        const data = await Promise.all(finalResult.map(async (obj) => {
          const experience = await this.experienceRepository.createQueryBuilder("experience")
            .where("experience.account = :accountId", { accountId: Number(obj.accountId) })
            .andWhere("experience.customer = :customerNo", { customerNo: Number(obj.customerNo) })
            .andWhere("experience.dataSite = :datasite", { datasite: Number(obj.datasite) })
            .andWhere("experience.figureDate = :figureDate", {
              figureDate: parseInt(obj.figureDate.slice(0, 7).replace(/[-/]/g, ''))
            })
            .getOne();
          if(experience) {
            console.log('8.a. Details already available in Experience');
            await queryRunner.manager.createQueryBuilder()
              .update(TempExperience)
              .set({
                status: FileUploadStatus.PENDING,
                warning: () => `CONCAT(COALESCE(TO_CHAR(warning), ''), 'Details already available in Experience,')` })
              .where({ id: obj.id })
              .execute();
          } else {
            console.log('8.b. Shift temp-experience to experience')
            return {
              account: Number(obj.accountId),
              customer: Number(obj.customerNo),
              figureDate: parseInt(obj.figureDate.slice(0, 7).replace(/[-/]/g, '')),
              figureDay: parseInt(obj.figureDate.slice(8, 10)),
              entryDate: parseInt(obj.figureDate.replace(/[-/]/g, '')),
              openTerm1: obj.open_term1,
              openTerm2: obj.open_term2,
              term1: obj.term1,
              term2: obj.term2,
              lastSale: obj.lastSaleDate !== null ? Number(obj.lastSaleDate.slice(0, 3)) : 0,
              yearAccountOpened: obj.yearAccountOpened !== null ? Number(obj.yearAccountOpened.slice(0, 3)) : 0,
              mannerOfPayment: obj.mannerOfPayment,
              highCredit: Number(obj.highCredit),
              totalOwing: Number(obj.totalOwing),
              current: Number(obj.current),
              aging1_30: Number(obj.aging1_30),
              aging31_60: Number(obj.aging31_60),
              aging61_90: Number(obj.aging61_90),
              agingOver90: Number(obj.agingOver90),
              dispute1_30: obj.dispute1_30,
              dispute31_60: obj.dispute31_60,
              dispute61_90: obj.dispute61_90,
              disputeOver90: obj.disputeOver90,
              commentCode: obj.commentCode,
              comments: obj.comments,
              averageDays: Number(obj.averageDays),
              dataSite: Number(obj.datasite),
            };
          }
        }));
  
        const filteredData = data.filter((entry) => entry !== undefined);
        if (filteredData.length > 0) {
          await this.experienceRepository.save(filteredData, { chunk: 55 });
          console.log('successfully saved mapped records in experience');
        }
      }
  
      const customer = await this.customerRepository.findOne({ where: { id: file.customerNo } });
      let customerName = (customer?.name1 || '') + " " + (customer?.name2 || '');

      const updatedTempExperienceData = await queryRunner.manager.find(TempExperience, {
        where: { fileUploadId: fileUploadId },
      });
  
      const data = {
        member: customerName + " - " + getCheckDigit(customer.id),
        dateOfTransfer: moment(file.createdDate).format("YYYY-MM-DD"),
        dateOfFigures: updatedTempExperienceData[0].figureDate,
        recordCount: updatedTempExperienceData.length,
        canadianAccounts: updatedTempExperienceData.filter(temp => temp.countryCode == 'CAN').length,
        otherInternationalEURO: updatedTempExperienceData.filter(temp => temp.currencies == 'EUR').length,
        otherInternationalGBP: updatedTempExperienceData.filter(temp => temp.currencies == 'GBP').length,
        invalidRecordCount: updatedTempExperienceData.filter(temp => temp.status == TempExperienceStatus.DATAERROR || temp.status == TempExperienceStatus.PENDING).length,
        newRecords: updatedTempExperienceData.filter(temp => temp.status == TempExperienceStatus.PENDING).length,
        inactiveAccounts: updatedTempExperienceData.filter(temp => temp.status == TempExperienceStatus.INACTIVE).length,
        mappedRecords: updatedTempExperienceData.filter(temp => temp.status == TempExperienceStatus.MAPPED).length,
        contributorNo: 0,
        association: 0,
        unfoundCount: 0,
        modifiedCount: 0,
        transferRate: 0,
      };
  
      await queryRunner.manager.createQueryBuilder()
        .update(FileUpload)
        .set({
          ...data,
          elapsedTime: data.dateOfFigures,
          processStatus: ProcessStatus.COMPLETED,
        })
        .where({ id: fileUploadId })
        .execute();
  
      const finalData = await this.fileUploadRepository.findOne({ where: { id: fileUploadId } });
  
      if (isEmailSend) {
        console.log('8. Email sent');
        await this.mailService.sendingMail({
          to: process.env.USER_MAIL,
          subject: 'File Details',
          data: finalData,
          cc: '',
        }, TemplateTypes.file_details);
  
        await this.mailService.sendingMail({
          to: process.env.CUSTOMER_MAIL,
          subject: 'File Details',
          data: finalData,
          cc: '',
        }, TemplateTypes.customer_file_details);
      }
  
      await queryRunner.commitTransaction();
    } catch (error) {
      console.error('Transaction failed, rolling back', error);
      await queryRunner.manager.createQueryBuilder()
        .update(FileUpload)
        .set({
          processStatus: ProcessStatus.COMPLETED,
        })
        .where({ id: fileUploadId })
        .execute();
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
  

  // async autoMapping(isEmailSend: boolean, fileUploadId?: number, tempExperienceId?: number) {
  //   console.log('isEmailSend', isEmailSend)
  //   const file = await this.fileUploadRepository.findOne({
  //     where: { id: fileUploadId }
  //   })

  //   console.log('7. Auto Mapping start');
  //   //get temp-experience data
  //   const query = await this.tempExperienceRepository.createQueryBuilder('tempExperience');

  //   // In case of update temp-experience
  //   if (fileUploadId && tempExperienceId) {
  //     query.where('tempExperience.fileUploadId = :fileUploadId', { fileUploadId: fileUploadId });
  //     query.andWhere('tempExperience.id = :id', { id: tempExperienceId });
  //     query.andWhere({ status: TempExperienceStatus.PENDING })
  //   } // In case of after added temp-experience
  //   else if (fileUploadId && !tempExperienceId) {
  //     query.where('tempExperience.fileUploadId = :fileUploadId', { fileUploadId: fileUploadId });
  //     query.andWhere({ status: TempExperienceStatus.PENDING })
  //   }
  //   const tempExperienceData = await query.getMany();
  //   if (tempExperienceData.length > 0) {
  //     for (let temp of tempExperienceData) {
  //       const account = await this.accountXrefRepository.findOne({
  //         where: {
  //           custNo: temp.customerNo,
  //           custRefNo: temp.customerRefNo,
  //           dataSite: temp.datasite
  //         }
  //       })
  //       if (account) {
  //         console.log('7.a. if matched, account updated in temp-experience')
  //         await this.tempExperienceRepository.createQueryBuilder()
  //           .update(TempExperience)
  //           .set({
  //             error: null,
  //             result: TempExperienceStatus.PASS,
  //             accountId: account.account,
  //             status: TempExperienceStatus.MAPPED,
  //           })
  //           .where({
  //             fileUploadId: fileUploadId,
  //             customerNo: account.custNo,
  //             customerRefNo: account.custRefNo,
  //             datasite: account.dataSite,
  //             status: Not('inactive')
  //           })
  //           .execute();
  //       }
  //     }
  //   }
  //   const customer = await this.customerRepository.findOne({
  //     where: { id: file.customerNo }
  //   });
  //   let customerName1 = customer?.name1 ? customer?.name1 : '';
  //   let customerName2 = customer?.name2 ? customer?.name2 : '';

  //   const finalResult = await this.tempExperienceRepository.find({
  //     where: { fileUploadId: fileUploadId }
  //   });

  //   //mail
  //   const data = {
  //     member: customerName1 + " " + customerName2 + " - " + getCheckDigit(customer.id),
  //     dateOfTransfer: moment(file.createdDate).format("YYYY-MM-DD"),
  //     dateOfFigures: finalResult[0].figureDate,
  //     recordCount: finalResult.length,
  //     canadianAccounts: finalResult.filter((temp) => { return temp.countryCode == 'CAN' }).length,
  //     otherInternationalEURO: finalResult.filter((temp) => { return temp.currencies == 'EURO' }).length,
  //     otherInternationalGBP: finalResult.filter((temp) => { return temp.currencies == 'GBP' }).length,
  //     invalidRecordCount: finalResult.filter((temp) => { return (temp.status == TempExperienceStatus.DATAERROR || temp.status == TempExperienceStatus.PENDING) }).length,
  //     newRecords: finalResult.filter((temp) => { return temp.status == TempExperienceStatus.PENDING }).length,
  //     inactiveAccounts: finalResult.filter((temp) => { return temp.status == TempExperienceStatus.INACTIVE }).length,
  //     mappedRecords: finalResult.filter((temp) => { return temp.status == TempExperienceStatus.MAPPED }).length,
  //     contributorNo: 0,
  //     association: 0,
  //     unfoundCount: 0,
  //     modifiedCount: 0,
  //     transferRate: 0,
  //   };

  //   await this.fileUploadRepository.createQueryBuilder()
  //     .update(FileUpload)
  //     .set({
  //       member: data.member,
  //       dateOfTransfer: data.dateOfTransfer,
  //       dateOfFigures: data.dateOfFigures,
  //       recordCount: data.recordCount,
  //       canadianAccounts: data.canadianAccounts,
  //       otherInternationalEURO: data.otherInternationalEURO,
  //       otherInternationalGBP: data.otherInternationalGBP,
  //       invalidRecordCount: data.invalidRecordCount,
  //       newRecords: data.newRecords,
  //       inactiveAccounts: data.inactiveAccounts,
  //       mappedRecords: data.mappedRecords,
  //       contributorNo: data.contributorNo,
  //       association: data.association,
  //       unfoundCount: data.unfoundCount,
  //       modifiedCount: data.modifiedCount,
  //       elapsedTime: data.dateOfFigures,
  //       transferRate: data.transferRate,
  //       processStatus : ProcessStatus.COMPLETED
  //     })
  //     .where({ id: fileUploadId })
  //     .execute();

  //   const finalData = await this.fileUploadRepository.findOne({
  //     where: { id: fileUploadId }
  //   })

  //   //user-mail
  //   if(isEmailSend) {
  //     console.log('8. Email sent');
  //     var mail: IMail = {
  //       to: process.env.USER_MAIL,
  //       subject: 'File Details',
  //       data: finalData,
  //       cc: '',
  //     };
  //     await this.mailService.sendingMail(mail, TemplateTypes.file_details);
  
  //     //customer-mail
  //     var customerMail: IMail = {
  //       to: process.env.CUSTOMER_MAIL,
  //       subject: 'File Details',
  //       data: finalData,
  //       cc: '',
  //     };
  //     await this.mailService.sendingMail(customerMail, TemplateTypes.customer_file_details);
  //   }
  //   await this.tradeTapeApproval(fileUploadId, tempExperienceId);
  // }

  // async tradeTapeApproval(fileUploadId?: number, tempExperienceId?: number) {
  //   let experienceResult;
  //   try {
  //     //get temp-experience data
  //     const query = await this.tempExperienceRepository.createQueryBuilder('tempExperience');

  //     // In case of update temp-experience
  //     if (fileUploadId && tempExperienceId) {
  //       query.where('tempExperience.fileUploadId = :fileUploadId', { fileUploadId: fileUploadId });
  //       query.andWhere('tempExperience.id = :id', { id: tempExperienceId });
  //       query.andWhere({ status: TempExperienceStatus.MAPPED })
  //     } // In case of after added temp-experience
  //     else if (fileUploadId && !tempExperienceId) {
  //       query.where('tempExperience.fileUploadId = :fileUploadId', { fileUploadId: fileUploadId });
  //       query.andWhere({ status: TempExperienceStatus.MAPPED })
  //     }
  //     const updatedTempExperience = await query.getMany();
      
  //     console.log('updatedTempExperience', updatedTempExperience)
  //     if (updatedTempExperience.length > 0) {
  //       const data = await Promise.all(updatedTempExperience.map(async(obj) => {
  //         const experience = await this.experienceRepository.createQueryBuilder("experience")
  //         .where("experience.account = :accountId", { accountId: Number(obj.accountId) })
  //         .andWhere("experience.customer = :customerNo", { customerNo: Number(obj.customerNo) })
  //         .andWhere("experience.dataSite = :datasite", { datasite: Number(obj.datasite) })
  //         .andWhere("experience.figureDate = :figureDate", { 
  //           figureDate: parseInt(obj.figureDate.slice(0, 7).replace(/[-/]/g, '')) 
  //         })
  //         .andWhere("experience.figureDay = :figureDay", { 
  //           figureDay: parseInt(obj.figureDate.slice(8, 10))
  //         })
  //         .getOne();

  //         console.log('experience', experience);
  //         if(experience) {
  //           console.log('8.a. Experience already exist');
  //         } else {
  //           console.log('8.b. Shift temp-experience to experience');
  //           return {
  //             account: Number(obj.accountId),
  //             customer: Number(obj.customerNo),
  //             figureDate: parseInt(obj.figureDate.slice(0, 7).replace(/[-/]/g, '')),
  //             figureDay: parseInt(obj.figureDate.slice(8, 10)),
  //             entryDate: parseInt(obj.figureDate.replace(/[-/]/g, '')),
  //             openTerm1: obj.open_term1,
  //             openTerm2: obj.open_term2,
  //             term1: obj.term1,
  //             term2: obj.term2,
  //             lastSale: obj.lastSaleDate !== null ? Number(obj.lastSaleDate.slice(0, 3)) : 0,
  //             yearAccountOpened: obj.yearAccountOpened !== null ? Number(obj.yearAccountOpened.slice(0, 3)) : 0,
  //             mannerOfPayment: obj.mannerOfPayment,
  //             highCredit: Number(obj.highCredit),
  //             totalOwing: Number(obj.totalOwing),
  //             current: Number(obj.current),
  //             aging1_30: Number(obj.aging1_30),
  //             aging31_60: Number(obj.aging31_60),
  //             aging61_90: Number(obj.aging61_90),
  //             agingOver90: Number(obj.agingOver90),
  //             dispute1_30: obj.dispute1_30,
  //             dispute31_60: obj.dispute31_60,
  //             dispute61_90: obj.dispute61_90,
  //             disputeOver90: obj.disputeOver90,
  //             commentCode: obj.commentCode,
  //             comments: obj.comments,
  //             averageDays: Number(obj.averageDays),
  //             dataSite: Number(obj.datasite),
  //           }
  //         }
  //       }))
  //       const filteredData = data.filter((entry) => entry !== undefined);
  //       console.log('filteredData', filteredData)
  //       // Save the new experiences in chunks
  //       if (filteredData.length > 0) {
  //         experienceResult = await this.experienceRepository.save(filteredData, { chunk: 55 });
  //         console.log('successfully saved mapped records in experience');
  //       }
  //       if (experienceResult.length > 0) {
  //         return {
  //           statusCode: HttpStatus.OK,
  //           message: `${Messages.TempExperienceModule.BulkUpload.ApproveBulkUpload}`,
  //           data: experienceResult,
  //         };
  //       } else {
  //         return {
  //           statusCode: HttpStatus.BAD_REQUEST,
  //           message: 'Bad request',
  //         };
  //       }
  //     }
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  // async getTempExperienceByFileUploadId(fileUploadId: number, options: IFindAllTempExperience) {
  //   console.log("BE : start ");
  //   const fileUpload = await this.fileUploadRepository.findOne({
  //     where: { id: fileUploadId },
  //   });
  //   if (fileUpload) {
  //     const query = await this.tempExperienceRepository.createQueryBuilder('tempExperience')
  //       .where('tempExperience.fileUploadId = :fileUploadId', { fileUploadId: fileUpload.id })
  //       .orderBy('tempExperience.id', 'ASC');
  //     if (options.search) {
  //       query.andWhere(new Brackets(qb => {
  //         qb.where('tempExperience.customerRefNo like :search', { search: `%${options.search}%` })
  //           .orWhere('tempExperience.accountName1 like :search', { search: `%${options.search}%` })
  //           .orWhere('tempExperience.accountName2 like :search', { search: `%${options.search}%` })
  //           .orWhere('tempExperience.address1 like :search', { search: `%${options.search}%` })
  //           .orWhere('tempExperience.address2 like :search', { search: `%${options.search}%` })
  //           .orWhere('tempExperience.city like :search', { search: `%${options.search}%` })
  //           .orWhere('tempExperience.stateCode like :search', { search: `%${options.search}%` })
  //           .orWhere('tempExperience.countryCode like :search', { search: `%${options.search}%` })
  //           .orWhere('tempExperience.phone like :search', { search: `%${options.search}%` })
  //       }))
  //     }
  //     if (options.status == TempExperienceStatus.PENDING) {
  //       query.andWhere(`tempExperience.status = '${options.status}'`, {
  //         status: TempExperienceStatus.PENDING,
  //       });
  //     }
  //     else if (options.status == TempExperienceStatus.DATAERROR) {
  //       query.andWhere(`tempExperience.status = '${options.status}'`, {
  //         status: TempExperienceStatus.DATAERROR,
  //       });
  //     }
  //     else if (options.status == TempExperienceStatus.FAIL) {
  //       query.andWhere(`tempExperience.status = '${options.status}'`, {
  //         status: TempExperienceStatus.FAIL,
  //       });
  //     }
  //     else if (options.status == TempExperienceStatus.PASS) {
  //       query.andWhere(`tempExperience.status = '${options.status}'`, {
  //         status: TempExperienceStatus.PASS,
  //       });
  //     }
  //     else if (options.status == TempExperienceStatus.MAPPED) {
  //       query.andWhere(`tempExperience.status = '${options.status}'`, {
  //         status: TempExperienceStatus.MAPPED,
  //       });
  //     }
  //     else if (options.status == TempExperienceStatus.INACTIVE) {
  //       query.andWhere(`tempExperience.status = '${options.status}'`, {
  //         status: TempExperienceStatus.INACTIVE,
  //       });
  //     }
  //     const [tempExperience, count] = await query.getManyAndCount();

  //     const date = moment(new Date()).format('MM/DD/YYYY');
  //     const customer = await this.customerRepository.findOne({
  //       where: { id: fileUpload.customerNo }
  //     })
  //     let customerName1 = customer?.name1 ? customer?.name1 : '';
  //     let customerName2 = customer?.name2 ? customer?.name2 : '';

  //     let fileDetails = customerName1 + ' ' + customerName2 + ' - ' +
  //       getCheckDigit(fileUpload.customerNo) + ' | ' + fileUpload.fileName + ' | ' + date;
  //     let account, country;
  //     if (tempExperience.length > 0) {
  //       const updatedTempExperience = await Promise.all(tempExperience.map(async (x) => {
  //         if (x.accountId !== null) {
  //           account = await this.accountRepository.findOne({
  //             where: { id: x.accountId }
  //           });
  //         }
  //         let accountName1_original = account !== undefined ? account.name_1 : null;
  //         let accountName2_original = account !== undefined ? account.name_2 : null;
  //         let address1_original = account !== undefined ? account.address_1 : null;
  //         let address2_original = account !== undefined ? account.address_2 : null;
  //         let city_original = account !== undefined ? account.city : null;
  //         let zipCode_original = account !== undefined ? account.zip_code : null;
  //         let stateCode_original = account !== undefined ? account.state : null;
  //         if (account !== undefined) {
  //           country = await this.countryRepository.findOne({
  //             where: {
  //               id: account.country
  //             }
  //           })
  //         }
  //         let countryCode_original = country !== undefined ? country.two_char_code : null;
  //         return {
  //           ...x,
  //           fileName: fileUpload.fileName,
  //           fileDetails: fileDetails,
  //           riemerNumber: x.accountId !== null ? "R" + "-" + getCheckDigit(x.accountId) : null,
  //           accountName1_original: accountName1_original,
  //           accountName2_original: accountName2_original,
  //           address1_original: address1_original,
  //           address2_original: address2_original,
  //           city_original: city_original,
  //           zipCode_original: zipCode_original,
  //           stateCode_original: stateCode_original,
  //           countryCode_original: countryCode_original,
  //         }
  //       }))
  //       console.log("BE : end");
  //       return {
  //         statusCode: HttpStatus.OK,
  //         message: `${Messages.TempExperienceModule.Found}`,
  //         totalRows: count,
  //         data: updatedTempExperience,
  //       };
  //     } else {
  //       return {
  //         statusCode: HttpStatus.NO_CONTENT,
  //         message: `${Messages.TempExperienceModule.NotFound}`,
  //       };
  //     }
  //   } else {
  //     return {
  //       statusCode: HttpStatus.NO_CONTENT,
  //       message: `${Messages.FileUploadModule.NotFound}`,
  //     };
  //   }
  // }

  async getTempExperienceByFileUploadId(fileUploadId: number, options: IFindAllTempExperience) {
    console.log("BE : start ");
    const fileUpload = await this.fileUploadRepository.findOne({ where: { id: fileUploadId } });
    if (!fileUpload) {
        return {
            statusCode: HttpStatus.NO_CONTENT,
            message: Messages.FileUploadModule.NotFound,
        };
    }

    const query = this.tempExperienceRepository.createQueryBuilder('tempExperience')
        .where('tempExperience.fileUploadId = :fileUploadId', { fileUploadId: fileUpload.id })
        .orderBy('tempExperience.id', 'ASC');

    if (options.search) {
        const searchTerm = `%${options.search.toLowerCase()}%`;
        query.andWhere(new Brackets(qb => {
            qb.where('LOWER(tempExperience.customerRefNo) like :customerRefNo', { customerRefNo: searchTerm })
              .orWhere('LOWER(tempExperience.accountName1) like :accountName1', { accountName1: searchTerm })
              .orWhere('LOWER(tempExperience.accountName2) like :accountName2', { accountName2: searchTerm })
              .orWhere('LOWER(tempExperience.address1) like :address1', { address1: searchTerm })
              .orWhere('LOWER(tempExperience.address2) like :address2', { address2: searchTerm })
              .orWhere('LOWER(tempExperience.city) like :city', { city: searchTerm })
              .orWhere('LOWER(tempExperience.stateCode) like :stateCode', { stateCode: searchTerm })
              .orWhere('LOWER(tempExperience.countryCode) like :countryCode', { countryCode: searchTerm })
              .orWhere('LOWER(tempExperience.phone) like :phone', { phone: searchTerm });
        }));
    }

    if (options.status) {
        if (options.status === "pending") {
          query.andWhere('tempExperience.status = :pending', { pending: "pending" });
          query.andWhere('tempExperience.accountId IS NULL');
        }
        else if (options.status === "mapped") {
          query.andWhere(
            '(tempExperience.status = :mapped OR (tempExperience.status = :pending AND tempExperience.accountId IS NOT NULL))', 
            { mapped: "mapped", pending: "pending" }
          );
        }
        else {
          query.andWhere('tempExperience.status = :status', { status: options.status });
        }
    }

    let sNo: number = 0;
    if (options.skip) {
      sNo = options.skip;
      query.offset(options.skip);
    };

    if (options.limit) {
      query.limit(options.limit)
    };

    if (options.sortColumn !== 'fileName' && 
      options.sortColumn !== 'fileDetails' && 
      options.sortColumn !== 'filename' && 
      options.sortColumn !== 'riemerNumber' && 
      options.sortColumn !== 'accountName1_original' && 
      options.sortColumn !== 'accountName2_original' && 
      options.sortColumn !== 'address1_original' && 
      options.sortColumn !== 'address2_original' && 
      options.sortColumn !== 'city_original' && 
      options.sortColumn !== 'zipCode_original' && 
      options.sortColumn !== 'stateCode_original' && 
      options.sortColumn !== 'countryCode_original' && 
      options.sortColumn !== undefined &&
      options.sortColumn !== '') {
      const sortType: any = options.sortType ? options.sortType.toUpperCase() : '';
      query.orderBy(`tempExperience.${options.sortColumn}`, sortType);
    }

    const [tempExperience, count] = await query.getManyAndCount();

    if (tempExperience.length === 0) {
        return {
            statusCode: HttpStatus.NO_CONTENT,
            message: Messages.TempExperienceModule.NotFound,
        };
    }

    const date = moment(new Date()).format('MM/DD/YYYY');
    const customer = await this.customerRepository.findOne({ where: { id: fileUpload.customerNo } });

    const customerName1 = customer?.name1 || '';
    const customerName2 = customer?.name2 || '';
    const fileDetails = `${customerName1} ${customerName2} - ${getCheckDigit(fileUpload.customerNo)} | ${fileUpload.fileName} | ${date}`;

    // Fetch all accounts and countries in one go to avoid multiple DB hits in the loop
    const accountIds = tempExperience.map(x => x.accountId).filter(id => id);
    console.log('accountIds');
    const batchSize = 1000; // Oracle limit
    const accountIdBatches = [];
    for (let i = 0; i < accountIds.length; i += batchSize) {
        accountIdBatches.push(accountIds.slice(i, i + batchSize));
    }

    const accounts = [];
    for (const batch of accountIdBatches) {
        const batchAccounts = await this.accountRepository.findBy({
            id: In(batch),
        });
        accounts.push(...batchAccounts);
    }
    console.log('accounts');
    const countryIds = accounts.map(acc => acc.country).filter(id => id);
    const countryIdBatches = [];
    for (let i = 0; i < countryIds.length; i += batchSize) {
        countryIdBatches.push(countryIds.slice(i, i + batchSize));
    }

    const countries = [];
    for (const batch of countryIdBatches) {
        const batchCountries = await this.countryRepository.findBy({
            id: In(batch),
        });
        countries.push(...batchCountries);
    }
    console.log('countries');
    const updatedTempExperience = tempExperience.map(x => {
      const account = accounts.find(acc => acc.id === x.accountId) || null;
      console.log('account');
      const country = account ? countries.find(c => c.id === account.country) : null;
      console.log('country');
      return {
        ...x,
        fileName: fileUpload.fileName,
        fileDetails: fileDetails,
        totalRecords: tempExperience.length,
        riemerNumber: account ? `R-${getCheckDigit(x.accountId)}` : null,
        accountName1_original: account?.name_1 || null,
        accountName2_original: account?.name_2 || null,
        address1_original: account?.address_1 || null,
        address2_original: account?.address_2 || null,
        city_original: account?.city || null,
        zipCode_original: account?.zip_code || null,
        stateCode_original: account?.state || null,
        countryCode_original: country?.two_char_code || null,
      };
    });
    // Function to sort 'data' array based on a selected column and direction
    const sortByColumn = (data, column, direction) => {
      const sortOrder = direction.toLowerCase() === 'desc' ? -1 : 1;
    
      // Sort function based on column with special handling for null values
      const sortFunction = (a, b) => {
        let aValue = a[column];
        let bValue = b[column];
    
        // Handling null values: nulls first in ascending order, last in descending order
        if (aValue === null && bValue === null) return 0;
        if (aValue === null) return -sortOrder; // Asc: null first, Desc: null last
        if (bValue === null) return sortOrder; // Asc: null first, Desc: null last
    
        // Normalizing strings to lowercase for case-insensitive comparison
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
    
        // Convert numeric strings to numbers for proper comparison
        if (typeof aValue === 'string' && !isNaN(Number(aValue))) {
          aValue = Number(aValue);
        }
        if (typeof bValue === 'string' && !isNaN(Number(bValue))) {
          bValue = Number(bValue);
        }
    
        // Numeric comparison
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return (aValue - bValue) * sortOrder;
        }
    
        // Default string comparison
        if (aValue < bValue) return -1 * sortOrder;
        if (aValue > bValue) return 1 * sortOrder;
        return 0;
      };
    
      // Sort data array using the sort function
      data.sort(sortFunction);
    };
    
    if (options.sortColumn && options.sortColumn !== '') {
      sortByColumn(updatedTempExperience, options.sortColumn, options.sortType);
    }
    
    updatedTempExperience.map((res) => {
      sNo = sNo + 1;
      res["sNo"] = sNo;
      if (res.riemerNumber && res.riemerNumber.length > 0 && res.status === "pending") {
        res.status = "mapped";
        res['isAlreadyMapped'] = true;
      }
      else {
        res['isAlreadyMapped'] = false;
      }
    });
    console.log("BE : end");
    return {
        statusCode: HttpStatus.OK,
        message: `${Messages.TempExperienceModule.Found}`,
        totalRows: count,
        data: updatedTempExperience,
    };
  }

  async getImportHistory(options: IFindAllTempExperience) {
    const query = await this.fileUploadRepository.createQueryBuilder('fileUpload')
      .leftJoinAndSelect('fileUpload.customerTemplate', 'customerTemplate');
    if (options.search) {
      const searchValue = `%${options.search.toLowerCase()}%`;
      query.andWhere('LOWER(fileUpload.fileName) like :fileName', {
        fileName: searchValue,
      });
      query.orWhere('LOWER(fileUpload.customerNo) like :customerNo', {
        customerNo: searchValue,
      });
      query.orWhere('LOWER(fileUpload.datasite) like :datasite', {
        datasite: searchValue,
      });
      query.orWhere('LOWER(fileUpload.member) like :member', {
        member: searchValue,
      });
    }
    if(options.memberIds) {
      const memberIdsArray = options.memberIds.split(',').map(id => parseInt(id.trim()));
      query.andWhere('fileUpload.customerNo IN (:...memberIds)')
         .setParameters({ memberIds: memberIdsArray });
    }
    if (options.fromDate && options.toDate) {
      query.andWhere(`TO_CHAR(CAST(fileUpload.createdDate AS DATE)) BETWEEN TO_DATE(TO_CHAR('${options.fromDate}'), 'YYYY-MM-DD') AND TO_DATE(TO_CHAR('${options.toDate}'), 'YYYY-MM-DD')`);
      // query.andWhere(`TO_CHAR(CAST(fileUpload.createdDate AS DATE)) BETWEEN '${moment(options.fromDate).format('DD-MM-YY')}' AND '${moment(options.toDate).format('DD-MM-YY')}'`);
    }

    let sNo: number = 0;
    if (options.skip) {
      sNo = options.skip;
      query.offset(options.skip);
    };

    if (options.limit) {
      query.limit(options.limit)
    };
    if (options.sortColumn !== 'customerName' && 
      options.sortColumn !== 'date' && 
      options.sortColumn !== 'filename' && 
      options.sortColumn !== 'totalRecords' && 
      options.sortColumn !== 'totalPending' && 
      options.sortColumn !== 'totalError' && 
      options.sortColumn !== 'totalActive' && 
      options.sortColumn !== 'totalInactive' && 
      options.sortColumn !== 'totalAmount' && 
      options.sortColumn !== undefined &&
      options.sortColumn !== '') {
      const sortType: any = options.sortType ? options.sortType.toUpperCase() : '';
      query.orderBy(`fileUpload.${options.sortColumn}`, sortType);
    } else if (!options.sortColumn) {
      query.orderBy('fileUpload.id', 'DESC');
    }

    // Sort by customer name column
    if (options.sortColumn === 'customerName') {
      const sortType = (options.sortType.toUpperCase() === 'ASC') ? 'ASC' : 'DESC';
      query.orderBy('fileUpload.member', sortType);
    }

    // Sort by file name column
    if (options.sortColumn === 'fileName') {
      const sortType = (options.sortType.toUpperCase() === 'ASC') ? 'ASC' : 'DESC';
      query.orderBy('fileUpload.fileName', sortType);
    }

    const [result, count] = await query.getManyAndCount();

    if (result.length > 0) {
      const data = await Promise.all(result.map(async (file) => {
        const customer = await this.customerRepository.findOne({
          where: {
            id: file.customerNo
          }
        })
        const tempExperience = await this.tempExperienceRepository.find({
          where: {
            fileUploadId: file.id
          }
        })
        let customerName1 = customer?.name1 ? customer?.name1 : '';
        let customerName2 = customer?.name2 ? customer?.name2 : '';
        return {
          ...file,
          customerName: customerName1 + " " + customerName2 + " - " + getCheckDigit(customer.id),
          date: file.createdDate,
          filename: file.fileName,
          totalRecords: tempExperience.length,
          totalPending: tempExperience.filter((temp) => { return temp.status == TempExperienceStatus.PENDING && temp.accountId === null }).length,
          totalError: tempExperience.filter((temp) => { return temp.status == TempExperienceStatus.DATAERROR }).length,
          totalActive: tempExperience.filter((temp) => { return temp.status == TempExperienceStatus.MAPPED || (temp.status == TempExperienceStatus.PENDING && temp.accountId !== null) }).length,
          totalInactive: tempExperience.filter((temp) => { return temp.status == TempExperienceStatus.INACTIVE }).length,
          invalidCount: 0,
          totalAmount: this.sumOfField(tempExperience, "totalOwing").toFixed(2),
          diff: 0,
          isDuplicate: false
        }
      }))
      // Function to sort 'data' array based on a selected column and direction
      const sortByColumn = (data, column, direction) => {
        const sortOrder = direction.toLowerCase() === 'desc' ? -1 : 1;
    
        // Sort function based on column
        const sortFunction = (a, b) => {
            let aValue = column === 'date' ? new Date(a.date) : a[column];
            let bValue = column === 'date' ? new Date(b.date) : b[column];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
              aValue = aValue.toLowerCase();
              bValue = bValue.toLowerCase();
            }

            if (typeof aValue === 'string' && !isNaN(Number(aValue))) {
              aValue = Number(aValue);
            }
            if (typeof bValue === 'string' && !isNaN(Number(bValue))) {
                bValue = Number(bValue);
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
              return (aValue - bValue) * sortOrder;
            }
    
            if (aValue < bValue) return -1 * sortOrder;
            if (aValue > bValue) return 1 * sortOrder;
            return 0;
        };
    
        // Sort data array using sort function
        data.sort(sortFunction);
      };
      if (options.sortColumn && options.sortColumn != '' && options.sortColumn !== 'customerName' && options.sortColumn !== 'fileName') {
        sortByColumn(data, options.sortColumn, options.sortType);
      }

      data.map((res) => {
        sNo = sNo + 1;
        res["sNo"] = sNo;
        res['customerIdWithCheckDigit'] = getCheckDigit(res.customerNo);
      });
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.FileUploadModule.Found}`,
        totalRows: count,
        data: data,
      };
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.FileUploadModule.NotFound}`,
      };
    }
  }

  async getPendingTradeTapeByFileUploadId(fileUploadId: number, options: IFindAllTempData) {
    const fileUpload = await this.fileUploadRepository.findOne({
      where: { id: fileUploadId },
    });
    if (fileUpload) {
      const query = this.tempDataRepository.createQueryBuilder('tempData')
        .where('tempData.fileUploadId = :fileUploadId', { fileUploadId: fileUpload.id })
        .orderBy('tempData.id', 'ASC');

      if (options.skip) query.offset(options.skip);

      if (options.limit) query.limit(options.limit);

      if (options.sortColumn) {
        const sortColumn = options.sortColumn.toLowerCase();
        query.orderBy(`LOWER(tempData.${sortColumn})`, options.sortType);
      } else {
        query.orderBy('tempData.id', 'ASC');
      }
      const [tempData, count] = await query.getManyAndCount();
      
      if (tempData && tempData.length > 0) {
        const customer = await this.customerRepository.findOne({
          where: { id: fileUpload.customerNo }
        })
        let customerName1 = customer?.name1 ? customer?.name1 : '';
        let customerName2 = customer?.name2 ? customer?.name2 : '';
        const date = moment(new Date()).format('MM/DD/YYYY');
        let fileDetails = customerName1 + ' ' + customerName2 + ' - ' + getCheckDigit(customer.id) + ' | ' + fileUpload.fileName + ' | ' + date

        const updatedTempData = await Promise.all(tempData.map(async (temp) => {
          delete temp.createdDate;
          delete temp.updatedDate;
          return {
            fileDetails: fileDetails,
            ...temp,
          }
        }))
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.TempDataModule.PendingTradeTapeFound}`,
          totalRows: count,
          data: updatedTempData,
        };
      } else {
        return {
          statusCode: HttpStatus.NO_CONTENT,
          message: `${Messages.TempDataModule.NotFound}`,
        };
      }
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.FileUploadModule.NotFound}`,
      };
    }
  }

  isDecimal(num) {
    return (num % 1);
  }

  async getHeaderTradeTapeByFileUploadId(fileUploadId: number, customerTemplateId: number) {
    const fileUpload = await this.fileUploadRepository.findOne({
      where: { id: fileUploadId },
    });
    if (fileUpload) {
      const customerTemplate = await this.customerTemplateRepository.findOne({
        where: { id: customerTemplateId },
      });
      if (!customerTemplate) {
        return {
          statusCode: 400,
          message: `${Messages.CustomerTemplateModule.InvalidCustomerTemplate}`,
        }
      }

      const tempData = await this.tempDataRepository.find({
        where: { fileUploadId: fileUploadId },
      });

      if (tempData.length > 0) {
        // const templateHeaderRow = tempData[+customerTemplate.headerRows - 1]
        const templateHeaderRow = tempData[0]
        const headerRows = (Object.keys(templateHeaderRow).map((key) => {
          if (templateHeaderRow[key] != null && key != 'id' && key != 'fileUploadId' && key != 'createdDate' && key != 'updatedDate') {
            return templateHeaderRow[key]
          }
        })).filter((x) => x != undefined);
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.TempDataModule.HeaderTradeTapeFound}`,
          data: headerRows,
        };
      } else {
        return {
          statusCode: HttpStatus.NO_CONTENT,
          message: `${Messages.TempDataModule.HeaderTradeTapeNotFound}`,
        };
      }
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.FileUploadModule.NotFound}`,
      };
    }
  }

  async tradeTapeMapping(tempExperienceId: number, accountId: number) {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
  
    // Start transaction
    await queryRunner.startTransaction();
  
    try {
      let newExperience;
      const tempExperience = await queryRunner.manager.findOne(TempExperience, {
        where: { id: tempExperienceId },
      });
      const date = moment(new Date()).format('DD-MM-YY');
  
      if (tempExperience) {
        const account = await queryRunner.manager.findOne(Account, {
          where: { id: accountId },
        });
        if (account) {
          await queryRunner.manager
            .createQueryBuilder()
            .update(TempExperience)
            .set({
              error: null,
              accountId: accountId,
              status: TempExperienceStatus.MAPPED,
            })
            .where({ id: tempExperienceId })
            .execute();
  
          //   const country = await queryRunner.manager.createQueryBuilder(Country, 'country')
          //   .where('country.two_char_code = :twoCharCode OR country.code = :code', {
          //     twoCharCode: tempExperience.countryCode,
          //     code: tempExperience.countryCode,
          //   })
          //   .getOne();
  
          // if (!country) {
          //   return {
          //     statusCode: HttpStatus.NO_CONTENT,
          //     message: `${Messages.CountryModule.NotFound}`,
          //   };
          // }

          const accountxref = {
            custRefNo: tempExperience.customerRefNo,
            account: Number(accountId),
            custNo: tempExperience.customerNo,
            dataSite: tempExperience.datasite,
            address1: account.address_1,
            address2: account.address_2,
            city: account.city,
            country: account.country,
            crc: 0,
            lastTransfer: date,
            name1: account.name_1,
            name2: account.name_2,
            state: account.state,
            zip: account.zip_code,
          };
  
          await queryRunner.manager.save(Accountxref, accountxref);

          const experience = await this.experienceRepository.createQueryBuilder("experience")
          .where("experience.account = :accountId", { accountId: tempExperience.accountId })
          .andWhere("experience.customer = :customerNo", { customerNo: tempExperience.customerNo })
          .andWhere("experience.dataSite = :datasite", { datasite: tempExperience.datasite })
          .andWhere("experience.figureDate = :figureDate", { 
            figureDate: parseInt(tempExperience.figureDate.slice(0, 7).replace(/[-/]/g, '')) 
          })
          .andWhere("experience.figureDay = :figureDay", { 
            figureDay: parseInt(tempExperience.figureDate.slice(8, 10))
          })
          .getOne();

          if (experience) {
            // Rollback the transaction in case of conflict
            await queryRunner.rollbackTransaction();
            return {
              statusCode: HttpStatus.CONFLICT,
              message: `${Messages.ExperienceModule.AlreadyExist}`,
            };
          } else {
            console.log('Shift temp-experience to experience');
            newExperience = {
              account: Number(accountId),
              customer: tempExperience.customerNo,
              figureDate: Number(tempExperience.figureDate.slice(0, 7).replace(/[-/]/g, '')),
              figureDay: Number(tempExperience.figureDate.slice(8, 10)),
              entryDate: Number(tempExperience.figureDate.replace(/[-/]/g, '')),
              openTerm1: tempExperience.open_term1,
              openTerm2: tempExperience.open_term2,
              term1: tempExperience.term1,
              term2: tempExperience.term2,
              lastSale: tempExperience.lastSaleDate !== null ? Number(tempExperience.lastSaleDate.slice(0, 3)) : 0,
              yearAccountOpened: tempExperience.yearAccountOpened !== null ? Number(tempExperience.yearAccountOpened.slice(0, 3)) : 0,
              mannerOfPayment: tempExperience.mannerOfPayment,
              highCredit: Number(tempExperience.highCredit),
              totalOwing: Number(tempExperience.totalOwing),
              current: Number(tempExperience.current),
              aging1_30: Number(tempExperience.aging1_30),
              aging31_60: Number(tempExperience.aging31_60),
              aging61_90: Number(tempExperience.aging61_90),
              agingOver90: Number(tempExperience.agingOver90),
              dispute1_30: tempExperience.dispute1_30,
              dispute31_60: tempExperience.dispute31_60,
              dispute61_90: tempExperience.dispute61_90,
              disputeOver90: tempExperience.disputeOver90,
              commentCode: tempExperience.commentCode,
              comments: tempExperience.comments,
              averageDays: Number(tempExperience.averageDays),
              dataSite: Number(tempExperience.datasite),
            };
  
            await queryRunner.manager.save(Experience, newExperience);
            console.log('successfully saved mapped record in experience');
          }

          // Commit the transaction if everything was successful
          await queryRunner.commitTransaction();
  
          const updateTempExperience = await this.tempExperienceRepository.findOne({
            where: {
              id: tempExperienceId,
              accountId: accountId,
              status: TempExperienceStatus.MAPPED,
            },
          }); 
  
          return {
            statusCode: HttpStatus.OK,
            message: `${Messages.TempExperienceModule.TradeTapeMapped}`,
            data: updateTempExperience,
          };
        } else {
          return {
            statusCode: HttpStatus.NO_CONTENT,
            message: `${Messages.AccountModule.NotFound}`,
          };
        }
      } else {
        return {
          statusCode: HttpStatus.NO_CONTENT,
          message: `${Messages.TempExperienceModule.NotFound}`,
        };
      }
    } catch (error) {
      // Rollback the transaction in case of error
      console.error('Transaction failed', error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release the queryRunner
      await queryRunner.release();
    }
  }

  sumOfField(jsonArray: any, fieldName: string): number {
    //&& typeof obj[fieldName] === 'number'
    let sum = 0;
    for (const obj of jsonArray) {
      if (obj[fieldName] !== undefined) {
        sum += +obj[fieldName];
      }
    }
    return sum;
  }

  async updateTradeTapeByFileUploadId(fileUploadId: number, request: FigureDateDto) {
    const file = await this.fileUploadRepository.findOne({
      where: { id: fileUploadId }
    })
    if (file) {
      // Checking if figure date is already exists in the Experience table for respective customer
      let dateParts = request.figureDate.split('/');
      let yearMonth = dateParts[0] + dateParts[1];  // Combine YYYY and MM
      let day = dateParts[2];

      const experienceData = await this.experienceRepository.createQueryBuilder("experience")
        .andWhere("experience.customer = :customer", { customer: Number(request.customer) })
        .andWhere("experience.figureDay = :day", { day: Number(day) })
        .andWhere("experience.figureDate = :figureDate", {
          figureDate: parseInt(yearMonth)
        })
        .getOne();
      if (experienceData) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'FigureDate is already exists in experience table'
        };
      }

      // Updating the figure date in Experience table for respective customer
      let currentDateParts = request.currentDate.split('/');
      let currentYearMonth = currentDateParts[0] + currentDateParts[1];  // Combine YYYY and MM
      let currentDay = currentDateParts[2];

      try {
        await this.experienceRepository.createQueryBuilder()
        .update(Experience)
        .set({ figureDate: parseInt(yearMonth), figureDay: parseInt(day) })
        .where("customer = :customer", { customer: Number(request.customer) })
        .andWhere("figureDate = :yearMonth", { yearMonth: parseInt(currentYearMonth) })
        .andWhere("figureDay = :day", { day: Number(currentDay) })
        .execute();
      } catch (error) {
        console.log("ERROR IN EXPERIENCE TABLE UPDATION");
        console.log("ERROR : ", error);
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'FigureDate is already exists in experience table'
        };
      }
      
      // update figure-date and replace figure-date validation
      await this.tempExperienceRepository.createQueryBuilder()
        .update(TempExperience)
        .set({
          figureDate: request.figureDate,
          warning: () => {
            return `CASE 
              WHEN "warning" LIKE '%Different figure dates available in a file,%' 
                OR "warning" LIKE '%Figuredate is older than 30 days,%' 
              THEN REPLACE(REPLACE("warning", 'Different figure dates available in a file,', ''), 'Figuredate is older than 30 days,', '')
                ELSE "warning"
              END`;
          }
        })
        .where({ fileUploadId: fileUploadId })
        // .andWhere('status != :statusInactive', { statusInactive: TempExperienceStatus.INACTIVE })
        .execute();

      // set result and status
      await this.tempExperienceRepository.createQueryBuilder()
        .update(TempExperience)
        .set({
          status: TempExperienceStatus.PENDING,
          result: TempExperienceStatus.PASS
        })
        .where({ fileUploadId: fileUploadId, error: IsNull() })
        .andWhere({ status: Not('mapped') })
        .andWhere({ status: Not('inactive') })
        .execute();

      const result = await this.tempExperienceRepository.find({
        where: { fileUploadId: fileUploadId }
      });
      
      // Update figure date in the fileupload table
      await this.fileUploadRepository.createQueryBuilder()
        .update(FileUpload)
        .set({ dateOfFigures: request.figureDate })
        .where({ id: fileUploadId })
        .execute();

      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.TempExperienceModule.Updated}`,
        data: result
      }
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.FileUploadModule.NotFound}`
      }
    }
  }

  async deleteTradeTapeByFileUploadId(fileUploadId: number) {
    const file = await this.fileUploadRepository.findOne({
      where: { id: fileUploadId }
    })
    if (file) {
      // delete
      await this.tempExperienceRepository.createQueryBuilder()
        .delete()
        .from(TempExperience)
        .where({ fileUploadId: fileUploadId })
        .execute();
      await this.tempDataRepository.createQueryBuilder()
        .delete()
        .from(TempData)
        .where({ fileUploadId: fileUploadId })
        .execute();
      await this.fileUploadRepository.createQueryBuilder()
        .delete()
        .from(FileUpload)
        .where({ id: fileUploadId })
        .execute();
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.TempExperienceModule.TradeTapeDeleted}`,
      }
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.FileUploadModule.NotFound}`
      }
    }
  }

  async getUnMatchedColumnsByFileUploadId(fileUploadId: number) {
    const unMatchedColumns = await this.fileUploadRepository.createQueryBuilder('file')
    .select(['file.id', 'file.unmatchedColumns'])
    .where({id: fileUploadId})
    .getOne();
    if(unMatchedColumns.unmatchedColumns) {
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.TempExperienceModule.UnMatchedColumns}`,
        data: unMatchedColumns
      }
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.FileUploadModule.NotFound}`
      }
    }
  }

  async deleteTemplateColumnById(templateStructureId, req) {
    const templateStructure = await this.templateStructureRepository.findOne({
        where: {
            id: templateStructureId
        }
    });

    if (!templateStructure) {
        return {
          statusCode: HttpStatus.NO_CONTENT,
          message: `${Messages.TempExperienceModule.NotFound}`
        }
    }

    let columns = JSON.parse(templateStructure.templateColumnName.replace(/'/g, '"'));

    columns = columns.filter(column => column !== req.templateColumnName);

    templateStructure.templateColumnName = JSON.stringify(columns);
    return {
      statusCode: HttpStatus.OK,
      message: `${Messages.TempExperienceModule.DeleteTemplateColumnName}`,
      data: templateStructure
    }
}


  // async validationCheckedEmptyRowsAndDataTypeONHold(fileUploadId: number) {
  //   const isNumberOnly = /[0-9]/g; 
  //   const isCharacterOnly = /^[a-zA-Z ]*$/;
  //   const isDecimalOnly = /^-?\d+(\.\d{1,20})?$/;
  //   const isDate = /^(\d{4})(\/|-)(\d{1,2})(\/|-)(\d{1,2})$/;
  //   const isEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  //   let mandatory, integer, character, date, decimal, email;
  //   let mandatoryCoulmns = [], integerColumns = [], characterColumns = [],
  //   dateColumns = [], decimalColumns = [], emailColumns = [];
  //   const rows = await this.tempExperienceRepository.find({
  //     where: { fileUploadId: fileUploadId}
  //   })
  //   const templateConfigData = await this.customerTemplateRepository.find({
  //     where: {customerId: rows[0].customerNo}
  //   })
  //   for(let templateConfig of templateConfigData) {
  //     delete templateConfig.id;
  //     delete templateConfig.customerId;
  //     delete templateConfig.headerRows;
  //     delete templateConfig.skipRows;
  //     delete templateConfig.skipColumns;
  //     delete templateConfig.createdDate;
  //     delete templateConfig.updatedDate;
  //     for(let [key, value] of Object.entries(templateConfig)) {
  //       JSON.parse(value as string)?.filter((item) => {
  //         mandatory = item.Validation.map((x) => {
  //           if(x == 'mandatory') {
  //             return key;
  //           }
  //         })
  //         integer = item.Validation.map((x) => {
  //           if(x == 'integer') {
  //             return key;
  //           }
  //         })
  //         character = item.Validation.map((x) => {
  //           if(x == 'character') {
  //             return key;
  //           }
  //         })
  //         date = item.Validation.map((x) => {
  //           if(x == 'date') {
  //             return key;
  //           }
  //         })
  //         decimal = item.Validation.map((x) => {
  //           if(x == 'decimal') {
  //             return key;
  //           }
  //         })
  //         email = item.Validation.map((x) => {
  //           if(x == 'email') {
  //             return key;
  //           }
  //         })
  //       })
  //       if(!mandatoryCoulmns.includes(mandatory[0])) {
  //         mandatoryCoulmns.push(mandatory[0]);
  //       }
  //       if(!integerColumns.includes(integer[0])) {
  //         integerColumns.push(integer[0]);
  //       }
  //       if(!characterColumns.includes(character[0])) {
  //         characterColumns.push(character[0]);
  //       }
  //       if(!dateColumns.includes(date[0])) {
  //         dateColumns.push(date[0]);
  //       }
  //       if(!decimalColumns.includes(decimal[0])) {
  //         decimalColumns.push(decimal[0]);
  //       }
  //       if(!emailColumns.includes(email[0])) {
  //         emailColumns.push(email[0]);
  //       }
  //     }
  //   }
  //     for(let x of mandatoryCoulmns) {
  //       if(x !== undefined) {
  //         await this.tempExperienceRepository.createQueryBuilder()
  //         .update(TempExperience)
  //         .set({error: () => `CONCAT(ifnull(error, ''), '${x} should be mandatory,')`})
  //         .where({fileUploadId: fileUploadId, [x] : IsNull()})
  //         .execute();
  //       }
  //     }
  //     for(let row of rows) {
  //       for(let x of integerColumns) {
  //         if(x !== undefined) {
  //           let keys = row?.[x];
  //           if(!Number(keys)) {
  //             await this.tempExperienceRepository.createQueryBuilder()
  //             .update(TempExperience)
  //             .set({error: () => `CONCAT(ifnull(error, ''), '${x} should be integer type only,')`})
  //             .where({id: row.id})
  //             .execute();
  //           }   
  //         }
  //       }
  //       for(let x of characterColumns) {
  //         if(x !== undefined) {
  //           let keys = row?.[x];
  //           if(!isCharacterOnly.test(keys)) {
  //             await this.tempExperienceRepository.createQueryBuilder()
  //             .update(TempExperience)
  //             .set({error: () => `CONCAT(ifnull(error, ''), '${x} should be character type only,')`})
  //             .where({id: row.id})
  //             .execute();
  //           }
  //         }
  //       }
  //       for(let x of dateColumns) {
  //         if(x !== undefined) {
  //           let keys = row?.[x];
  //           if(!isDate.test(keys)) {
  //             await this.tempExperienceRepository.createQueryBuilder()
  //             .update(TempExperience)
  //             .set({error: () => `CONCAT(ifnull(error, ''), '${x} should be date type only,')`})
  //             .where({id: row.id})
  //             .execute();
  //           }
  //         }
  //       }
  //       for(let x of decimalColumns) {
  //         if(x !== undefined) {
  //           let keys = row?.[x];
  //           if(!isDecimalOnly.test(keys)) {
  //             await this.tempExperienceRepository.createQueryBuilder()
  //             .update(TempExperience)
  //             .set({error: () => `CONCAT(ifnull(error, ''), '${x} should be decimal type only,')`})
  //             .where({id: row.id})
  //             .execute();
  //           }
  //         }
  //       }
  //       for(let x of emailColumns) {
  //         if(x !== undefined) {
  //           let keys = row?.[x];
  //           if(!isEmail.test(keys)) {
  //             await this.tempExperienceRepository.createQueryBuilder()
  //             .update(TempExperience)
  //             .set({error: () => `CONCAT(ifnull(error, ''), '${x} should be in email format,')`})
  //             .where({id: row.id})
  //             .execute();
  //           }
  //         }
  //       }

  //       const account = await this.accountRepository.createQueryBuilder('account')
  //       .where({name_1: row.accountName1})
  //       .andWhere({address_1: row.address1})
  //       .andWhere({city: row.city})
  //       .andWhere({zip_code: row.zipCode})
  //       .andWhere({state: row.stateCode})
  //       .getOne();
  //       if(!account) {
  //         await this.tempExperienceRepository.createQueryBuilder()
  //         .update(TempExperience)
  //         .set({error: () => `CONCAT(ifnull(error, ''), 'account does not exist,')`})
  //         .where({id: row.id})
  //         .execute();
  //       }

  //       const country = await this.countryRepository.createQueryBuilder('country')
  //       .where({two_char_code: row.countryCode})
  //       .getOne();
  //       if(!country) {
  //         await this.tempExperienceRepository.createQueryBuilder()
  //         .update(TempExperience)
  //         .set({error: () => `CONCAT(ifnull(error, ''), 'country does not exist,')`})
  //         .where({id: row.id})
  //         .execute();
  //       }

  //       const state = await this.stateRepository.createQueryBuilder('state')
  //       .where({code: row.stateCode})
  //       .getOne();
  //       if(!state) {
  //         await this.tempExperienceRepository.createQueryBuilder()
  //         .update(TempExperience)
  //         .set({error: () => `CONCAT(ifnull(error, ''), 'state does not exist,')`})
  //         .where({id: row.id})
  //         .execute();
  //       }
  //     }

  //     const updatedTempExperience = await this.tempExperienceRepository.find({
  //       where: {fileUploadId: fileUploadId}
  //     });

  //     for(let row of updatedTempExperience) {
  //       if(!row.error) {
  //         await this.tempExperienceRepository.createQueryBuilder()
  //           .update(TempExperience)
  //           .set({ result: TempExperienceStatus.PASS })
  //           .where({ id: row.id })
  //           .execute();
  //       } else {
  //         await this.tempExperienceRepository.createQueryBuilder()
  //           .update(TempExperience)
  //           .set({ result: TempExperienceStatus.FAIL, status: TempExperienceStatus.DATAERROR })
  //           .where({ id: row.id })
  //           .execute();
  //       }
  //     }
  // }

  // async validateTemplateOld(fileUploadId: number, customerTemplateId?: number) {
  //   let templateHeaderRow;
  //   let result;
  //   let validate = false;
  //   const file = await this.fileUploadRepository.findOne({
  //     where: {id: fileUploadId}
  //   })
  //   if(!file) {
  //     return {
  //       statusCode: HttpStatus.NO_CONTENT,
  //       message: `${Messages.FileUploadModule.NotFound}`,
  //     }
  //   }
  //   const query = await this.customerTemplateRepository.createQueryBuilder('customerTemplate')
  //   .where({customerId: String(file.customerNo)});
  //   if(customerTemplateId) {
  //     query.andWhere('customerTemplate.id = :customerTemplateId', { customerTemplateId: customerTemplateId})
  //   }
  //   const customerTemplateData = await query.getMany();

  //   const tempData = await this.tempDataRepository.find({
  //     where: {fileUploadId: fileUploadId}
  //   })


  //   let temp5Data = await this.tempDataRepository.find({
  //     where: {
  //       fileUploadId: fileUploadId,
  //     },
  //     take: 5,
  //   });

  //     if(customerTemplateData.length == 0) {
  //       await this.fileUploadRepository.update(fileUploadId, {status: FileUploadStatus.NOTEMPLATE});
  //       console.log("******6.a. if template not available -> RESPONSE******");
  //       return {
  //         statusCode: HttpStatus.NO_CONTENT,
  //         message: `Configuration not added for the customer`,
  //         data: {
  //           fileUploadId: fileUploadId,
  //           templateData: temp5Data
  //         }
  //       }
  //     } else if (customerTemplateData.length > 0) {
  //       for (let customerTemplate of customerTemplateData) {
  //         let newCustomerTemplateData = JSON.parse(
  //           JSON.stringify(customerTemplate),
  //         );

  //         let updatedTempData = JSON.parse(
  //           JSON.stringify(tempData),
  //         );
  //         //skip-columns
  //         const skipColumn = customerTemplate.skipColumns.split(',').map(x => +x);
  //         if(skipColumn[0] > 0) {
  //           for (let x of skipColumn) {
  //             let temp: any;
  //             for (temp of updatedTempData) {
  //               delete temp.id;
  //               temp[(Object.keys(temp))[x - 1]] = 'eloped'
  //               temp = updatedTempData
  //             }
  //           }
  //         }

  //         updatedTempData.forEach((obj) => {
  //           Object.keys(obj).forEach((x: any) => {
  //             if (obj[x] == 'eloped') {
  //               delete obj[x];
  //             }
  //           })
  //         });

  //         if (+customerTemplate.headerRows - 1 >= 0) {
  //           //1. getting header row
  //           templateHeaderRow = updatedTempData.slice(
  //             +customerTemplate.headerRows - 1,
  //             +customerTemplate.headerRows,
  //           )[0];



  //           // skip-rows
  //           const skipRow = customerTemplate.skipRows.split(',').map((x) => +x);
  //           if(skipRow[0] > 0) {
  //             for (let x of skipRow) {
  //               if (updatedTempData[x - 1]) {
  //                 for (let temp in updatedTempData[x - 1]) {
  //                   updatedTempData[x - 1][temp] = 'eloped';
  //                 }
  //               }
  //             }
  //           }
  //           let newTempData = updatedTempData.slice(
  //             Number(newCustomerTemplateData.headerRows),
  //           );
  //           const templateDataRow = newTempData.filter((x) => x.column1 !== 'eloped');


  //           //2. replacing header row value as 'eloped' for not needed columns
  //           Object.keys(templateHeaderRow).forEach((key) => {              
  //             if (
  //               templateHeaderRow[key] === null ||
  //               key == 'id' ||
  //               key == 'fileUploadId' ||
  //               key == 'createdDate' ||
  //               key == 'updatedDate' ||
  //               templateHeaderRow[key].startsWith('Column')
  //             ) {
  //               templateHeaderRow[key] = 'eloped';
  //               }
  //           });

  //           const templateColumn = Object.values(templateHeaderRow).map(
  //             (value) => {if(value !== 'eloped') {
  //               return value.toString().trim();
  //             }}
  //           ).filter((value) => value!== undefined );
  //           if (
  //             customerTemplate?.customerRefNo ||
  //             customerTemplate?.accountName1 ||
  //             customerTemplate?.accountName2 ||
  //             customerTemplate?.address1 ||
  //             customerTemplate?.address2 ||
  //             customerTemplate?.city ||
  //             customerTemplate?.zipCode ||
  //             customerTemplate?.stateCode ||
  //             customerTemplate?.countryCode ||
  //             customerTemplate?.phone ||
  //             customerTemplate?.figureDate ||
  //             customerTemplate?.lastSaleDate ||
  //             customerTemplate?.yearAccountOpened ||
  //             customerTemplate?.term1 ||
  //             customerTemplate?.term2 ||
  //             customerTemplate?.open_term1 ||
  //             customerTemplate?.open_term2 ||
  //             customerTemplate?.highCredit ||
  //             customerTemplate?.totalOwing ||
  //             customerTemplate?.current ||
  //             customerTemplate?.dating ||
  //             customerTemplate?.aging1_30 ||
  //             customerTemplate?.aging31_60 ||
  //             customerTemplate?.aging61_90 ||
  //             customerTemplate?.agingOver90 ||
  //             customerTemplate?.dispute1_30 ||
  //             customerTemplate?.dispute31_60 ||
  //             customerTemplate?.dispute61_90 ||
  //             customerTemplate?.disputeOver90 ||
  //             customerTemplate?.averageDays ||
  //             customerTemplate?.mannerOfPayment ||
  //             customerTemplate?.contact ||
  //             customerTemplate?.contactJobTitle ||
  //             customerTemplate?.contactTelephone ||
  //             customerTemplate?.contactEmail ||
  //             customerTemplate?.commentCode ||
  //             customerTemplate?.comments
  //           ) {

  //             const templateColumnName = [customerTemplate]?.map((temp: any) => {
  //               delete temp.id;
  //               delete temp.customerId;
  //               delete temp.headerRows;
  //               delete temp.skipRows;
  //               delete temp.skipColumns;
  //               delete temp.createdDate;
  //               delete temp.updatedDate;
  //               return Object.values(temp)?.map((values: any) => {
  //                 return JSON.parse(values)?.map((x) => {
  //                   return x.TemplateColumnName;
  //                 });
  //               });
  //             });

  //             let templateColumnNameMapped = templateColumnName[0].flatMap((x) => String(x).trim()).filter((x) => String(x) !== 'undefined');
  //             if (this.areArraysIdentical(templateColumn, templateColumnNameMapped)) {
  //               console.log(
  //                 '******6.b.b1. if matched, import data from tempData to tempExperience -> RESPONSE success******',
  //               );

  //               // let templateDataRow = newTempData.slice(
  //               //   Number(newCustomerTemplateData.headerRows),
  //               // );

  //               const tempExperienceData = this.replaceKeysInArray(
  //                 templateDataRow,
  //                 templateHeaderRow,
  //               );

  //               tempExperienceData.forEach((obj) => {
  //                 delete obj['eloped'];
  //               });

  //               const transformedObject: { [key: string]: string } = {};

  //               [newCustomerTemplateData].forEach((temped) => {
  //                 delete temped.id;
  //                 delete temped.customerId;
  //                 delete temped.headerRows;
  //                 delete temped.skipRows;
  //                 delete temped.skipColumns;
  //                 delete temped.createdDate;
  //                 delete temped.updatedDate;
  //                 for (let [key, value] of Object.entries(temped)) {
  //                   JSON.parse(value as string)?.flatMap((item) => {
  //                     transformedObject[item.TemplateColumnName] = key;
  //                   });
  //                 }
  //               });

  //               const tempExperienceData1 = this.replaceKeysInArray(
  //                 tempExperienceData,
  //                 transformedObject,
  //               );

  //               const remainingColumns = {
  //                 customerNo: file.customerNo,
  //                 fileUploadId: fileUploadId,
  //                 status: TempExperienceStatus.PENDING,
  //               };

  //               tempExperienceData1.forEach((obj) => {
  //                 obj.figureDate == undefined
  //                   ? undefined
  //                   : moment(obj.figureDate).format('MM/DD/YYYY')
  //                     ? (obj['figureDate'] = moment(obj.figureDate)
  //                       .utcOffset(9)
  //                       .format('YYYY-MM-DD'))
  //                     : obj.figureDate;
  //                 Object.assign(obj, remainingColumns);
  //               });

  //               if(file.status !== FileUploadStatus.APPROVED) {
  //                 result = await this.tempExperienceRepository.save(
  //                   tempExperienceData1,
  //                   { chunk: 55 },
  //                 );

  //                 await this.fileUploadRepository
  //                   .createQueryBuilder()
  //                   .update(FileUpload)
  //                   .set({ status: FileUploadStatus.APPROVED })
  //                   .where({ id: fileUploadId })
  //                   .execute();
  //               }
  //               this.validationCheckedEmptyRowsAndDataType(fileUploadId);

  //               validate = true;
  //               if(validate == true) {
  //                 break;
  //               };
  //             }
  //           }
  //         }
  //       }

  //       if(!validate) {
  //         console.log('******6.b.b2. if not matched -> RESPONSE******');
  //         await this.fileUploadRepository.update(fileUploadId, { status: FileUploadStatus.TEMPLATEMISMATCH });
  //         return {
  //           statusCode: HttpStatus.NO_CONTENT,
  //           message: `${Messages.TempDataModule.TemplateSettingNotMatched}`,
  //         };
  //       } 
  //       else {
  //         return {
  //           statusCode: HttpStatus.OK,
  //           message: `${Messages.TempDataModule.TemplateSettingMatched}`
  //         }
  //       } 
  //     }
  // }
}
