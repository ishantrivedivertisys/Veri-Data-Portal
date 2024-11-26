import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAccountxrefCoreDto } from './dto/request/create-accountxref_core.dto';
import { UpdateAccountxrefCoreDto } from './dto/request/update-accountxref_core.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Accountxref } from './entities/accountxref_core.entity';
import { Repository } from 'typeorm';
import { Messages } from 'src/common/constants/messages';

@Injectable()
export class AccountxrefCoreService {
  constructor(
    @InjectRepository(Accountxref) private accountXrefRepository: Repository<Accountxref>
  ) {}
  async create(createAccountxrefCoreDto: CreateAccountxrefCoreDto) {
    try {
      const result = await this.accountXrefRepository.save(createAccountxrefCoreDto);
      if(result) {
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.AccountXrefModule.Created}`,
          data: result
        }
      }
    } catch(err) {
      throw err;
    }
  }

  async findAll() {
    const result = await this.accountXrefRepository.find();

    if (result.length > 0) {
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.AccountXrefModule.Found}`,
        data: result,
      };
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.AccountXrefModule.NotFound}`,
      };
    }
  }

  async findOne(accountXrefId: string) {
    try {
      const result = await this.accountXrefRepository.findOne({
        where: { custRefNo: accountXrefId }
      });
      if(result) {
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.AccountXrefModule.Found}`,
          data: result
        }
      } else {
        return {
          statusCode: HttpStatus.NO_CONTENT,
          message: `${Messages.AccountXrefModule.NotFound}`,
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async update(accountXrefId: string, request: UpdateAccountxrefCoreDto) {
    await this.accountXrefRepository.update(accountXrefId, request);
    const result = await this.accountXrefRepository.findOne({
      where: {
        custRefNo: accountXrefId
      }
    });
    if(result) {
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.AccountXrefModule.Updated}`,
        data: result
      }
    }
    else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.AccountXrefModule.NotFound}`,
      }
    }
  }

  async remove(accountXrefId: string) {
    const deletedAccountXref = await this.accountXrefRepository.findOne({
      where: {
        custRefNo: accountXrefId
      }
    });
    if(deletedAccountXref) {
      await this.accountXrefRepository.delete(accountXrefId);
      return {       
        statusCode: HttpStatus.OK,
        message: `${Messages.AccountXrefModule.Deleted}`,
        data: deletedAccountXref
      };
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.AccountXrefModule.NotFound}`,
      }
    }
  }
}
