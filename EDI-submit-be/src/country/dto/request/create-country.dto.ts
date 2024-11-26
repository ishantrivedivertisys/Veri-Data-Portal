import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreateCountryDto {
    @ApiProperty()
    @IsOptional()
    code: string;

    @ApiProperty()
    @IsOptional()
    name: string;

    @ApiProperty()
    @IsOptional()
    region: number;

    @ApiProperty()
    @IsOptional()
    twoCharCode: string;
}
