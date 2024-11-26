import { Module } from '@nestjs/common';
import { TempExperienceService } from './temp-experience.service';
import { TempExperienceController } from './temp-experience.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TempExperience } from './entities/temp-experience.entity';
import { FileUpload } from 'src/file-upload/entities/fileUpoad.entity';
import { Account } from 'src/account/entities/account.entity';
import { Country } from 'src/country/entities/country.entity';
import { State } from 'src/state/entities/state.entity';
import { Accountxref } from 'src/accountxref_core/entities/accountxref_core.entity';
import { Experience } from 'src/experience/entities/experience.entity';
import { CustomerTemplate } from 'src/customer-template/entities/customer-template.entity';
import { TempData } from 'src/temp-data/entities/temp-data.entity';
import { Customer } from 'src/customer_core/entities/customer_core.entity';
import { ZipCode } from 'src/zip_codes/entities/zip_code.entity';
import { Datasite } from 'src/datasite/entities/datasite.entity';
import { MailService } from 'src/common/helpers/mail/mail.service';
import { CurrencyRate } from 'src/currency-rate/entities/currency-rate.entity';
import { TemplateStructure } from 'src/template-structure/entities/template-structure.entity';

@Module({
  imports: [TypeOrmModule.forFeature(
    [
      TempExperience,
      FileUpload,
      Account,
      Country,
      State,
      Accountxref,
      Experience,
      CustomerTemplate,
      TempData,
      Customer,
      ZipCode,
      Datasite,
      CurrencyRate,
      TemplateStructure
    ]
  )],
  controllers: [TempExperienceController],
  providers: [TempExperienceService, MailService],
  exports: [TempExperienceService]
})
export class TempExperienceModule {}
