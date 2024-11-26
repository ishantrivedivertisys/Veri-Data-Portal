import { IsEmail, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { UsersStatus } from 'src/common/model/usersStatus';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  dob?: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty()
  @IsOptional()
  city?: any;

  @ApiProperty()
  @IsOptional()
  state?: any;

  @ApiProperty()
  @IsOptional()
  @IsString()
  zip?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(UsersStatus)
  @Transform(({ value }) => value || UsersStatus.INACTIVE)
  status?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  roleId?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  otp?: string;

  @ApiProperty()
  @IsOptional()

  skills: any;

  @ApiProperty()
  @IsOptional()
  profileImageUrl?: string;
}
