import { FileUpload } from "src/file-upload/entities/fileUpoad.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: 'CUSTOMER_TEMPLATE'})
export class CustomerTemplate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'int', nullable: true})
    customerId: number;

    @Column({name: 'DATASITE', type: 'number', nullable: true})
    datasite: number;

    @Column({type: 'varchar', nullable: true})
    name: string;

    // @Column({type: 'int', nullable: true})
    // headerRows: number;

    // @Column({type: 'varchar', nullable: true})
    // skipRows: string;

    // @Column({type: 'varchar', nullable: true})
    // skipColumns: string;

    @Column({type: 'varchar', nullable: true})
    customerRefNo: string;

    @Column({type: 'varchar', nullable: true})
    accountName1: string;
    
    @Column({type: 'varchar', nullable: true})
    accountName2: string;	
    
    @Column({type: 'varchar', nullable: true})
    address1: string;	
    
    @Column({type: 'varchar', nullable: true})
    address2: string;	
    
    @Column({type: 'varchar', nullable: true})
    city: string;	
    
    @Column({type: 'varchar', nullable: true})
    zipCode: string;	

    @Column({type: 'varchar', nullable: true})
    stateCode: string;	
    
    @Column({type: 'varchar', nullable: true})
    countryCode	: string;
    
    @Column({type: 'varchar', nullable: true})
    phone: string;	
    
    @Column({type: 'varchar', nullable: true})
    figureDate: string;
    
    @Column({type: 'varchar', nullable: true})
    lastSaleDate: string;	
    
    @Column({type: 'varchar', nullable: true})
    yearAccountOpened: string;	

    @Column({type: 'varchar', nullable: true})
    term1: string;

    @Column({type: 'varchar', nullable: true})
    term2: string;

    @Column({type: 'varchar', nullable: true})
    open_term1: string;

    @Column({type: 'varchar', nullable: true})
    open_term2: string;
    
    @Column({type: 'varchar', nullable: true})
    highCredit: string;	
    
    @Column({type: 'varchar', nullable: true})
    totalOwing: string;	
    
    @Column({type: 'varchar', nullable: true})
    current: string;
    
    @Column({type: 'varchar', nullable: true})
    dating: string;	 
    
    @Column({type: 'varchar', nullable: true})
    aging1_30: string; 	 
    
    @Column({type: 'varchar', nullable: true})
    aging31_60: string; 
    
    @Column({type: 'varchar', nullable: true})
    aging61_90: string;
    
    @Column({type: 'varchar', nullable: true})
    agingOver90: string;

    @Column({type: 'varchar', nullable: true})
    dispute1_30: string; 	 
    
    @Column({type: 'varchar', nullable: true})
    dispute31_60: string; 
    
    @Column({type: 'varchar', nullable: true})
    dispute61_90: string;
    
    @Column({type: 'varchar', nullable: true})
    disputeOver90: string;

    @Column({type: 'varchar', nullable: true})
    averageDays: string; 	 
    
    @Column({type: 'varchar', nullable: true})
    mannerOfPayment: string; 
    
    @Column({type: 'varchar', nullable: true})
    contact: string;
    
    @Column({type: 'varchar', nullable: true})
    contactJobTitle: string;

    @Column({type: 'varchar', nullable: true})
    contactTelephone: string; 	 
    
    @Column({type: 'varchar', nullable: true})
    contactEmail: string; 
    
    @Column({type: 'varchar', nullable: true})
    commentCode: string;
    
    @Column({type: 'varchar', nullable: true})
    comments: string;

    @Column({type: 'varchar', nullable: true})
    currencies: string;

    @OneToMany(() => FileUpload, (fileUpload: FileUpload) => fileUpload.customerTemplate)
    fileUpload: FileUpload;

    @CreateDateColumn({ type: "timestamp" })
    createdDate: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: true, default: () => 'null' })
    updatedDate: Date;
}
