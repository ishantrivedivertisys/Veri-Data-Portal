import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/request/create-account.dto';
import { UpdateAccountDto } from './dto/request/update-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Brackets, DataSource, Like, QueryRunner, Repository } from 'typeorm';
import { Messages } from 'src/common/constants/messages';
import { IFindAllAccount } from './interface/account.find';
import { getCheckDigit } from 'src/common/utils/get-check-digit';
import { Country } from 'src/country/entities/country.entity';
const moment = require('moment');
@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    @InjectRepository(Country) private countryRepository: Repository<Country>,
    private dataSource: DataSource,
  ) {}
  async create(request: CreateAccountDto) {

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const isCharacterOnly = /^[a-zA-Z ]*$/;
      if(request.date_business_established) {
        request.date_business_established = moment(request.date_business_established).format("YYYY-MM-DD");
      }
      if(request.date_of_incorporation) {
        request.date_of_incorporation = moment(request.date_of_incorporation).format("YYYY-MM-DD");
      }
      const date = moment(new Date()).format('YYYY-MM-DD');
      request['created'] = Number(date.split('-').join(''));
      
      if(!request.name_1 || request.name_1 == '' || request.name_1 == null) {
        throw new BadRequestException(`${Messages.AccountModule.NameNotEmpty}`)
      }
      // if(!request.city || request.city == '' || request.city == null || !isCharacterOnly.test(request.city)) {
      if(!request.city || request.city == '' || request.city == null) {
        throw new BadRequestException(`${Messages.AccountModule.CityNotEmpty}`)
      }
      
      if(!request.country || request.country == null || !Number(request.country)) {
        throw new BadRequestException(`${Messages.AccountModule.CountryNotEmptyAndIntegerType}`)
      }
      if(request.country) {
        const country = await this.countryRepository.findOne({
          where: {id: request.country}
        })
        if(!country) {
          throw new BadRequestException(`${Messages.AccountModule.InvalidCountry}`)
        }
      }
      if(request.branch) {
        if(!isCharacterOnly.test(request.branch) || request.branch.length !== 1) {
          throw new BadRequestException(`${Messages.AccountModule.BranchFormat}`)
        }
      }
      if(!request.created || request.created == null || !Number(request.created)) {
        throw new BadRequestException(`${Messages.AccountModule.CreatedNotEmptyAndIntegerType}`)
      }
      if(Number(request.created).toString().length !== 8) {
        throw new BadRequestException(`${Messages.AccountModule.CreatedFormat}`)
      }
      if(request.state_of_incorporation) {
        if(!isCharacterOnly.test(request.state_of_incorporation) || request.state_of_incorporation.length !== 2) {
          throw new BadRequestException(`${Messages.AccountModule.StateOfIncorporation}`)
        }
      }
      if(request.country == 20 || request.country == 22) {
        if(!request.state || request.state == '' || request.state == null) {
          throw new BadRequestException(`${Messages.AccountModule.StateEmpty}`)
        } else if(request.state) {
          if(!isCharacterOnly.test(request.state) || request.state.length !== 2) {
            throw new BadRequestException(`${Messages.AccountModule.StateFormat}`)
          }
        }
      }
      const existAccount = await this.accountRepository.find({
        where: {
          name_1: Like(`%${request.name_1}%`)
        }
      })
      if(existAccount.length > 0) {
        return {
          statusCode: HttpStatus.FOUND,
          message: 'Already exist name',
          data: existAccount
        }
      }
      const account = await queryRunner.manager.query(`SELECT ACCOUNT_SEQ.nextval FROM dual`);
      const nextVal = account[0]?.NEXTVAL;
      request.id = nextVal;
      const result = await this.accountRepository.save(request);
      await queryRunner.commitTransaction();
      if(result) {
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.AccountModule.Created}`,
          data: result
        }
      }
    } catch(err) {
        await queryRunner.rollbackTransaction();
        throw err;
    } finally {
        await queryRunner.release();
    }
  }

  async findAll(options: IFindAllAccount) {
    const query = await this.accountRepository.createQueryBuilder('account')
    .select('account')
    .distinct(true)
    .leftJoinAndSelect('account.countries', 'countries')
    .where('1 = 1');
    
    if (options.search) {
      query.andWhere('LOWER(account.name_1) LIKE LOWER(:name_1)', { name_1: `%${options.search}%` });
  }
    // if(options.search && options.city && options.zip_code && options.state && options.country) {
    //   query.andWhere(`account.name_1 LIKE '%${options.search}%' AND account.city = '${options.city}' AND 
    //     account.zip_code = '${options.zip_code.trim()}' AND account.state = '${options.state}' AND countries.two_char_code = '${options.country}'`)
    // }
    if(options.city) {
      query.andWhere('LOWER(account.city) = LOWER(:city)', { city: options.city });
    }
    if(options.country) {
      query.andWhere('(LOWER(countries.two_char_code) = LOWER(:two_char_code) OR account.country = :country)', {
        two_char_code: options.country,
        country: 160,
    });
    }
    if(options.state) {
      query.andWhere('LOWER(account.state) = LOWER(:state)', { state: options.state });
    }
    if(options.zip_code) {
      query.andWhere('account.zip_code = :zip_code', { zip_code: options.zip_code.trim() });
    }
    
    if (options.skip) query.offset(options.skip);

    if (options.limit) query.limit(options.limit);

    if (options.sortColumn) {
      query.orderBy(`account.${options.sortColumn}`, options.sortType);
    }

    const [result, count] = await query.getManyAndCount();
    let sNo:number =0;
    result.map((account) => {
      sNo = sNo + 1; 
      account["sNo"] = sNo;
      account["idWithCheckDigit"] = "R" + "-" + getCheckDigit(account.id);
    });
    if (result.length > 0) {
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.AccountModule.Found}`,
        totalRows: count,
        data: result,
      };
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.AccountModule.NotFound}`,
      };
    }
  }

  async findOne(accountId: number) {
    try {
      const result = await this.accountRepository.findOne({
        where: { id: accountId }
      });
      if(result) {
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.AccountModule.Found}`,
          data: result
        }
      } else {
        return {
          statusCode: HttpStatus.NO_CONTENT,
          message: `${Messages.AccountModule.NotFound}`,
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async update(accountId: number, request: UpdateAccountDto) {
    const date = moment(new Date()).format('YYYY-MM-DD');
    request['modified'] = Number(date.split('-').join(''));
    await this.accountRepository.update(accountId, request);
    const result = await this.accountRepository.findOne({
      where: {
        id: accountId
      }
    });
    if(result) {
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.AccountModule.Updated}`,
        data: result
      }
    }
    else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.AccountModule.NotFound}`,
      }
    }
  }

  async remove(accountId: number) {
    const deletedAccount = await this.accountRepository.findOne({
      where: {
        id: accountId
      }
    });
    if(deletedAccount) {
      await this.accountRepository.delete(accountId);
      return {       
        statusCode: HttpStatus.OK,
        message: `${Messages.AccountModule.Deleted}`,
        data: deletedAccount
      };
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.AccountModule.NotFound}`,
      }
    }
  }
}
