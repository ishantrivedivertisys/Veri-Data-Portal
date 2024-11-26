import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsNotEmpty } from "class-validator";

export class CreatePermisssionDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;
  
    @ApiProperty()
    @IsOptional()
    @IsString()
    status: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    permissionGroupName: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    permissionSubGroupName: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    permissionKey: string;
  }