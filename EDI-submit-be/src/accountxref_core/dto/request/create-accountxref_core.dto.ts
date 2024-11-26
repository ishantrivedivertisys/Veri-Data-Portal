import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreateAccountxrefCoreDto {
    @ApiProperty()
    @IsOptional()
    custRefNo: string;

    @ApiProperty()
    @IsOptional()
    account: number;

    @ApiProperty()
    @IsOptional()
    custNo: number;

    @ApiProperty()
    @IsOptional()
    dataSite: number;

    @ApiProperty()
    @IsOptional()
    address1: string;

    @ApiProperty()
    @IsOptional()
    address2: string;

    @ApiProperty()
    @IsOptional()
    city: string;

    @ApiProperty()
    @IsOptional()
    country: number;

    @ApiProperty()
    @IsOptional()
    crc: number;

    @ApiProperty()
    @IsOptional()
    lastTransfer: Date;

    @ApiProperty()
    @IsOptional()
    name1: string;

    @ApiProperty()
    @IsOptional()
    name2: string;

    @ApiProperty()
    @IsOptional()
    state: string;

    @ApiProperty()
    @IsOptional()
    zip: string;
}
