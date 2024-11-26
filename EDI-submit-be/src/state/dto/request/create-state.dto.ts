import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreateStateDto {
    @ApiProperty()
    @IsOptional()
    country: number;

    @ApiProperty()
    @IsOptional()
    code: string;

    @ApiProperty()
    @IsOptional()
    name: string;
}
