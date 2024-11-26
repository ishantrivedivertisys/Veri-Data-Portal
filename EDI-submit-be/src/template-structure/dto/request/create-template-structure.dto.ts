import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreateTemplateStructureDto {
    @ApiProperty()
    @IsOptional()
    templateColumnName?: string;

    @ApiProperty()
    @IsOptional()
    tableColumnName?: string;

    @ApiProperty()
    @IsOptional()
    validation?: string;

    @ApiProperty()
    @IsOptional()
    isMultipleAllow?: number;
}
