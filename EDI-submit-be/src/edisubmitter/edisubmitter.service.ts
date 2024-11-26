import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateEdisubmitterDto } from './dto/request/create-edisubmitter.dto';
import { UpdateEdisubmitterDto } from './dto/request/update-edisubmitter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Edisubmitter } from './entities/edisubmitter.entity';
import { Brackets, DataSource, QueryRunner, Repository } from 'typeorm';
import { Messages } from 'src/common/constants/messages';
import { IFindAllEdisubmitter } from './interface/edisubmitter.find';

@Injectable()
export class EdisubmitterService {
  constructor(
    @InjectRepository(Edisubmitter) private ediSubmitterRepository: Repository<Edisubmitter>,
    private dataSource: DataSource
  ) {}
  
  async create(request: CreateEdisubmitterDto) {
    try {
      let result, updatedResult;
      const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
      const ediSubmitter = await this.ediSubmitterRepository.findOne({
        where: {
          customer: request.customer,
          datasite: request.datasite
        }
      })
      if(ediSubmitter) {
        await this.ediSubmitterRepository.update(ediSubmitter.id, request);
        result = await this.ediSubmitterRepository.findOne({
          where: {id: ediSubmitter.id}
        })
        if(result) {
          updatedResult = {
            statusCode: HttpStatus.OK,
            message: `${Messages.EdiSubmitterModule.Updated}`,
            data: result
          }
        }
      } else {
        const edisubmit = await queryRunner.manager.query(`SELECT EDISUBMITTER_SEQ.nextval FROM dual`);
        const nextVal = edisubmit[0]?.NEXTVAL;
        request.id = nextVal;
        result = await this.ediSubmitterRepository.save(request);
        if(result) {
          updatedResult = {
            statusCode: HttpStatus.OK,
            message: `${Messages.EdiSubmitterModule.Created}`,
            data: result
          }
        }
      }
      
      if(result) {
        return updatedResult;
      }
    } catch(err) {
      throw err;
    }
  }

  async findAll(options: IFindAllEdisubmitter) {
    const query = await this.ediSubmitterRepository.createQueryBuilder('ediSubmitter')
    .leftJoinAndSelect('ediSubmitter.customers', 'customers')
    .leftJoinAndSelect('ediSubmitter.datasites', 'datasites');
  
    if (options.search) {
      const searchTerm = `%${options.search}%`;
      query.andWhere(new Brackets(qb => {
        qb.where('ediSubmitter.customer like :customer', { customer: searchTerm })
          .orWhere('ediSubmitter.datasite like :datasite', { datasite: searchTerm })
          .orWhere('ediSubmitter.firstTransfer like :firstTransfer', { firstTransfer: searchTerm })
          .orWhere('ediSubmitter.lastTransfer like :lastTransfer', { lastTransfer: searchTerm })
      }));
    }

    if (options.skip) query.offset(options.skip);

    if (options.limit) query.limit(options.limit);

    if (options.sortColumn) {
      query.orderBy(`ediSubmitter.${options.sortColumn}`, options.sortType);
    }

    const [result, count] = await query.getManyAndCount();
    let sNo:number =0;
    result.map((ediSubmitter) => {
      sNo = sNo + 1; 
      ediSubmitter["sNo"] = sNo;
    });
    if (result.length > 0) {
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.EdiSubmitterModule.Found}`,
        totalRows: count,
        data: result,
      };
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.EdiSubmitterModule.NotFound}`,
      };
    }
  }

  async findOne(ediSubmitterId: number) {
    try {
      const result = await this.ediSubmitterRepository.findOne({
        where: { id: ediSubmitterId },
        relations: ['customers', 'datasites']
      });
      if(result) {
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.EdiSubmitterModule.Found}`,
          data: result
        }
      } else {
        return {
          statusCode: HttpStatus.NO_CONTENT,
          message: `${Messages.EdiSubmitterModule.NotFound}`,
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async update(ediSubmitterId: number, request: UpdateEdisubmitterDto) {
    await this.ediSubmitterRepository.update(ediSubmitterId, request);
    const result = await this.ediSubmitterRepository.findOne({
      where: {
        id: ediSubmitterId
      }
    });
    if(result) {
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.EdiSubmitterModule.Updated}`,
        data: result
      }
    }
    else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.EdiSubmitterModule.NotFound}`,
      }
    }
  }

  async remove(ediSubmitterId: number) {
    const deletedEdiSubmitter = await this.ediSubmitterRepository.findOne({
      where: {
        id: ediSubmitterId
      }
    });
    if(deletedEdiSubmitter) {
      await this.ediSubmitterRepository.delete(ediSubmitterId);
      return {       
        statusCode: HttpStatus.OK,
        message: `${Messages.EdiSubmitterModule.Deleted}`,
        data: deletedEdiSubmitter
      };
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.EdiSubmitterModule.NotFound}`,
      }
    }
  }

  async getEDISubmitterByCustomerAndDatasite(customer: number, datasite: number) {
    const ediSubmitter = await this.ediSubmitterRepository.createQueryBuilder('ediSubmitter')
    .leftJoinAndSelect('ediSubmitter.customers', 'customers')
    .leftJoinAndSelect('ediSubmitter.datasites', 'datasites')
    .where({customer: customer })
    .andWhere({datasite: datasite })
    .getOne();

    if(ediSubmitter) {
      return {       
        statusCode: HttpStatus.OK,
        message: `${Messages.EdiSubmitterModule.Found}`,
        data: ediSubmitter
      };
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.EdiSubmitterModule.NotFound}`,
      }
    }
  }
}