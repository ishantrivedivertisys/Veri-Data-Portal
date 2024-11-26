import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
//import { DatabaseConfig } from './common/constants/db.configuration';
//import configuration, { mailConfig } from './common/constants/configuration';
import { MailService } from './common/helpers/mail/mail.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { TempExperienceModule } from './temp-experience/temp-experience.module';
import { ExperienceModule } from './experience/experience.module';
import { AccountModule } from './account/account.module';
import { CountryModule } from './country/country.module';
import { StateModule } from './state/state.module';
import { AccountxrefCoreModule } from './accountxref_core/accountxref_core.module';
import { CustomerCoreModule } from './customer_core/customer_core.module';
import { CustomerTemplateModule } from './customer-template/customer-template.module';
import { TempDataModule } from './temp-data/temp-data.module';
import { ZipCodesModule } from './zip_codes/zip_codes.module';
import { DatasiteModule } from './datasite/datasite.module';
import configuration from './config/configuration';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { RolePermissionModule } from './role-permission/role-permission.module';
import { CurrencyRateModule } from './currency-rate/currency-rate.module';
import { TemplateStructureModule } from './template-structure/template-structure.module';
import { EdisubmitterModule } from './edisubmitter/edisubmitter.module';
console.log("env1", process.cwd(), process.env.NODE_ENV ? process.env.NODE_ENV : '');

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/src/config/${process.env.NODE_ENV ? process.env.NODE_ENV : ''}.env` ,
      load: [configuration],
      isGlobal: true, // no need to import into other modules
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('database'),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('mailConfig'),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    FileUploadModule,
    TempExperienceModule,
    ExperienceModule,
    AccountModule,
    CountryModule,
    StateModule,
    AccountxrefCoreModule,
    CustomerCoreModule,
    CustomerTemplateModule,
    TempDataModule,
    ZipCodesModule,
    DatasiteModule,
    RoleModule,
    PermissionModule,
    RolePermissionModule,
    CurrencyRateModule,
    TemplateStructureModule,
    EdisubmitterModule
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
  exports: [MailService]
})
export class AppModule {}
