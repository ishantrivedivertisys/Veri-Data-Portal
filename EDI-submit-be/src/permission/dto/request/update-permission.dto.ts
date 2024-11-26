import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdatePermissionDto {
    @ApiProperty()
    @IsOptional()
    name: string;
  
    @ApiProperty()
    @IsOptional()
    status: string;

    @ApiProperty()
    @IsOptional()
    permissionGroupName: string;

    @ApiProperty()
    @IsOptional()
    permissionSubGroupName: string;

    @ApiProperty()
    @IsOptional()
    permissionKey: string;
}