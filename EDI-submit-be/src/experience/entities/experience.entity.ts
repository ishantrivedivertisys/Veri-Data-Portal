import { FileUpload } from "src/file-upload/entities/fileUpoad.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: 'EXPERIENCE', synchronize: false})
export class Experience {
    // @PrimaryColumn({type: 'number'})
    // id?: number;

    @PrimaryColumn({name: 'ACCOUNT', type: 'number'})
    account: number;

    @PrimaryColumn({name: 'CUSTOMER', type: 'number'})
    customer: number;

    @PrimaryColumn({name: 'FIGURE_DATE', type: 'number'})
    figureDate: number;

    @Column({ name: 'FIGURE_DAY', type: 'number', nullable: true})
    figureDay: number;

    @Column({name: 'ENTRY_DATE',type: 'number', nullable: true})
    entryDate: number;
    
    @Column({name: 'GROUP_NO', type: 'number', nullable: true})
    groupNo: number;

    @Column({name: 'MEMBER_NO', type: 'number', nullable: true})
    memberNo: number;
    
    @Column({name: 'MEMBER_SUB', type: 'varchar', nullable: true})
    memberSub: string;

    @Column({name: 'OPEN_TERM1', type: 'varchar', nullable: true})
    openTerm1: string;

    @Column({name: 'OPEN_TERM2', type: 'varchar', nullable: true})
    openTerm2: string;

    @Column({name: 'TERM1', type: 'varchar', nullable: true})
    term1: string;

    @Column({name: 'TERM2', type: 'varchar', nullable: true})
    term2: string;

    @Column({name: 'LAST_SALE', type: 'number', nullable: true})
    lastSale: number;
    
    @Column({name: 'YEAR_ACCT_OPENED', type: 'number', nullable: true})
    yearAccountOpened: number;

    @Column({name: 'MANNER', type: 'varchar', nullable: true})
    mannerOfPayment: string;

    @Column({name: 'HIGH_CREDIT', type: 'decimal', precision: 20, scale: 2, nullable: true})
    highCredit: number;
    
    @Column({name: 'TOTAL_OWING', type: 'decimal', precision: 20, scale: 2, nullable: true})
    totalOwing: number;

    @Column({name: 'NOT_YET_DUE', type: 'decimal', precision: 20, scale: 2, nullable: true})
    notYetDue: number;

    @Column({name: 'CURRENT_AMT', type: 'decimal', precision: 20, scale: 2, nullable: true})
    current: number;
    
    @Column({name: 'AGING1_30', type: 'decimal', precision: 20, scale: 2, nullable: true})
    aging1_30: number; 
    
    @Column({name: 'AGING31_60', type: 'decimal', precision: 20, scale: 2, nullable: true})
    aging31_60: number;
    
    @Column({name: 'AGING61_90', type: 'decimal', precision: 20, scale: 2, nullable: true})
    aging61_90: number;
    
    @Column({name: 'AGING_OVER_90', type: 'decimal', precision: 20, scale: 2, nullable: true})
    agingOver90: number;

    @Column({name: 'DISP1_30', type: 'varchar', nullable: true})
    dispute1_30: string;
    
    @Column({name: 'DISP31_60', type: 'varchar', nullable: true})
    dispute31_60: string;
    
    @Column({name: 'DISP61_90', type: 'varchar', nullable: true})
    dispute61_90: string;
    
    @Column({name: 'DISP_OVER_90', type: 'varchar', nullable: true})
    disputeOver90: string;

    @Column({name: 'CODES', type: 'varchar', nullable: true})
    commentCode: string;
    
    @Column({name: 'COMMENTS', type: 'varchar', nullable: true})
    comments: string;

    @Column({name: 'AVDAYS', type: 'number', nullable: true})
    averageDays: number;

    @Column({name: 'SOURCE', type: 'varchar', nullable: true})
    source: string;
    
    @PrimaryColumn({name: 'DATASITE', type: 'number'})
    dataSite: number;

    @Column({name: 'VALIDATED', type: 'number', nullable: true})
    validated: number;

    @Column({name: 'DISP91_120', type: 'varchar', nullable: true})
    dispute91_120: string;
    
    @Column({name: 'DISP_OVER_120', type: 'varchar', nullable: true})
    disputeOver120: string;

    @Column({name: 'AGING91_120', type: 'decimal', precision: 20, scale: 2, nullable: true})
    aging91_120: number;
    
    @Column({name: 'AGING_OVER_120', type: 'decimal', precision: 20, scale: 2, nullable: true})
    agingOver120: number;

    @Column({name: 'DAYSTOREPORT', type: 'number', nullable: true})
    daysToReport: number;

    @Column({name: 'REPORTFREQ', type: 'varchar', nullable: true})
    reportFreq: string;
    
    @Column({name: 'REPORTSOS', type: 'varchar', nullable: true})
    reportSos: string;

    @Column({name: 'OVER120USED', type: 'number', nullable: true})
    over120Used: number;

    // @ManyToOne(() => FileUpload, (fileUpload: FileUpload) => fileUpload.experience, {
    //     eager: false,
    //     onDelete: 'CASCADE'
    // })
    // fileUpload: FileUpload[];

    // @Column({ type: 'int', nullable: true})
    // fileUploadId?: number;
}
