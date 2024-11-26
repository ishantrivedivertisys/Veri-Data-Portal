import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateTemplateAndHeaderTradeDto {
  @ApiProperty({required: true})
  @IsNotEmpty()
  fileUploadId: number;

  @ApiProperty({required: true})
  @IsNotEmpty()
  customerTemplateId: number;
}
