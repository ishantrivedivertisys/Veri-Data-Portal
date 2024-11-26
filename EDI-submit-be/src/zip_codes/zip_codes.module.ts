import { Module } from '@nestjs/common';
import { ZipCodesService } from './zip_codes.service';
import { ZipCodesController } from './zip_codes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZipCode } from './entities/zip_code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ZipCode])],
  controllers: [ZipCodesController],
  providers: [ZipCodesService]
})
export class ZipCodesModule {}
