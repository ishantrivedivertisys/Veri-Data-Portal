import { Expose } from "class-transformer";
import { IsOptional } from "class-validator";

export class UpdateRolePermissionDto {
    @Expose()
    @IsOptional()
    id?: number;
  
    @Expose()
    @IsOptional()
    status?: string;
}