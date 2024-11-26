import { CustomerTemplate } from "src/customer-template/entities/customer-template.entity";
import { Experience } from "src/experience/entities/experience.entity";
import { TempData } from "src/temp-data/entities/temp-data.entity";
import { TempExperience } from "src/temp-experience/entities/temp-experience.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ProcessStatus } from "./processStatus.enum";

@Entity({name: 'FILE_UPLOAD'})
export class FileUpload {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar'})
    fileName: string;

    @Column({ type: 'varchar', length: 2000 })
    filePath: string;

    @Column({ type: 'int' })
    fileSize: number;

    @Column({ type: 'int' })
    noOfRows: number;

    @Column({ type: 'varchar', nullable: true })
    status?: string;

    @Column({ name: 'STATUSREASON', type: 'varchar', nullable: true })
    statusReason?: string;

    @Column({ type: 'int', nullable: true })
    customerNo: number;

    @Column({ name: 'DATASITE', type: 'number', nullable: true })
    datasite: number;

    @ManyToOne(() => CustomerTemplate, (customerTemplate: CustomerTemplate) => customerTemplate.fileUpload,{
        eager: false,
        onDelete: 'CASCADE'
    })
    customerTemplate: CustomerTemplate[];

    @Column({ type: 'number', nullable: true })
    customerTemplateId: number;

    @Column({ name: 'MEMBER', type: 'varchar', nullable: true })
    member: string;

    @Column({ name: 'DATE_OF_TRANSFER', type: 'date', nullable: true })
    dateOfTransfer: Date;

    @Column({ name: 'DATE_OF_FIGURES', type: 'date', nullable: true })
    dateOfFigures: Date;

    @Column({ name: 'RECORD_COUNT', type: 'number', nullable: true })
    recordCount: number;

    @Column({ name: 'CANADIAN_ACCOUNTS', type: 'number', nullable: true })
    canadianAccounts: number;

    @Column({ name: 'OTHER_INTERNATIONAL_EURO', type: 'number', nullable: true })
    otherInternationalEURO: number;

    @Column({ name: 'OTHER_INTERNATIONAL_GBP', type: 'number', nullable: true })
    otherInternationalGBP: number;

    @Column({ name: 'INVALID_RECORD_COUNT', type: 'number', nullable: true })
    invalidRecordCount: number;

    @Column({ name: 'NEW_RECORDS', type: 'number', nullable: true })
    newRecords: number;

    @Column({ name: 'INACTIVE_ACCOUNTS', type: 'number', nullable: true })
    inactiveAccounts: number;

    @Column({ name: 'MAPPED_RECORDS', type: 'number', nullable: true })
    mappedRecords: number;

    @Column({ name: 'CONTRIBUTOR_NO', type: 'number', nullable: true })
    contributorNo: number;

    @Column({ name: 'ASSOCIATION', type: 'number', nullable: true })
    association: number;

    @Column({ name: 'UNFOUND_COUNT', type: 'number', nullable: true })
    unfoundCount: number;

    @Column({ name: 'MODIFIED_COUNT', type: 'number', nullable: true })
    modifiedCount: number;

    @Column({ name: 'ELASPSED_TIME', type: 'date', nullable: true })
    elapsedTime: Date;

    @Column({ name: 'TRANSFER_RATE', type: 'number', nullable: true })
    transferRate: Date;

    @CreateDateColumn({ type: 'timestamp' })
    createdDate: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: true, default: () => 'null' })
    updatedDate: Date;

    @OneToMany(() => TempExperience, (tempExperience: TempExperience) => tempExperience.fileUpload)
    tempExperience: TempExperience;

    // @OneToMany(() => Experience, (experience: Experience) => experience.fileUpload)
    // experience: Experience;

    @OneToMany(() => TempData, (tempData: TempData) => tempData.fileUpload)
    tempData: TempData;

    @Column({name: 'PROCESS_STATUS', type: 'varchar', default: ProcessStatus.PENDING})
    processStatus: string;

    @Column({ name: 'UNMATCHED_COLUMNS', type: 'varchar', nullable: true })
    unmatchedColumns: string;
}