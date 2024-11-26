import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreateCustomerTemplateDto {
    @ApiProperty()
    @IsOptional()
    customerId?: number;

    @ApiProperty()
    @IsOptional()
    datasite: number;

    @ApiProperty()
    @IsOptional()
    name?: string;

    // @ApiProperty()
    // @IsOptional()
    // headerRows?: number;

    // @ApiProperty()
    // @IsOptional()
    // skipRows?: string;

    // @ApiProperty()
    // @IsOptional()
    // skipColumns?: string;

    @ApiProperty()
    @IsOptional()
    customerRefNo: string;

    @ApiProperty()
    @IsOptional()
    accountName1: string;
    
    @ApiProperty()
    @IsOptional()
    accountName2: string;	
    
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
    zipCode: string;	

    @ApiProperty()
    @IsOptional()
    stateCode: string;	
    
    @ApiProperty()
    @IsOptional()
    countryCode	: string;
    
    @ApiProperty()
    @IsOptional()
    phone: string;	
    
    @ApiProperty()
    @IsOptional()
    figureDate: string;
    
    @ApiProperty()
    @IsOptional()
    lastSaleDate: string;	
    
    @ApiProperty()
    @IsOptional()
    yearAccountOpened: string;	

    @ApiProperty()
    @IsOptional()
    term1: string;

    @ApiProperty()
    @IsOptional()
    term2: string;

    @ApiProperty()
    @IsOptional()
    open_term1: string;

    @ApiProperty()
    @IsOptional()
    open_term2: string;
    
    @ApiProperty()
    @IsOptional()
    highCredit: string;	
    
    @ApiProperty()
    @IsOptional()
    totalOwing: string;	
    
    @ApiProperty()
    @IsOptional()
    current: string;
    
    @ApiProperty()
    @IsOptional()
    dating: string;	 
    
    @ApiProperty()
    @IsOptional()
    aging1_30: string; 	 
    
    @ApiProperty()
    @IsOptional()
    aging31_60: string; 
    
    @ApiProperty()
    @IsOptional()
    aging61_90: string;
    
    @ApiProperty()
    @IsOptional()
    agingOver90: string;

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
    averageDays: string; 	 
    
    @ApiProperty()
    @IsOptional()
    mannerOfPayment: string; 
    
    @ApiProperty()
    @IsOptional()
    contact: string;
    
    @ApiProperty()
    @IsOptional()
    contactJobTitle: string;

    @ApiProperty()
    @IsOptional()
    contactTelephone: string; 	 
    
    @ApiProperty()
    @IsOptional()
    contactEmail: string; 
    
    @ApiProperty()
    @IsOptional()
    commentCode: string;
    
    @ApiProperty()
    @IsOptional()
    comments: string;

    @ApiProperty()
    @IsOptional()
    currencies: string;

    @ApiProperty()
    @IsOptional()
    isVerified: boolean;
}
