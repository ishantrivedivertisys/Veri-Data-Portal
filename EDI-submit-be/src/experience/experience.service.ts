import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateExperienceDto } from './dto/request/create-experience.dto';
import { UpdateExperienceDto } from './dto/request/update-experience.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Experience } from './entities/experience.entity';
import { Repository } from 'typeorm';
import { Messages } from 'src/common/constants/messages';
import { IFindAllExperience } from './interface/experience.find';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experience) private experienceRepository: Repository<Experience>,
    
  ) {}
  async create(createExperienceDto: CreateExperienceDto) {
    try {
      const result = await this.experienceRepository.save(createExperienceDto);
      if(result) {
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.ExperienceModule.Created}`,
          data: result
        }
      }
    } catch(err) {
      throw err;
    }
  }

  async findAll(options: IFindAllExperience) {
    const query = await this.experienceRepository.createQueryBuilder('experience');

    if (options.search) {
      query.andWhere('experience.account like :account', {
        account: `%${options.search}%`,
      });
      query.orWhere('experience.customer like :customer', {
        customer: `%${options.search}%`,
      });
    }
    
    if (options.skip) query.offset(options.skip);

    if (options.limit) query.limit(options.limit);

    if (options.sortColumn) {
      query.orderBy(`experience.${options.sortColumn}`, options.sortType);
    }

    const [result, count] = await query.getManyAndCount();
    let sNo:number =0;
    result.map((experience) => {
      sNo = sNo + 1; 
      experience["sNo"] = sNo;
    });
    if (result.length > 0) {
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.ExperienceModule.Found}`,
        totalRows: count,
        data: result,
      };
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.ExperienceModule.NotFound}`,
      };
    }
  }

  // async findOne(experienceId: number) {
  //   try {
  //     const result = await this.experienceRepository.findOne({
  //       where: { id: experienceId }
  //     });
  //     if(result) {
  //       return {
  //         statusCode: HttpStatus.OK,
  //         message: `${Messages.ExperienceModule.Found}`,
  //         data: result
  //       }
  //     } else {
  //       return {
  //         statusCode: HttpStatus.NO_CONTENT,
  //         message: `${Messages.ExperienceModule.NotFound}`,
  //       }
  //     }
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async update(experienceId: number, request: UpdateExperienceDto) {
  //   await this.experienceRepository.update(experienceId, request);
  //   const result = await this.experienceRepository.findOne({
  //     where: {
  //       id: experienceId
  //     }
  //   });
  //   if(result) {
  //     return {
  //       statusCode: HttpStatus.OK,
  //       message: `${Messages.ExperienceModule.Updated}`,
  //       data: result
  //     }
  //   }
  //   else {
  //     return {
  //       statusCode: HttpStatus.NO_CONTENT,
  //       message: `${Messages.ExperienceModule.NotFound}`,
  //     }
  //   }
  // }

  // async remove(experienceId: number) {
  //   const deletedExperience = await this.experienceRepository.findOne({
  //     where: {
  //       id: experienceId
  //     }
  //   });
  //   if(deletedExperience) {
  //     await this.experienceRepository.delete(experienceId);
  //     return {       
  //       statusCode: HttpStatus.OK,
  //       message: `${Messages.ExperienceModule.Deleted}`,
  //       data: deletedExperience
  //     };
  //   } else {
  //     return {
  //       statusCode: HttpStatus.NO_CONTENT,
  //       message: `${Messages.ExperienceModule.NotFound}`,
  //     }
  //   }
  // }
 
}
