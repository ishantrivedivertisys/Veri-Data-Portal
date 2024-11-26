import { Module } from '@nestjs/common';
import { AccountxrefCoreService } from './accountxref_core.service';
import { AccountxrefCoreController } from './accountxref_core.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accountxref } from './entities/accountxref_core.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Accountxref])],
  controllers: [AccountxrefCoreController],
  providers: [AccountxrefCoreService]
})
export class AccountxrefCoreModule {}
