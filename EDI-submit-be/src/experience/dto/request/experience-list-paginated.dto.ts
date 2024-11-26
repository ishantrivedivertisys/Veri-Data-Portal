import { Min, IsOptional } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class ExperienceListPaginated {
  @Expose()
  @IsOptional()
  search?: string;

  @Expose()
  @IsOptional()
  limit?: number;

  @Expose()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @Expose()
  @IsOptional()
  sortColumn?: string;

  @Expose()
  @IsOptional()
  sortType?: 'ASC' | 'DESC' = 'DESC';
}
