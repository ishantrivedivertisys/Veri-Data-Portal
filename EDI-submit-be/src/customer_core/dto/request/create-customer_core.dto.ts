import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreateCustomerCoreDto {
    @ApiProperty()
    @IsOptional()
    name1: string;

    @ApiProperty()
    @IsOptional()
    name2: string;

    @ApiProperty()
    @IsOptional()
    message: string;

    @ApiProperty()
    @IsOptional()
    created: number;

    @ApiProperty()
    @IsOptional()
    createUser: string;

    @ApiProperty()
    @IsOptional()
    modified: number;

    @ApiProperty()
    @IsOptional()
    modUser: string;

    @ApiProperty()
    @IsOptional()
    note: number;

    @ApiProperty()
    @IsOptional()
    aliases: string;

    @ApiProperty()
    @IsOptional()
    industry: number;

    @ApiProperty()
    @IsOptional()
    creditAppCode: string;

    @ApiProperty()
    @IsOptional()
    creditAppEnabled: number;

    @ApiProperty()
    @IsOptional()
    creditAppStart: number;

    @ApiProperty()
    @IsOptional()
    creditAppTierCount: number;

    @ApiProperty()
    @IsOptional()
    autoEmailCreditRefs: number;

    @ApiProperty()
    @IsOptional()
    rcTrackerEnabled: number;
}
