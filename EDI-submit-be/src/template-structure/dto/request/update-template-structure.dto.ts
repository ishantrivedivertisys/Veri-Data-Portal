import { ApiProperty } from '@nestjs/swagger';
import { CreateTemplateStructureDto } from './create-template-structure.dto';
import { IsOptional } from 'class-validator';

export class UpdateTemplateStructureDto{
    @ApiProperty()
    @IsOptional()
    id?: number;

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

    @ApiProperty()
    @IsOptional()
    isReplaceOld?: boolean;

    @ApiProperty()
    @IsOptional()
    fileUploadId?: number;
}
