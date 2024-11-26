import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateAccountDto {
    @ApiProperty()
    @IsOptional()
    dunsNo?: number;

    @ApiProperty()
    @IsOptional()
    name_1?: string;

    @ApiProperty()
    @IsOptional()
    name_2?: string;

    @ApiProperty()
    @IsOptional()
    address_1?: string;

    @ApiProperty()
    @IsOptional()
    address_2?: string;

    @ApiProperty()
    @IsOptional()
    city?: string;

    @ApiProperty()
    @IsOptional()
    zip_code?: string;

    @ApiProperty()
    @IsOptional()
    state?: string;

    @ApiProperty()
    @IsOptional()
    country?: number;

    @ApiProperty()
    @IsOptional()
    branch?: string;

    @ApiProperty()
    @IsOptional()
    parent?: number;

    @ApiProperty()
    @IsOptional()
    refer_to?: number;

    @ApiProperty()
    @IsOptional()
    principal?: string;

    @ApiProperty()
    @IsOptional()
    message?: string;

    @ApiProperty()
    @IsOptional()
    sic_code?: number;

    @ApiProperty()
    @IsOptional()
    created?: number;

    @ApiProperty()
    @IsOptional()
    activity?: number;

    @ApiProperty()
    @IsOptional()
    modified?: number;

    @ApiProperty()
    @IsOptional()
    internalMsg?: string;

    @ApiProperty()
    @IsOptional()
    aliases?: string;

    @ApiProperty()
    @IsOptional()
    lat?: number;

    @ApiProperty()
    @IsOptional()
    lon?: number;

    @ApiProperty()
    @IsOptional()
    fId?: string;

    @ApiProperty()
    @IsOptional()
    website?: string;

    @ApiProperty()
    @IsOptional()
    parent_name?: string;

    @ApiProperty()
    @IsOptional()
    date_business_established?: Date;

    @ApiProperty()
    @IsOptional()
    date_of_incorporation?: Date;

    @ApiProperty()
    @IsOptional()
    state_of_incorporation?: string;
}
