import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TradeTapeMappingDto {
  @ApiProperty({required: true})
  @IsNotEmpty()
  tempExperienceId: number;

  @ApiProperty({required: true})
  @IsNotEmpty()
  accountId: number;
}
