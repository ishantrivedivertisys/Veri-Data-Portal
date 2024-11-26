import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsOptional } from "class-validator";
import { CurrencyRateCurrency } from "src/currency-rate/entities/currency-rate.enum";
import { CurrencyRateStatus } from "src/currency-rate/entities/currency-rate.status.enum";

export class CreateCurrencyRateDto {
    @ApiProperty()
    @IsOptional()
    wefDate: Date;

    @ApiProperty()
    @IsOptional()
    @IsEnum(CurrencyRateCurrency)
    @Transform(({ value }) => value || CurrencyRateCurrency.CAD)
    currency: string;

    @ApiProperty()
    @IsOptional()
    dollar: number;

    @ApiProperty()
    @IsOptional()
    @IsEnum(CurrencyRateStatus)
    @Transform(({ value }) => value || CurrencyRateStatus.ACTIVE)
    status: string;
}
