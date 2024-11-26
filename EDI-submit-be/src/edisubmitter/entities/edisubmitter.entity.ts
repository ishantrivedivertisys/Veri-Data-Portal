import { Customer } from "src/customer_core/entities/customer_core.entity";
import { Datasite } from "src/datasite/entities/datasite.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"

@Entity({name: 'EDISUBMITTER'})
export class Edisubmitter {
    @PrimaryColumn({name: 'ID', type: 'number'})
    id: number;

    @Column({name: 'ACTIONPENDING', type: 'int', nullable: true})
    actionPending: number;

    @Column({name: 'ARPACKAGE', type: 'varchar', nullable: true})
    arPackage: string;

    @Column({name: 'SENDER', type: 'varchar', nullable: true})
    sender: string;

    @Column({name: 'CREDITREP', type: 'number', nullable: true})
    creditRep: number;

    @ManyToOne(() => Customer, (customer: Customer) => customer.ediSubmitter, {
        eager: false,
        onDelete: 'CASCADE'
    })
    @JoinColumn({name: 'CUSTOMER', referencedColumnName: 'id'})
    customers: Customer[];

    @Column({name: 'CUSTOMER', type: 'number', nullable: true})
    customer: number;

    @Column({name: 'DAYSLATE', type: 'number', nullable: true})
    daysLate: number;

    @Column({name: 'FILEFORMAT', type: 'number', nullable: true})
    fileFormat: number;

    @Column({name: 'FIRSTCONTACT', type: 'date', nullable: true})
    firstContact: Date;

    @Column({name: 'FIRSTTRANSFER', type: 'date', nullable: true})
    firstTransfer: Date;

    @Column({name: 'LASTTRANSFER', type: 'date', nullable: true})
    lastTransfer: Date;

    @Column({name: 'MAILBACKREP', type: 'number', nullable: true})
    mailBackRep: number;

    @Column({name: 'MESSAGE', type: 'varchar', nullable: true, precision: 1000})
    message: string;

    @Column({name: 'MISREP', type: 'number', nullable: true})
    misRep: number;

    @Column({name: 'NOTE', type: 'number', nullable: true})
    note: number;

    @Column({name: 'SENDEREMAIL', type: 'varchar', nullable: true})
    senderMail: string;

    @Column({name: 'NUMBEROFACCOUNTS', type: 'number', nullable: true})
    numberOfAccounts: number;

    @Column({name: 'OS', type: 'varchar', nullable: true})
    os: string;

    @Column({name: 'SENDLATENOTIFICATION', type: 'number', nullable: true})
    sendLateNotification: number;

    @Column({name: 'STATUS', type: 'number', nullable: true})
    status: number;

    @Column({name: 'TRANSPORTMEDIA', type: 'number', nullable: true})
    transportMedia: number;

    @Column({name: 'VERSION', type: 'number', nullable: true})
    version: number;

    @Column({name: 'WENTPRODUCTION', type: 'date', nullable: true})
    wentProduction: Date;

    @Column({name: 'EXPERIAN', type: 'number', nullable: true})
    experian: number;

    @ManyToOne(() => Datasite, (datasite: Datasite) => datasite.ediSubmitter, {
        eager: false,
        onDelete: 'CASCADE'
    })
    @JoinColumn({name: 'DATASITE', referencedColumnName: 'id'})
    datasites: Datasite[];

    @Column({name: 'DATASITE', type: 'number', nullable: true})
    datasite: number;

    @Column({name: 'SICCODE', type: 'varchar', nullable: true})
    sicCode: string;

    @Column({name: 'EXPORTSTOEXPERIAN', type: 'number', nullable: true})
    exportsToExperian: number;

    @Column({name: 'EXPERIANINDUSTRY', type: 'number', nullable: true})
    experianIndustry: number;

    @Column({name: 'FILELAYOUT', type: 'varchar', nullable: true, precision: 500})
    fileLayout: string;
}
