import { IsNotEmpty, IsEmail, IsString, IsEnum, IsEmpty, IsDate, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class updatePasswordDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    id?: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    otp?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email?: string;
}