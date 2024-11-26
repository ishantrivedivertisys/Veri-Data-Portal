import { Min, IsOptional } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class AccountListPaginated {
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

  @Expose()
  @IsOptional()
  address_1?: string;

  @Expose()
  @IsOptional()
  city?: string;

  @Expose()
  @IsOptional()
  state?: string;

  @Expose()
  @IsOptional()
  country?: string;

  @Expose()
  @IsOptional()
  zip_code?: string;
}
