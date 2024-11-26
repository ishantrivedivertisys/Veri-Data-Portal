import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCustomerTemplateDto } from './dto/request/create-customer-template.dto';
import { UpdateCustomerTemplateDto } from './dto/request/update-customer-template.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerTemplate } from './entities/customer-template.entity';
import { Repository } from 'typeorm';
import { Messages } from 'src/common/constants/messages';
import { TEMPLATECONFIG } from 'src/common/constants/template.config';
import { TempExperienceService } from 'src/temp-experience/temp-experience.service';
import { FileUpload } from 'src/file-upload/entities/fileUpoad.entity';

@Injectable()
export class CustomerTemplateService {
  constructor(
    @InjectRepository(CustomerTemplate) private customerTemplateRepository: Repository<CustomerTemplate>,
    @InjectRepository(FileUpload) private fileUploadRepository: Repository<FileUpload>,
    private tempExperienceService: TempExperienceService
  ) {}
  async create(request: CreateCustomerTemplateDto) {
    try {
      if (!request.customerRefNo || request.customerRefNo == null || request.customerRefNo == '') {
        throw new BadRequestException(`${Messages.CustomerTemplateModule.Create.CustomerRefNo}`)
      }
      if (!request.accountName1 || request.accountName1 == null || request.accountName1 == '') {
        throw new BadRequestException(`${Messages.CustomerTemplateModule.Create.AccountName1}`)
      }
      if (!request.address1 || request.address1 == null || request.address1 == '') {
        throw new BadRequestException(`${Messages.CustomerTemplateModule.Create.Address1}`)
      }
      if (!request.city || request.city == null || request.city == '') {
        throw new BadRequestException(`${Messages.CustomerTemplateModule.Create.City}`)
      }
      // if (!request.zipCode || request.zipCode == null || request.zipCode == '') {
      //   throw new BadRequestException(`${Messages.CustomerTemplateModule.Create.ZipCode}`)
      // }
      if (request.countryCode && (request.countryCode == 'US' || request.countryCode == 'CA')) {
        if (!request.stateCode || request.stateCode == null || request.stateCode == '') {
          throw new BadRequestException(`${Messages.CustomerTemplateModule.Create.StateCode}`)
        }
      }
      // if (!request.stateCode || request.stateCode == null || request.stateCode == '') {
      //   throw new BadRequestException(`${Messages.CustomerTemplateModule.Create.StateCode}`)
      // }
      // if (!request.figureDate || request.figureDate == null || request.figureDate == '') {
      //   throw new BadRequestException(`${Messages.CustomerTemplateModule.Create.FigureDate}`)
      // }
      if (!request.aging1_30 || request.aging1_30 == null || request.aging1_30 == '') {
        throw new BadRequestException(`${Messages.CustomerTemplateModule.Create.Aging1_30}`)
      }
      if (!request.aging31_60 || request.aging31_60 == null || request.aging31_60 == '') {
        throw new BadRequestException(`${Messages.CustomerTemplateModule.Create.Aging31_60}`)
      }
      if (!request.aging61_90 || request.aging61_90 == null || request.aging61_90 == '') {
        throw new BadRequestException(`${Messages.CustomerTemplateModule.Create.Aging61_90}`)
      }
      if(request.customerRefNo?.includes('+') || 
        request.accountName1?.includes('+') || 
        request.accountName2?.includes('+') || 
        request.address1?.includes('+') ||
        request.address2?.includes('+') ||
        request.city?.includes('+') || 
        request.zipCode?.includes('+') || 
        request.stateCode?.includes('+') || 
        request.countryCode?.includes('+') ||
        request.phone?.includes('+') ||
        request.figureDate?.includes('+') || 
        request.lastSaleDate?.includes('+') || 
        request.yearAccountOpened?.includes('+') || 
        request.term1?.includes('+') ||
        request.term2?.includes('+') ||
        request.open_term1?.includes('+') || 
        request.open_term2?.includes('+') || 
        request.highCredit?.includes('+') || 
        request.totalOwing?.includes('+') ||
        request.current?.includes('+') ||
        request.dating?.includes('+') || 
        request.dispute1_30?.includes('+') || 
        request.dispute31_60?.includes('+') || 
        request.dispute61_90?.includes('+') ||
        request.disputeOver90?.includes('+') ||
        request.averageDays?.includes('+') || 
        request.mannerOfPayment?.includes('+') || 
        request.contact?.includes('+') || 
        request.contactJobTitle?.includes('+') ||
        request.contactTelephone?.includes('+') ||
        request.contactEmail?.includes('+') || 
        request.commentCode?.includes('+') || 
        request.comments?.includes('+') || 
        request.currencies?.includes('+'))
      {
        throw new BadRequestException('Allow multi-select for dollar columns only');
      }
      const result = await this.customerTemplateRepository.save(request);
      const fileUpload = await this.fileUploadRepository.findOne({
        where: {customerNo: result.customerId},
        order: { id: 'DESC' }
      })
      
      if(request.isVerified == true) {
        this.tempExperienceService.validateTemplate(fileUpload.id);
      };
      if(result) {
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.CustomerTemplateModule.Created}`,
          data: result
        }
      }
    } catch(err) {
      throw err;
    }
  }

  async findAll() {
    const result = await this.customerTemplateRepository.find();

    if (result.length > 0) {
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.CustomerTemplateModule.Found}`,
        data: result,
      };
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.CustomerTemplateModule.NotFound}`,
      };
    }
  }

  async findOne(customerTemplateId: number) {
    try {
      const result = await this.customerTemplateRepository.findOne({
        where: { id: customerTemplateId }
      });
      if(result) {
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.CustomerTemplateModule.Found}`,
          data: result
        }
      } else {
        return {
          statusCode: HttpStatus.NO_CONTENT,
          message: `${Messages.CustomerTemplateModule.NotFound}`,
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async update(customerTemplateId: number, request: UpdateCustomerTemplateDto) {
    const customerTemplate = await this.customerTemplateRepository.findOne({
      where: {id: customerTemplateId}
    })
    if(customerTemplate) {
      if(request.customerRefNo?.includes('+') || 
        request.accountName1?.includes('+') || 
        request.accountName2?.includes('+') || 
        request.address1?.includes('+') ||
        request.address2?.includes('+') ||
        request.city?.includes('+') || 
        request.zipCode?.includes('+') || 
        request.stateCode?.includes('+') || 
        request.countryCode?.includes('+') ||
        request.phone?.includes('+') ||
        request.figureDate?.includes('+') || 
        request.lastSaleDate?.includes('+') || 
        request.yearAccountOpened?.includes('+') || 
        request.term1?.includes('+') ||
        request.term2?.includes('+') ||
        request.open_term1?.includes('+') || 
        request.open_term2?.includes('+') || 
        request.highCredit?.includes('+') || 
        request.totalOwing?.includes('+') ||
        request.current?.includes('+') ||
        request.dating?.includes('+') || 
        request.dispute1_30?.includes('+') || 
        request.dispute31_60?.includes('+') || 
        request.dispute61_90?.includes('+') ||
        request.disputeOver90?.includes('+') ||
        request.averageDays?.includes('+') || 
        request.mannerOfPayment?.includes('+') || 
        request.contact?.includes('+') || 
        request.contactJobTitle?.includes('+') ||
        request.contactTelephone?.includes('+') ||
        request.contactEmail?.includes('+') || 
        request.commentCode?.includes('+') || 
        request.comments?.includes('+') || 
        request.currencies?.includes('+'))
      {
        throw new BadRequestException('Allow multi-select for dollar columns only');
      }
      const verified = request.isVerified;
      delete request.isVerified
      await this.customerTemplateRepository.update(customerTemplateId, request);
      const result = await this.customerTemplateRepository.findOne({
        where: {
          id: customerTemplateId
        }
      });
      const fileUpload = await this.fileUploadRepository.findOne({
        where: {customerNo: result.customerId},
        order: { id: 'DESC' }
      })
      if(verified == true) {
        this.tempExperienceService.validateTemplate(fileUpload.id);
      };
      if(result) {
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.CustomerTemplateModule.Updated}`,
          data: result
        }
      }
    }
    else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.CustomerTemplateModule.NotFound}`,
      }
    }
  }

  async remove(customerTemplateId: number) {
    const deletedCustomerTemplate = await this.customerTemplateRepository.findOne({
      where: {
        id: customerTemplateId
      }
    });
    if(deletedCustomerTemplate) {
      await this.customerTemplateRepository.delete(customerTemplateId);
      return {       
        statusCode: HttpStatus.OK,
        message: `${Messages.CustomerTemplateModule.Deleted}`,
        data: deletedCustomerTemplate
      };
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.CustomerTemplateModule.NotFound}`,
      }
    }
  }

  async getDBTemplateFields() {
    const templateTableName = [
      "customerRefNo",
      "accountName1",
      "accountName2",
      "address1",
      "address2",
      "city",
      "zipCode",
      "stateCode",
      "countryCode",
      "phone",
      "currencies",
      "figureDate",
      "lastSaleDate",
      "yearAccountOpened",
      "term1",
      "term2",
      "open_term1",
      "open_term2",
      "highCredit",
      "totalOwing",
      "current",
      "dating",
      "aging1_30",
      "aging31_60",
      "aging61_90",
      "agingOver90",
      "dispute1_30",
      "dispute31_60",
      "dispute61_90",
      "disputeOver90",
      "averageDays",
      "mannerOfPayment",
      "contact",
      "contactJobTitle",
      "contactTelephone",
      "contactEmail",
      "commentCode",
      "comments",
    ]
    return {
      statusCode: HttpStatus.OK,
      message: `Temp table fields...`,
      TemplateConfig: templateTableName
    };
  }

  async getByCustomerNumber(customerNo: number) {
    const result = await this.customerTemplateRepository.find({
      where: {customerId: customerNo}
    })
    if(result) {
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.CustomerTemplateModule.Found}`,
        data: result
      }
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.CustomerTemplateModule.NotFound}`,
      }
    }
  }

  // async getHeaderByHeaderRowNo(headerRows: number) {
  //   try {
  //     const result = await this.customerTemplateRepository.findOne({
  //       where: { headerRows: headerRows }
  //     });
  //     if(result) {
  //       return {
  //         statusCode: HttpStatus.OK,
  //         message: `${Messages.CustomerTemplateModule.Found}`,
  //         data: result
  //       }
  //     } else {
  //       return {
  //         statusCode: HttpStatus.NO_CONTENT,
  //         message: `${Messages.CustomerTemplateModule.NotFound}`,
  //       }
  //     }
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
