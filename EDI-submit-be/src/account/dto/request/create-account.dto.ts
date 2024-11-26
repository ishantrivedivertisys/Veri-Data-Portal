import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, MaxLength } from "class-validator";

export class CreateAccountDto {
    @IsOptional()
    id?: number;

    @ApiProperty()
    @IsOptional()
    dunsNo: number;

    @ApiProperty()
    @IsNotEmpty()
    @MaxLength(250, {message: 'Name 1 length should not be greater than 250 words'})
    name_1: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(250, {message: 'Name 2 length should not be greater than 250 words'})
    name_2: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(250, {message: 'Address 1 length should not be greater than 250 words'})
    address_1: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(250, {message: 'Address 2 length should not be greater than 250 words'})
    address_2: string;

    @ApiProperty()
    @IsNotEmpty()
    @MaxLength(250, {message: 'City length should not be greater than 250 words'})
    city: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(9, {message: 'Zip code length should not be greater than 9 words'})
    zip_code: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(2, {message: 'State should not be greater than 2 character'})
    state: string;

    @ApiProperty()
    @IsNotEmpty()
    country: number;

    @ApiProperty()
    @IsOptional()
    branch: string;

    @ApiProperty()
    @IsOptional()
    parent: number;

    @ApiProperty()
    @IsOptional()
    refer_to: number;

    @ApiProperty()
    @IsOptional()
    @MaxLength(30, {message: 'Principal length should not be greater than 30 words'})
    principal: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(100, {message: 'Message length should not be greater than 100 words'})
    message: string;

    @ApiProperty()
    @IsOptional()
    sic_code: number;

    @ApiProperty()
    @IsOptional()
    created?: number;

    @ApiProperty()
    @IsOptional()
    activity: number;

    @ApiProperty()
    @IsOptional()
    modified?: number;

    @ApiProperty()
    @IsOptional()
    internalMsg: string;

    @ApiProperty()
    @IsOptional()
    aliases: string;

    @ApiProperty()
    @IsOptional()
    lat: number;

    @ApiProperty()
    @IsOptional()
    lon: number;

    @ApiProperty()
    @IsOptional()
    fId: string;

    @ApiProperty()
    @IsOptional()
    website: string;

    @ApiProperty()
    @IsOptional()
    parent_name: string;

    @ApiProperty()
    @IsOptional()
    date_business_established: Date;

    @ApiProperty()
    @IsOptional()
    date_of_incorporation: Date;

    @ApiProperty()
    @IsOptional()
    state_of_incorporation: string;
}
