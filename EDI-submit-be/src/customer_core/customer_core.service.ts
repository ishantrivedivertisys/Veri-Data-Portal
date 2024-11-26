import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCustomerCoreDto } from './dto/request/create-customer_core.dto';
import { UpdateCustomerCoreDto } from './dto/request/update-customer_core.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer_core.entity';
import { Repository } from 'typeorm';
import { Messages } from 'src/common/constants/messages';
import { IFindAllCustomer } from './interface/customer.find';
import { getCheckDigit } from 'src/common/utils/get-check-digit';

@Injectable()
export class CustomerCoreService {
  constructor(
    @InjectRepository(Customer) private customerCoreRepository: Repository<Customer>
  ) {}
  
  async create(createCustomerCoreDto: CreateCustomerCoreDto) {
    try {
      const result = await this.customerCoreRepository.save(createCustomerCoreDto);
      if(result) {
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.CustomerModule.Created}`,
          data: result
        }
      }
    } catch(err) {
      throw err;
    }
  }

  async findAll(options: IFindAllCustomer) {
    const query = await this.customerCoreRepository.createQueryBuilder('customer');
    query.andWhere('customer.name1 != :name1', {
      name1: `.`,
    });

    if (options.search) {
      query.andWhere('customer.name1 like :name1', {
        name1: `%${options.search}%`,
      });
    }
    
    if (options.skip) query.offset(options.skip);

    if (options.limit) query.limit(options.limit);

    if (options.sortColumn) {
      query.orderBy(`customer.${options.sortColumn}`, options.sortType);
    } else {
      query.orderBy(`customer.name1`, 'ASC');
    }

    const [result, count] = await query.getManyAndCount();
    let sNo:number =0;
    result.map((customer) => {
      sNo = sNo + 1; 
      customer["sNo"] = sNo;
      customer["idWithCheckDigit"] = getCheckDigit(customer.id);
    });
    if (result.length > 0) {
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.CustomerModule.Found}`,
        totalRows: count,
        data: result,
      };
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.CustomerModule.NotFound}`,
      };
    }
  }

  async findOne(customerId: number) {
    try {
      const result = await this.customerCoreRepository.findOne({
        where: { id: customerId }
      });
      if(result) {
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.CustomerModule.Found}`,
          data: result
        }
      } else {
        return {
          statusCode: HttpStatus.NO_CONTENT,
          message: `${Messages.CustomerModule.NotFound}`,
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async update(customerId: number, request: UpdateCustomerCoreDto) {
    await this.customerCoreRepository.update(customerId, request);
    const result = await this.customerCoreRepository.findOne({
      where: {
        id: customerId
      }
    });
    if(result) {
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.CustomerModule.Updated}`,
        data: result
      }
    }
    else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.CustomerModule.NotFound}`,
      }
    }
  }

  async remove(customerId: number) {
    const deletedCountry = await this.customerCoreRepository.findOne({
      where: {
        id: customerId
      }
    });
    if(deletedCountry) {
      await this.customerCoreRepository.delete(customerId);
      return {       
        statusCode: HttpStatus.OK,
        message: `${Messages.CustomerModule.Deleted}`,
        data: deletedCountry
      };
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.CustomerModule.NotFound}`,
      }
    }
  }
}
