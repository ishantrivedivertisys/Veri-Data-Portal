import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreateEdisubmitterDto {
    @ApiProperty()
    @IsOptional()
    id?: number;

    @ApiProperty()
    @IsOptional()
    actionPending: number;

    @ApiProperty()
    @IsOptional()
    arPackage: string;

    @ApiProperty()
    @IsOptional()
    sender: string;

    @ApiProperty()
    @IsOptional()
    creditRep: number;

    @ApiProperty()
    @IsOptional()
    customer: number;

    @ApiProperty()
    @IsOptional()
    daysLate: number;

    @ApiProperty()
    @IsOptional()
    fileFormat: number;

    @ApiProperty()
    @IsOptional()
    firstContact: Date;

    @ApiProperty()
    @IsOptional()
    firstTransfer: Date;

    @ApiProperty()
    @IsOptional()
    lastTransfer: Date;

    @ApiProperty()
    @IsOptional()
    mailBackRep: number;

    @ApiProperty()
    @IsOptional()
    message: string;

    @ApiProperty()
    @IsOptional()
    misRep: number;

    @ApiProperty()
    @IsOptional()
    note: number;

    @ApiProperty()
    @IsOptional()
    senderMail: string;

    @ApiProperty()
    @IsOptional()
    numberOfAccounts: number;

    @ApiProperty()
    @IsOptional()
    os: string;

    @ApiProperty()
    @IsOptional()
    sendLateNotification: number;

    @ApiProperty()
    @IsOptional()
    status: number;

    @ApiProperty()
    @IsOptional()
    transportMedia: number;

    @ApiProperty()
    @IsOptional()
    version: number;

    @ApiProperty()
    @IsOptional()
    wentProduction: Date;

    @ApiProperty()
    @IsOptional()
    experian: number;

    @ApiProperty()
    @IsOptional()
    datasite: number;

    @ApiProperty()
    @IsOptional()
    sicCode: string;

    @ApiProperty()
    @IsOptional()
    exportsToExperian: number;

    @ApiProperty()
    @IsOptional()
    experianIndustry: number;

    @ApiProperty()
    @IsOptional()
    fileLayout: string;
}
