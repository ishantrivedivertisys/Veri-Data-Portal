import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { FileUpload } from "src/file-upload/entities/fileUpoad.entity";
import { Account } from "src/account/entities/account.entity";
import { Country } from "src/country/entities/country.entity";
import { State } from "src/state/entities/state.entity";
import { Accountxref } from "src/accountxref_core/entities/accountxref_core.entity";

@Entity({name: 'TEMP_EXPERIENCE'})
export class TempExperience {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'nvarchar2', nullable: true})
    customerRefNo: string;

    // @ManyToOne(() => AccountxrefCore, (accountXref: AccountxrefCore) => accountXref.tempExperience,
    // {
    //     eager: false,
    //     onDelete: 'CASCADE'
    // })
    // @JoinColumn({name: 'customerNo', referencedColumnName: 'custRefNo'})
    // customer: AccountxrefCore[];

    @Column({name: 'customerNo', type: 'int', nullable: true})
    customerNo: number;


    @Column({name: 'DATASITE', type: 'number', nullable: true})
    datasite: number;

    @Column({type: 'nvarchar2', nullable: true})
    accountName1: string;
    
    @Column({type: 'nvarchar2', nullable: true})
    accountName2: string;	
    
    @Column({type: 'nvarchar2', nullable: true})
    address1: string;	
    
    @Column({type: 'nvarchar2', nullable: true})
    address2: string;	
    
    @Column({type: 'nvarchar2', nullable: true})
    city: string;	
    
    @Column({type: 'nvarchar2', nullable: true})
    zipCode: string;	

    @Column({type: 'nvarchar2', nullable: true})
    stateCode: string;	
    
    @Column({type: 'nvarchar2', nullable: true})
    countryCode	: string;
    
    @Column({type: 'nvarchar2', nullable: true})
    phone: string;	
    
    @Column({type: 'nvarchar2', nullable: true})
    figureDate: string;
    
    @Column({type: 'nvarchar2', nullable: true})
    lastSaleDate: string;	
    
    @Column({type: 'nvarchar2', nullable: true})
    yearAccountOpened: string;	

    @Column({type: 'nvarchar2', nullable: true})
    term1: string;

    @Column({type: 'nvarchar2', nullable: true})
    term2: string;

    @Column({type: 'nvarchar2', nullable: true})
    open_term1: string;

    @Column({type: 'nvarchar2', nullable: true})
    open_term2: string;
    
    @Column({type: 'nvarchar2', nullable: true})
    highCredit: string;	
    
    @Column({type: 'nvarchar2', nullable: true})
    totalOwing: string;	
    
    @Column({type: 'nvarchar2', nullable: true})
    current: string;
    
    @Column({type: 'nvarchar2', nullable: true})
    dating: string;	 
    
    @Column({type: 'nvarchar2', nullable: true})
    aging1_30: string; 	 
    
    @Column({type: 'nvarchar2', nullable: true})
    aging31_60: string; 
    
    @Column({type: 'nvarchar2', nullable: true})
    aging61_90: string;
    
    @Column({type: 'nvarchar2', nullable: true})
    agingOver90: string;

    @Column({type: 'nvarchar2', nullable: true})
    dispute1_30: string; 	 
    
    @Column({type: 'nvarchar2', nullable: true})
    dispute31_60: string; 
    
    @Column({type: 'nvarchar2', nullable: true})
    dispute61_90: string;
    
    @Column({type: 'nvarchar2', nullable: true})
    disputeOver90: string;

    @Column({type: 'nvarchar2', nullable: true})
    averageDays: string; 	 
    
    @Column({type: 'nvarchar2', nullable: true})
    mannerOfPayment: string; 
    
    @Column({type: 'nvarchar2', nullable: true})
    contact: string;
    
    @Column({type: 'nvarchar2', nullable: true})
    contactJobTitle: string;

    @Column({type: 'nvarchar2', nullable: true})
    contactTelephone: string; 	 
    
    @Column({type: 'nvarchar2', nullable: true})
    contactEmail: string; 
    
    @Column({type: 'nvarchar2', nullable: true})
    commentCode: string;
    
    @Column({type: 'nvarchar2', nullable: true})
    comments: string;

    @Column({type: 'nvarchar2', nullable: true})
    currencies: string;

    @Column({type: 'nvarchar2', length: 1000, nullable: true})
    error: string;

    @Column({type: 'nvarchar2', nullable: true})
    warning: string;
    
    @Column({type: 'nvarchar2', nullable: true})
    result: string;

    @Column({ type: 'nvarchar2', nullable: true })
    status: string;

    @Column({type: 'nvarchar2', nullable: true})
    customerRefNo_history: string;

    @Column({type: 'nvarchar2', nullable: true})
    accountName1_history: string;
    
    @Column({type: 'nvarchar2', nullable: true})
    accountName2_history: string;	
    
    @Column({type: 'nvarchar2', nullable: true})
    address1_history: string;	
    
    @Column({type: 'nvarchar2', nullable: true})
    address2_history: string;	
    
    @Column({type: 'nvarchar2', nullable: true})
    city_history: string;	
    
    @Column({type: 'nvarchar2', nullable: true})
    zipCode_history: string;	

    @Column({type: 'nvarchar2', nullable: true})
    stateCode_history: string;	
    
    @Column({type: 'nvarchar2', nullable: true})
    countryCode_history: string;
    
    @Column({type: 'nvarchar2', nullable: true})
    phone_history: string;	
    
    @Column({type: 'nvarchar2', nullable: true})
    figureDate_history: string;
    
    @Column({type: 'nvarchar2', nullable: true})
    lastSaleDate_history: string;	
    
    @Column({type: 'nvarchar2', nullable: true})
    yearAccountOpened_history: string;	

    @Column({type: 'nvarchar2', nullable: true})
    term1_history: string;

    @Column({type: 'nvarchar2', nullable: true})
    term2_history: string;

    @Column({type: 'nvarchar2', nullable: true})
    open_term1_history: string;

    @Column({type: 'nvarchar2', nullable: true})
    open_term2_history: string;
    
    @Column({type: 'nvarchar2', nullable: true})
    highCredit_history: string;	
    
    @Column({type: 'nvarchar2', nullable: true})
    totalOwing_history: string;	
    
    @Column({type: 'nvarchar2', nullable: true})
    current_history: string;
    
    @Column({type: 'nvarchar2', nullable: true})
    dating_history: string;	 
    
    @Column({type: 'nvarchar2', nullable: true})
    aging1_30_history: string; 	 
    
    @Column({type: 'nvarchar2', nullable: true})
    aging31_60_history: string; 
    
    @Column({type: 'nvarchar2', nullable: true})
    aging61_90_history: string;
    
    @Column({type: 'nvarchar2', nullable: true})
    agingOver90_history: string;

    @Column({type: 'nvarchar2', nullable: true})
    dispute1_30_history: string; 	 
    
    @Column({type: 'nvarchar2', nullable: true})
    dispute31_60_history: string; 
    
    @Column({type: 'nvarchar2', nullable: true})
    dispute61_90_history: string;
    
    @Column({type: 'nvarchar2', nullable: true})
    disputeOver90_history: string;

    @Column({type: 'nvarchar2', nullable: true})
    averageDays_history: string; 	 
    
    @Column({type: 'nvarchar2', nullable: true})
    mannerOfPayment_history: string; 
    
    @Column({type: 'nvarchar2', nullable: true})
    contact_history: string;
    
    @Column({type: 'nvarchar2', nullable: true})
    contactJobTitle_history: string;

    @Column({type: 'nvarchar2', nullable: true})
    contactTelephone_history: string; 	 
    
    @Column({type: 'nvarchar2', nullable: true})
    contactEmail_history: string; 
    
    @Column({type: 'nvarchar2', nullable: true})
    commentCode_history: string;
    
    @Column({type: 'nvarchar2', nullable: true})
    comments_history: string;

    @Column({type: 'nvarchar2', nullable: true})
    currencies_history: string;

    @ManyToOne(() => FileUpload, (fileUpload: FileUpload) => fileUpload.tempExperience, {
        eager: false,
        onDelete: 'CASCADE'
    })
    fileUpload: FileUpload[];

    @Column({ type: 'number', nullable: true})
    fileUploadId: number;

    // @ManyToOne(() => Account, (account: Account) => account.tempExperience, {
    //     eager: false,
    //     onDelete: 'CASCADE'
    // })
    // account: Account[];

    @Column({ type: 'number', nullable: true})
    accountId: number;

    // @ManyToOne(() => Country, (country: Country) => country.tempExperience, {
    //     eager: false,
    //     onDelete: 'CASCADE'
    // })
    // country: Country[];

    @Column({ type: 'number', nullable: true})
    countryId: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdDate: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: true, default: () => 'null' })
    updatedDate: Date;
}
