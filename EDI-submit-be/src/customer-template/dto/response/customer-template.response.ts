import { Expose } from "class-transformer";
import { TransformDateToEpoch } from "src/common/helpers/decorators/transformDateToEpoch";

export class CustomerTemplateResponse {
    @Expose()
    customerId: number;

    @Expose()
    datasite: number;

    @Expose()
    name: string;

    // @Expose()
    // headerRows: number;

    // @Expose()
    // skipRows: string;

    // @Expose()
    // skipColumns: string;

    @Expose()
    customerRefNo: string;

    @Expose()
    accountName1: string;
    
    @Expose()
    accountName2: string;	
    
    @Expose()
    address1: string;	
    
    @Expose()
    address2: string;	
    
    @Expose()
    city: string;	
    
    @Expose()
    zipCode: string;	

    @Expose()
    stateCode: string;	
    
    @Expose()
    countryCode	: string;
    
    @Expose()
    phone: string;	
    
    @Expose()
    figureDate: string;
    
    @Expose()
    lastSaleDate: string;	
    
    @Expose()
    yearAccountOpened: string;	

    @Expose()
    term1: string;

    @Expose()
    term2: string;

    @Expose()
    open_term1: string;

    @Expose()
    open_term2: string;
    
    @Expose()
    highCredit: string;	
    
    @Expose()
    totalOwing: string;	
    
    @Expose()
    current: string;
    
    @Expose()
    dating: string;	 
    
    @Expose()
    aging1_30: string; 	 
    
    @Expose()
    aging31_60: string; 
    
    @Expose()
    aging61_90: string;
    
    @Expose()
    agingOver90: string;

    @Expose()
    dispute1_30: string; 	 
    
    @Expose()
    dispute31_60: string; 
    
    @Expose()
    dispute61_90: string;
    
    @Expose()
    disputeOver90: string;

    @Expose()
    averageDays: string; 	 
    
    @Expose()
    mannerOfPayment: string; 
    
    @Expose()
    contact: string;
    
    @Expose()
    contactJobTitle: string;

    @Expose()
    contactTelephone: string; 	 
    
    @Expose()
    contactEmail: string; 
    
    @Expose()
    commentCode: string;
    
    @Expose()
    comments: string;

    @Expose()
    currencies: string;

    @TransformDateToEpoch()
    @Expose()
    createdAt?: number;

    @TransformDateToEpoch()
    @Expose()
    updatedAt?: number;  
}