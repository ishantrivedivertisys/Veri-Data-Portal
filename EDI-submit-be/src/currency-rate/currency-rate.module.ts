import { Module } from '@nestjs/common';
import { CurrencyRateService } from './currency-rate.service';
import { CurrencyRateController } from './currency-rate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyRate } from './entities/currency-rate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CurrencyRate])],
  controllers: [CurrencyRateController],
  providers: [CurrencyRateService]
})
export class CurrencyRateModule {}
