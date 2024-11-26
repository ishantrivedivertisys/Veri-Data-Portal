import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CustomerAndDatasiteDto {
  @ApiProperty({required: true})
  @IsNotEmpty()
  customer: number;

  @ApiProperty({required: true})
  @IsNotEmpty()
  datasite: number;
}
