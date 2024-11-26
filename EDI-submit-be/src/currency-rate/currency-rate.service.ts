import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCurrencyRateDto } from './dto/request/create-currency-rate.dto';
import { UpdateCurrencyRateDto } from './dto/request/update-currency-rate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrencyRate } from './entities/currency-rate.entity';
import { Not, Repository } from 'typeorm';
import { Messages } from 'src/common/constants/messages';
const moment = require('moment');

@Injectable()
export class CurrencyRateService {
  constructor(
    @InjectRepository(CurrencyRate) private currencyRateRepository: Repository<CurrencyRate>
  ) {}

  async create(request: CreateCurrencyRateDto) {
    try {
      if(request.wefDate) {
        request.wefDate = moment(request.wefDate).format('YYYY-MM-DD');
      }
      let currencyRate = await this.currencyRateRepository.findOne({
        where: {
          wefDate: moment(request.wefDate).format('DD-MMM-YY'),
          currency: request.currency
        }
      })
      if(currencyRate) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: `${Messages.CurrencyRateModule.ExistCurrencyRate}`,
        }
      }
      const result = await this.currencyRateRepository.save(request);
      if(result) {
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.CurrencyRateModule.Created}`,
          data: result
        }
      }
    } catch(err) {
      throw err;
    }
  }

  async findAll() {
    const result = await this.currencyRateRepository.find();

    if (result.length > 0) {
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.CurrencyRateModule.Found}`,
        data: result,
      };
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.CurrencyRateModule.NotFound}`,
      };
    }
  }

  async findOne(currencyRateId: number) {
    try {
      const result = await this.currencyRateRepository.findOne({
        where: { id: currencyRateId }
      });
      if(result) {
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.CurrencyRateModule.Found}`,
          data: result
        }
      } else {
        return {
          statusCode: HttpStatus.NO_CONTENT,
          message: `${Messages.CurrencyRateModule.NotFound}`,
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async update(currencyRateId: number, request: UpdateCurrencyRateDto) {
    if(request.wefDate) {
      request.wefDate = moment(request.wefDate).format('YYYY-MM-DD');
    }
    let currencyRate = await this.currencyRateRepository.findOne({
      where: {
        wefDate: moment(request.wefDate).format('DD-MMM-YY'),
        currency: request.currency,
        id: Not(currencyRateId)
      }
    })
    if(currencyRate) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${Messages.CurrencyRateModule.ExistCurrencyRate}`,
      }
    }
    await this.currencyRateRepository.update(currencyRateId, request);
    const result = await this.currencyRateRepository.findOne({
      where: {
        id: currencyRateId
      }
    });
    if(result) {
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.CurrencyRateModule.Updated}`,
        data: result
      }
    }
    else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.CurrencyRateModule.NotFound}`,
      }
    }
  }

  async remove(currencyRateId: number) {
    const deletedCurrencyRate = await this.currencyRateRepository.findOne({
      where: {
        id: currencyRateId
      }
    });
    if(deletedCurrencyRate) {
      await this.currencyRateRepository.delete(currencyRateId);
      return {       
        statusCode: HttpStatus.OK,
        message: `${Messages.CurrencyRateModule.Deleted}`,
        data: deletedCurrencyRate
      };
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.CurrencyRateModule.NotFound}`,
      }
    }
  }
}
