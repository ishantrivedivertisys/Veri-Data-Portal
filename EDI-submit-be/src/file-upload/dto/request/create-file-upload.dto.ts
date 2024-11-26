import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreateFileUploadDto {
    @ApiProperty()
    @IsOptional()
    fileName: string;
  
    @ApiProperty()
    @IsOptional()
    filePath: string;
  
    @ApiProperty()
    @IsOptional()
    fileSize: number;

    @ApiProperty()
    @IsOptional()
    noOfRows: number;
  
    @ApiProperty()
    @IsOptional()
    status: string;

    @ApiProperty()
    @IsOptional()
    statusReason: string;

    @ApiProperty()
    @IsOptional()
    customerNo: number;

    @ApiProperty()
    @IsOptional()
    datasite: number;

    @ApiProperty()
    @IsOptional()
    customerTemplateId: number;

    @ApiProperty()
    @IsOptional()
    unmatchedColumns: string;
  }