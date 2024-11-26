import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTemplateStructureDto } from './dto/request/create-template-structure.dto';
import { UpdateTemplateStructureDto } from './dto/request/update-template-structure.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TemplateStructure } from './entities/template-structure.entity';
import { Repository } from 'typeorm';
import { Messages } from 'src/common/constants/messages';
import { TempExperienceService } from 'src/temp-experience/temp-experience.service';

@Injectable()
export class TemplateStructureService {
  constructor(
    @InjectRepository(TemplateStructure) private templateStructureRepository: Repository<TemplateStructure>,
    private readonly tempExperienceService: TempExperienceService
  ) {}

  async create(request: CreateTemplateStructureDto) {
    try {
      if(request.tableColumnName) {
        const templateStructure = await this.templateStructureRepository.findOne({
          where: {
            tableColumnName: request.tableColumnName
          }
        })
        if(templateStructure) {
          return {
            statusCode: HttpStatus.CONFLICT,
            message: `${Messages.TemplateStructureModule.AlreadyExistName}`,
          }
        }
      }
      const result = await this.templateStructureRepository.save(request);
      if(result) {
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.TemplateStructureModule.Created}`,
          data: result
        }
      }
    } catch(err) {
      throw err;
    }
  }

  async findAll() {
    const result = await this.templateStructureRepository.find({
      order: {
        id: 'ASC'
      }
    });

    if (result.length > 0) {
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.TemplateStructureModule.Found}`,
        data: result,
      };
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.TemplateStructureModule.NotFound}`,
      };
    }
  }

  async findOne(templateStructureId: number) {
    try {
      const result = await this.templateStructureRepository.findOne({
        where: { id: templateStructureId }
      });
      if(result) {
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.TemplateStructureModule.Found}`,
          data: result
        }
      } else {
        return {
          statusCode: HttpStatus.NO_CONTENT,
          message: `${Messages.TemplateStructureModule.NotFound}`,
        }
      }
    } catch (error) {
      throw error;
    }
  }

  // async update(request: UpdateTemplateStructureDto[]) {
  //   let templateStructures = await this.templateStructureRepository.createQueryBuilder('templateStructure')
  //   .orderBy('templateStructure.id', 'ASC')
  //   .getMany();

  //   if (templateStructures.length == 0) {
  //     return {
  //       statusCode: HttpStatus.NOT_FOUND,
  //       message: `${Messages.TemplateStructureModule.NotFound}`,
  //     };
  //   }

  //   // Convert existing fields string to array
  //   let updatedRecords = [];

  //   for (let templateStructure of templateStructures) {
  //     let existingFields = [];
  //     if (templateStructure.templateColumnName) {
  //       let jsonArray = templateStructure.templateColumnName.replace(/'/g, '"');
  //       existingFields = JSON.parse(jsonArray);
  //     }

  //     for (let req of request) {
  //       if (+req.id === templateStructure.id) {
          
  //         let isUpdated = false;

  //         if (req.templateColumnName) {
  //           let newFieldsString = req.templateColumnName.replace(/[\[\]']/g, '');
  //           let newFields = newFieldsString.split(',').map(field => field.trim());

  //           let allTemplates = await this.templateStructureRepository.find({order: {id: 'ASC'}});
  //           for (let template of allTemplates) {
  //             let jsonArray = template.templateColumnName.replace(/'/g, '"');
  //             let templateFields = JSON.parse(jsonArray);

  //             for (let field of newFields) {
  //               if (templateFields.includes(field)) {
  //                 throw new BadRequestException(`Field ${field} already exists.`);
  //               }
  //             }
  //           }

  //           newFields.forEach(field => {
  //             if (!existingFields.includes(field)) {
  //               existingFields.push(field);
  //             } else {
  //               console.log(`Field ${field} already exists.`);
  //             }
  //           });

  //           templateStructure.templateColumnName = `[${existingFields.map(field => `'${field}'`).join(', ')}]`;
  //           isUpdated = true;
  //         }

  //         if (req.validation !== undefined) {
  //           templateStructure.validation = req.validation;
  //           isUpdated = true;
  //         }

  //         if (isUpdated) {
  //           updatedRecords.push(templateStructure);
  //         }
  //       }
  //     }
  //   }

  //   if (updatedRecords.length > 0) {
  //     await this.templateStructureRepository.save(updatedRecords);
  //   }

  //   return {
  //     statusCode: HttpStatus.OK,
  //     message: `${Messages.TemplateStructureModule.Updated}`,
  //     data: updatedRecords,
  //   };
  // }

  async update(request: UpdateTemplateStructureDto[]) {
    let templateStructures = await this.templateStructureRepository.createQueryBuilder('templateStructure')
    .orderBy('templateStructure.id', 'ASC')
    .getMany();

    if (templateStructures.length == 0) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: `${Messages.TemplateStructureModule.NotFound}`,
      };
    }

    // Convert existing fields string to array
    let updatedRecords = [];
    let fileUploadId = null;

    for (let templateStructure of templateStructures) {
      let existingFields = [];
      if (templateStructure.templateColumnName) {
        let jsonArray = templateStructure.templateColumnName.replace(/'/g, '"');
        existingFields = JSON.parse(jsonArray);
      }

      for (let req of request) {
        if (+req.id === templateStructure.id) {
          
          let isUpdated = false;

          if (req.templateColumnName) {
            let newFieldsString = req.templateColumnName.replace(/[\[\]']/g, '');
            let newFields = newFieldsString.split(',').map(field => field.trim());

            let allTemplates = await this.templateStructureRepository.find({order: {id: 'ASC'}});
            for (let template of allTemplates) {
              let jsonArray = template.templateColumnName.replace(/'/g, '"');
              let templateFields = JSON.parse(jsonArray);
              if(req.isReplaceOld) {
                // Validation if replace the existing array with the new one
                if(template.id !== templateStructure.id) {
                  for (let field of newFields) {
                    if (templateFields.includes(field)) {
                      throw new BadRequestException(`Field ${field} already exists.`);
                    }
                  }
                }
              }
            }

            if(!req.isReplaceOld) {
              // Validation if merge the new fields with the existing ones
              newFields.forEach(field => {
                if (!existingFields.includes(field)) {
                  existingFields.push(field);
                } else {
                  throw new BadRequestException(`Field ${field} already exists.`);
                }
              });
            }

            if (req.isReplaceOld) {
              // Replace the existing array with the new one
              templateStructure.templateColumnName = `[${newFields.map(field => `'${field}'`).join(', ')}]`;
            } else {
              // Merge the new fields with the existing ones
              const mergedFields = Array.from(new Set([...existingFields, ...newFields]));
              templateStructure.templateColumnName = `[${mergedFields.map(field => `'${field}'`).join(', ')}]`;
            }
            isUpdated = true;
          }
          
          if (req.validation !== undefined) {
            templateStructure.validation = req.validation;
            isUpdated = true;
          }

          if (req.fileUploadId) {
            fileUploadId = req.fileUploadId;  // Capture the fileUploadId
            isUpdated = true;
          }

          if (isUpdated) {
            updatedRecords.push(templateStructure);
          }
        }
      }
    }
    if (updatedRecords.length > 0) {
      await this.templateStructureRepository.save(updatedRecords);
      if (fileUploadId) {
        // if fileUploadId was found in any request
        this.tempExperienceService.validateTemplateWithHeader(fileUploadId);
      }
    }

    return {
      statusCode: HttpStatus.OK,
      message: `${Messages.TemplateStructureModule.Updated}`,
      data: updatedRecords,
    };
  }

  async remove(templateStructureId: number) {
    const deletedTemplateStructure = await this.templateStructureRepository.findOne({
      where: {
        id: templateStructureId
      }
    });
    if(deletedTemplateStructure) {
      await this.templateStructureRepository.delete(templateStructureId);
      return {       
        statusCode: HttpStatus.OK,
        message: `${Messages.TemplateStructureModule.Deleted}`,
        data: deletedTemplateStructure
      };
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.TemplateStructureModule.NotFound}`,
      }
    }
  }
}
