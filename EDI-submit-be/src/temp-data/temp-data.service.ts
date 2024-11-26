import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateTempDataDto } from './dto/request/create-temp-data.dto';
import { UpdateTempDataDto } from './dto/request/update-temp-data.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TempData } from './entities/temp-data.entity';
import { Repository } from 'typeorm';
import { Messages } from 'src/common/constants/messages';

@Injectable()
export class TempDataService {
  constructor(
    @InjectRepository(TempData) private tempDataRepository: Repository<TempData>
  ) {}
  async create(createTempDataDto: CreateTempDataDto) {
    try {
      const result = await this.tempDataRepository.save(createTempDataDto);
      if(result) {
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.TempDataModule.Created}`,
          data: result
        }
      }
    } catch(err) {
      throw err;
    }
  }

  async findAll() {
    const result = await this.tempDataRepository.find();

    if (result.length > 0) {
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.TempDataModule.Found}`,
        data: result,
      };
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.TempDataModule.NotFound}`,
      };
    }
  }

  async findOne(tempDataId: number) {
    try {
      const result = await this.tempDataRepository.findOne({
        where: { id: tempDataId }
      });
      if(result) {
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.TempDataModule.Found}`,
          data: result
        }
      } else {
        return {
          statusCode: HttpStatus.NO_CONTENT,
          message: `${Messages.TempDataModule.NotFound}`,
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async update(tempDataId: number, request: UpdateTempDataDto) {
    await this.tempDataRepository.update(tempDataId, request);
    const result = await this.tempDataRepository.findOne({
      where: {
        id: tempDataId
      }
    });
    if(result) {
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.TempDataModule.Updated}`,
        data: result
      }
    }
    else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.TempDataModule.NotFound}`,
      }
    }
  }

  async remove(tempDataId: number) {
    const deletedState = await this.tempDataRepository.findOne({
      where: {
        id: tempDataId
      }
    });
    if(deletedState) {
      await this.tempDataRepository.delete(tempDataId);
      return {       
        statusCode: HttpStatus.OK,
        message: `${Messages.TempDataModule.Deleted}`,
        data: deletedState
      };
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.TempDataModule.NotFound}`,
      }
    }
  }
}
