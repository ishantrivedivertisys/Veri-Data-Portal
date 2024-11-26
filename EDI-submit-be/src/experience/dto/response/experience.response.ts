import { Expose } from "class-transformer";

export class ExperienceResponse {
    @Expose()
    account: number;

    @Expose()
    customer: number;
    
    @Expose()
    figureDate: number;

    @Expose()
    figureDay: number;

    @Expose()
    entryDate: number;
    
    @Expose()
    groupNo: number;

    @Expose()
    memberNo: number;
    
    @Expose()
    memberSub: string;

    @Expose()
    openTerm1: string;

    @Expose()
    openTerm2: string;

    @Expose()
    term1: string;

    @Expose()
    term2: string;
    
    @Expose()
    lastSaleDate: number;
    
    @Expose()
    yearAccountOpened: number;

    @Expose()
    mannerOfPayment: string;
    
    @Expose()
    highCredit: number;
    
    @Expose()
    totalOwing: number;

    @Expose()
    notYetDue: number;
    
    @Expose()
    current: number;
    
    @Expose()
    dating: number;
    
    @Expose()
    aging1_30: number; 
    
    @Expose()
    aging31_60: number;
    
    @Expose()
    aging61_90: number;
    
    @Expose()
    agingOver90: number;

    @Expose()
    dispute1_30: string;
    
    @Expose()
    dispute31_60: string;
    
    @Expose()
    dispute61_90: string;
    
    @Expose()
    disputeOver90: string;

    @Expose()
    commentCode: string;
    
    @Expose()
    comments: string;

    @Expose()
    averageDays: number;
    
    @Expose()
    source: string;
    
    @Expose()
    dataSite: number;

    @Expose()
    validated: number;

    @Expose()
    dispute91_120: string;
    
    @Expose()
    disputeOver120: string;

    @Expose()
    aging91_120: number;
    
    @Expose()
    agingOver120: number;

    @Expose()
    daysToReport: number;

    @Expose()
    reportFreq: string;
    
    @Expose()
    reportSos: string;

    @Expose()
    over120Used: number;

    @Expose()
    fileUploadId: number;

}
