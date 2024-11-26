import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FigureDateDto {
  @ApiProperty()
  @IsOptional()
  figureDate: string;

  @ApiProperty()
  @IsOptional()
  currentDate: string;

  @ApiProperty()
  @IsOptional()
  customer: number;
}
