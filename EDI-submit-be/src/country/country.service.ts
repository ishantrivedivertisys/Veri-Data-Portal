import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCountryDto } from './dto/request/create-country.dto';
import { UpdateCountryDto } from './dto/request/update-country.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { Repository } from 'typeorm';
import { Messages } from 'src/common/constants/messages';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country) private countryRepository: Repository<Country>
  ) {}
  async create(createCountryDto: CreateCountryDto) {
    try {
      const result = await this.countryRepository.save(createCountryDto);
      if(result) {
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.CountryModule.Created}`,
          data: result
        }
      }
    } catch(err) {
      throw err;
    }
  }

  async findAll() {
    const result = await this.countryRepository.find({
      order: {
        name: 'ASC'
      }
    });

    if (result.length > 0) {
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.CountryModule.Found}`,
        data: result,
      };
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.CountryModule.NotFound}`,
      };
    }
  }

  async findOne(countryId: number) {
    try {
      const result = await this.countryRepository.findOne({
        where: { id: countryId }
      });
      if(result) {
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.CountryModule.Found}`,
          data: result
        }
      } else {
        return {
          statusCode: HttpStatus.NO_CONTENT,
          message: `${Messages.CountryModule.NotFound}`,
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async update(countryId: number, request: UpdateCountryDto) {
    await this.countryRepository.update(countryId, request);
    const result = await this.countryRepository.findOne({
      where: {
        id: countryId
      }
    });
    if(result) {
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.CountryModule.Updated}`,
        data: result
      }
    }
    else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.CountryModule.NotFound}`,
      }
    }
  }

  async remove(countryId: number) {
    const deletedCountry = await this.countryRepository.findOne({
      where: {
        id: countryId
      }
    });
    if(deletedCountry) {
      await this.countryRepository.delete(countryId);
      return {       
        statusCode: HttpStatus.OK,
        message: `${Messages.CountryModule.Deleted}`,
        data: deletedCountry
      };
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.CountryModule.NotFound}`,
      }
    }
  }
}
