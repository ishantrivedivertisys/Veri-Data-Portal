import { Module } from '@nestjs/common';
import { TempDataService } from './temp-data.service';
import { TempDataController } from './temp-data.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TempData } from './entities/temp-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TempData])],
  controllers: [TempDataController],
  providers: [TempDataService]
})
export class TempDataModule {}
