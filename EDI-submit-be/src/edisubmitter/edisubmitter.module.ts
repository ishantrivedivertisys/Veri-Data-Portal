import { Module } from '@nestjs/common';
import { EdisubmitterService } from './edisubmitter.service';
import { EdisubmitterController } from './edisubmitter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Edisubmitter } from './entities/edisubmitter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Edisubmitter])],
  controllers: [EdisubmitterController],
  providers: [EdisubmitterService]
})
export class EdisubmitterModule {}
