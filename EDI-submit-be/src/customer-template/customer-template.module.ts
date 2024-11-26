import { Module } from '@nestjs/common';
import { CustomerTemplateService } from './customer-template.service';
import { CustomerTemplateController } from './customer-template.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerTemplate } from './entities/customer-template.entity';
import { TempExperienceModule } from 'src/temp-experience/temp-experience.module';
import { FileUpload } from 'src/file-upload/entities/fileUpoad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerTemplate, FileUpload]), TempExperienceModule],
  controllers: [CustomerTemplateController],
  providers: [CustomerTemplateService]
})
export class CustomerTemplateModule {}
