import { Module } from '@nestjs/common';
import { DatasiteService } from './datasite.service';
import { DatasiteController } from './datasite.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Datasite } from './entities/datasite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Datasite])],
  controllers: [DatasiteController],
  providers: [DatasiteService]
})
export class DatasiteModule {}
