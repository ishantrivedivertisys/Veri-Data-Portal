import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FileProcessingDto {
  @ApiProperty({required: true})
  @IsNotEmpty()
  fileUrl: string;

  @ApiProperty({required: true})
  @IsNotEmpty()
  customerNo: number;

  @ApiProperty({required: false})
  @IsOptional()
  dataSite: number;
}
