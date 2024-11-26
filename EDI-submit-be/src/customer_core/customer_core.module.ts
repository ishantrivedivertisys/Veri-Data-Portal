import { Module } from '@nestjs/common';
import { CustomerCoreService } from './customer_core.service';
import { CustomerCoreController } from './customer_core.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer_core.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  controllers: [CustomerCoreController],
  providers: [CustomerCoreService]
})
export class CustomerCoreModule {}
