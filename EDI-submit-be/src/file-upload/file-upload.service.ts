import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateFileUploadDto } from './dto/request/create-file-upload.dto';
import { UpdateFileUploadDto } from './dto/request/update-file-upload.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FileUpload } from './entities/fileUpoad.entity';
import { Messages } from 'src/common/constants/messages';

@Injectable()
export class FileUploadService {
  constructor(
    @InjectRepository(FileUpload) private fileUploadRepository: Repository<FileUpload>,
  ) {}

  async create(request: CreateFileUploadDto) {
    const result = this.fileUploadRepository.create(request);
    await this.fileUploadRepository.save(result);
    if(result) {
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.FileUploadModule.Created}`,
        data: result
      }
    }
  }

  async findAll() {
    const result = await this.fileUploadRepository.find();
    if(result.length > 0) {
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.FileUploadModule.Found}`,
        data: result  
      }
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.FileUploadModule.NotFound}`
      }
    }
  }

  async findOne(fileUploadId: number) {
    try {
      const result = await this.fileUploadRepository.findOne({
        where: { id: fileUploadId }
      });
      if(result) {
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.FileUploadModule.Found}`,
          data: result  
        }
      } else {
        return {
          statusCode: HttpStatus.NO_CONTENT,
          message: `${Messages.FileUploadModule.NotFound}`
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async update(fileUploadId: number, request: UpdateFileUploadDto) {
    const fileUpload = await this.fileUploadRepository.findOne({
      where: {id: fileUploadId}
    });
    if (fileUpload) {
      await this.fileUploadRepository.update(fileUploadId, request);
      const result = await this.fileUploadRepository.findOne({
        where: {
          id: fileUploadId
        }
      });
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.FileUploadModule.Updated}`,
        data: result  
      }
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.FileUploadModule.NotFound}`
      }
    }
  }

  async remove(fileUploadId: number) {
    const deletedFileUpload = await this.fileUploadRepository.findOne({
      where: {
        id: fileUploadId
      }
    });
    if(deletedFileUpload) {
      await this.fileUploadRepository.delete(fileUploadId);
      return {       
        statusCode: HttpStatus.OK,
        message: `${Messages.FileUploadModule.Deleted}`,
        data: deletedFileUpload
      };
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.FileUploadModule.NotFound}`,
      }
    }
  }
}
