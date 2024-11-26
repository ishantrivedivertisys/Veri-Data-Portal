import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateDatasiteDto } from './dto/request/create-datasite.dto';
import { UpdateDatasiteDto } from './dto/request/update-datasite.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Datasite } from './entities/datasite.entity';
import { Repository } from 'typeorm';
import { Messages } from 'src/common/constants/messages';

@Injectable()
export class DatasiteService {
  constructor(
    @InjectRepository(Datasite) private datasiteRepository: Repository<Datasite>
  ) {}

  async create(request: CreateDatasiteDto) {
    try {
      const result = await this.datasiteRepository.save(request);
      if(result) {
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.DatasiteModule.Created}`,
          data: result
        }
      }
    } catch(err) {
      throw err;
    }
  }

  async findAll() {
    const result = await this.datasiteRepository.find();

    if (result.length > 0) {
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.DatasiteModule.Found}`,
        data: result,
      };
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.DatasiteModule.NotFound}`,
      };
    }
  }

  async findOne(datasiteId: number) {
    try {
      const result = await this.datasiteRepository.findOne({
        where: { id: datasiteId }
      });
      if(result) {
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.DatasiteModule.Found}`,
          data: result
        }
      } else {
        return {
          statusCode: HttpStatus.NO_CONTENT,
          message: `${Messages.DatasiteModule.NotFound}`,
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async update(datasiteId: number, request: UpdateDatasiteDto) {
    await this.datasiteRepository.update(datasiteId, request);
    const result = await this.datasiteRepository.findOne({
      where: {
        id: datasiteId
      }
    });
    if(result) {
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.DatasiteModule.Updated}`,
        data: result
      }
    }
    else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.DatasiteModule.NotFound}`,
      }
    }
  }

  async remove(datasiteId: number) {
    const deletedDatasite = await this.datasiteRepository.findOne({
      where: {
        id: datasiteId
      }
    });
    if(deletedDatasite) {
      await this.datasiteRepository.delete(datasiteId);
      return {       
        statusCode: HttpStatus.OK,
        message: `${Messages.DatasiteModule.Deleted}`,
        data: deletedDatasite
      };
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.DatasiteModule.NotFound}`,
      }
    }
  }

  async getDatasiteByCustomerNo(customerNo: number) {
    try {
      const result = await this.datasiteRepository.find({
        where: { customer: customerNo }
      });
      if(result.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.DatasiteModule.Found}`,
          data: result
        }
      } else {
        const data = [{
          id: 0,
          customer: customerNo,
          message: 'default'
        }]
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.DatasiteModule.Found}`,
          data: data
        }
      }
    } catch (error) {
      throw error;
    }
  }
}
