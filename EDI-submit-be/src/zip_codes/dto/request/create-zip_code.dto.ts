import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreateZipCodeDto {
    @ApiProperty()
    @IsOptional()
    id: number;

    @ApiProperty()
    @IsOptional()
    zip_code: string;

    @ApiProperty()
    @IsOptional()
    zip_code_type: string;

    @ApiProperty()
    @IsOptional()
    city: string;

    @ApiProperty()
    @IsOptional()
    state: string;

    @ApiProperty()
    @IsOptional()
    lat: number;

    @ApiProperty()
    @IsOptional()
    lon: number;

    @ApiProperty()
    @IsOptional()
    country: string;
}
