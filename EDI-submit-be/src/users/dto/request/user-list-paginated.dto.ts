import { Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserListPaginated {
  @ApiProperty({required: false})
  @IsOptional()
  search?: string;

  @ApiProperty({required: false})
  @IsOptional()
  limit?: number;

  @ApiProperty({required: false})
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiProperty({required: false})
  @IsOptional()
  sortColumn?: string;

  @ApiProperty({required: false})
  @IsOptional()
  sortType?: 'ASC' | 'DESC' = 'DESC';
}
