import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateZipCodeDto } from './dto/request/create-zip_code.dto';
import { UpdateZipCodeDto } from './dto/request/update-zip_code.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ZipCode } from './entities/zip_code.entity';
import { Repository } from 'typeorm';
import { Messages } from 'src/common/constants/messages';

@Injectable()
export class ZipCodesService {
  constructor(
    @InjectRepository(ZipCode) private zipCodeRepository: Repository<ZipCode>
  ) {}
  async create(createZipCodeDto: CreateZipCodeDto) {
    try {
      const result = await this.zipCodeRepository.save(createZipCodeDto);
      if(result) {
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.ZipCodeModule.Created}`,
          data: result
        }
      }
    } catch(err) {
      throw err;
    }
  }

  async findAll() {
    const result = await this.zipCodeRepository.find();

    if (result.length > 0) {
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.ZipCodeModule.Found}`,
        data: result,
      };
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.ZipCodeModule.NotFound}`,
      };
    }
  }

  async findOne(zipCodeId: number) {
    try {
      const result = await this.zipCodeRepository.findOne({
        where: { id: zipCodeId }
      });
      if(result) {
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.ZipCodeModule.Found}`,
          data: result
        }
      } else {
        return {
          statusCode: HttpStatus.NO_CONTENT,
          message: `${Messages.ZipCodeModule.NotFound}`,
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async update(zipCodeId: number, request: UpdateZipCodeDto) {
    await this.zipCodeRepository.update(zipCodeId, request);
    const result = await this.zipCodeRepository.findOne({
      where: {
        id: zipCodeId
      }
    });
    if(result) {
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.ZipCodeModule.Updated}`,
        data: result
      }
    }
    else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.ZipCodeModule.NotFound}`,
      }
    }
  }

  async remove(zipCodeId: number) {
    const deletedZipCode = await this.zipCodeRepository.findOne({
      where: {
        id: zipCodeId
      }
    });
    if(deletedZipCode) {
      await this.zipCodeRepository.delete(zipCodeId);
      return {       
        statusCode: HttpStatus.OK,
        message: `${Messages.ZipCodeModule.Deleted}`,
        data: deletedZipCode
      };
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.ZipCodeModule.NotFound}`,
      }
    }
  }
}
