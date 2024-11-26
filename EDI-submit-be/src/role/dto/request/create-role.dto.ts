import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { RoleStatus } from "src/role/entities/roleStatus.enum";

export class CreateRoleDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;
  
    @ApiProperty()
    @IsOptional()
    @IsEnum(RoleStatus)
    @Transform(({ value }) => value || RoleStatus.INACTIVE)
    status: string;
}