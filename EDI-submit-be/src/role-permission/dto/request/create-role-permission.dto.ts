import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsNumber } from "class-validator";

export class CreateRolePermissionDto {
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    roleId?: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    permissionId?: number;
  
    @ApiProperty()
    @IsOptional()
    status: string;

  }