import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreateExperienceDto {
    @ApiProperty()
    @IsOptional()
    account: number;

    @ApiProperty()
    @IsOptional()
    customer: number;
    
    @ApiProperty()
    @IsOptional()
    figureDate: number;

    @ApiProperty()
    @IsOptional()
    figureDay: number;

    @ApiProperty()
    @IsOptional()
    entryDate: number;
    
    @ApiProperty()
    @IsOptional()
    groupNo: number;

    @ApiProperty()
    @IsOptional()
    memberNo: number;
    
    @ApiProperty()
    @IsOptional()
    memberSub: string;

    @ApiProperty()
    @IsOptional()
    openTerm1: string;

    @ApiProperty()
    @IsOptional()
    openTerm2: string;

    @ApiProperty()
    @IsOptional()
    term1: string;

    @ApiProperty()
    @IsOptional()
    term2: string;
    
    @ApiProperty()
    @IsOptional()
    lastSale: number;
    
    @ApiProperty()
    @IsOptional()
    yearAccountOpened: number;

    @ApiProperty()
    @IsOptional()
    mannerOfPayment: string;
    
    @ApiProperty()
    @IsOptional()
    highCredit: number;
    
    @ApiProperty()
    @IsOptional()
    totalOwing: number;

    @ApiProperty()
    @IsOptional()
    notYetDue: number;
    
    @ApiProperty()
    @IsOptional()
    current: number;
    
    @ApiProperty()
    @IsOptional()
    aging1_30: number; 
    
    @ApiProperty()
    @IsOptional()
    aging31_60: number;
    
    @ApiProperty()
    @IsOptional()
    aging61_90: number;
    
    @ApiProperty()
    @IsOptional()
    agingOver90: number;

    @ApiProperty()
    @IsOptional()
    dispute1_30: string;
    
    @ApiProperty()
    @IsOptional()
    dispute31_60: string;
    
    @ApiProperty()
    @IsOptional()
    dispute61_90: string;
    
    @ApiProperty()
    @IsOptional()
    disputeOver90: string;

    @ApiProperty()
    @IsOptional()
    commentCode: string;
    
    @ApiProperty()
    @IsOptional()
    comments: string;

    @ApiProperty()
    @IsOptional()
    averageDays: number;
    
    @ApiProperty()
    @IsOptional()
    source: string;
    
    @ApiProperty()
    @IsOptional()
    dataSite: number;

    @ApiProperty()
    @IsOptional()
    validated: number;

    @ApiProperty()
    @IsOptional()
    dispute91_120: string;
    
    @ApiProperty()
    @IsOptional()
    disputeOver120: string;

    @ApiProperty()
    @IsOptional()
    aging91_120: number;
    
    @ApiProperty()
    @IsOptional()
    agingOver120: number;

    @ApiProperty()
    @IsOptional()
    daysToReport: number;

    @ApiProperty()
    @IsOptional()
    reportFreq: string;
    
    @ApiProperty()
    @IsOptional()
    reportSos: string;

    @ApiProperty()
    @IsOptional()
    over120Used: number;

    // @ApiProperty()
    // @IsOptional()
    // fileUploadId: number;

}
