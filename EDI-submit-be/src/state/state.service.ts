import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateStateDto } from './dto/request/create-state.dto';
import { UpdateStateDto } from './dto/request/update-state.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { State } from './entities/state.entity';
import { Repository } from 'typeorm';
import { Messages } from 'src/common/constants/messages';

@Injectable()
export class StateService {
  constructor(
    @InjectRepository(State) private stateRepository: Repository<State>
  ) {}
  async create(createStateDto: CreateStateDto) {
    try {
      const result = await this.stateRepository.save(createStateDto);
      if(result) {
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.StateModule.Created}`,
          data: result
        }
      }
    } catch(err) {
      throw err;
    }
  }

  async findAll() {
    const result = await this.stateRepository.find();

    if (result.length > 0) {
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.StateModule.Found}`,
        data: result,
      };
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.StateModule.NotFound}`,
      };
    }
  }

  async findOne(stateId: string) {
    try {
      const result = await this.stateRepository.findOne({
        where: { code: stateId }
      });
      if(result) {
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.StateModule.Found}`,
          data: result
        }
      } else {
        return {
          statusCode: HttpStatus.NO_CONTENT,
          message: `${Messages.StateModule.NotFound}`,
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async update(stateId: string, request: UpdateStateDto) {
    await this.stateRepository.update(stateId, request);
    const result = await this.stateRepository.findOne({
      where: {
        code: stateId
      }
    });
    if(result) {
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.StateModule.Updated}`,
        data: result
      }
    }
    else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.StateModule.NotFound}`,
      }
    }
  }

  async remove(stateId: string) {
    const deletedState = await this.stateRepository.findOne({
      where: {
        code: stateId
      }
    });
    if(deletedState) {
      await this.stateRepository.delete(stateId);
      return {       
        statusCode: HttpStatus.OK,
        message: `${Messages.StateModule.Deleted}`,
        data: deletedState
      };
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.StateModule.NotFound}`,
      }
    }
  }

  async getStateListByCountryId(countryId: number) {
    try {
      const result = await this.stateRepository.find({
        where: { country: countryId },
        order: { name: 'ASC'
      }
      });
      if(result.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.StateModule.Found}`,
          data: result
        }
      } else {
        return {
          statusCode: HttpStatus.NO_CONTENT,
          message: `${Messages.StateModule.NotFound}`,
        }
      }
    } catch (error) {
      throw error;
    }
  }
}

