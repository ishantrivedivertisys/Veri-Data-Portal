import { Module } from '@nestjs/common';
import { TemplateStructureService } from './template-structure.service';
import { TemplateStructureController } from './template-structure.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateStructure } from './entities/template-structure.entity';
import { TempExperienceModule } from 'src/temp-experience/temp-experience.module';

@Module({
  imports: [TypeOrmModule.forFeature([TemplateStructure]), TempExperienceModule],
  controllers: [TemplateStructureController],
  providers: [TemplateStructureService]
})
export class TemplateStructureModule {}
