import { Edisubmitter } from "src/edisubmitter/entities/edisubmitter.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: 'CUSTOMER'})
export class Customer {
    @PrimaryColumn({name: 'ID', type: 'int'})
    id: number;

    @Column({name: 'NAME1', type: 'varchar', nullable: true})
    name1: string;

    @Column({name: 'NAME2', type: 'varchar', nullable: true})
    name2: string;

    @Column({name: 'MESSAGE', type: 'varchar', nullable: true})
    message: string;

    @Column({name: 'CREATED', type: 'long', nullable: true})
    created: number;

    @Column({name: 'CREATE_USER', type: 'varchar', nullable: true})
    createUser: string;

    @Column({name: 'MODIFIED', type: 'int', nullable: true})
    modified: number;

    @Column({name: 'MOD_USER', type: 'varchar', nullable: true})
    modUser: string;

    @Column({name: 'NOTE', type: 'int', nullable: true})
    note: number;

    @Column({name: 'ALIASES', type: 'varchar', nullable: true})
    aliases: string;

    @Column({name: 'INDUSTRY', type: 'int', nullable: true})
    industry: number;

    @Column({name: 'CREDIT_APP_CODE', type: 'varchar', nullable: true})
    creditAppCode: string;

    @Column({name: 'CREDIT_APP_ENABLED', type: 'int', nullable: true})
    creditAppEnabled: number;

    @Column({name: 'CREDIT_APP_START', type: 'int', nullable: true})
    creditAppStart: number;

    @Column({name: 'CREDIT_APP_TIER_COUNT', type: 'int', nullable: true})
    creditAppTierCount: number;

    @Column({name: 'AUTO_EMAIL_CREDIT_REFS', type: 'int', nullable: true})
    autoEmailCreditRefs: number;

    @Column({name: 'RC_TRACKER_ENABLED', type: 'int', nullable: true})
    rcTrackerEnabled: number;

    @OneToMany(() => Edisubmitter, (ediSubmitter: Edisubmitter) => ediSubmitter.customer)
    ediSubmitter: Edisubmitter;

    // @CreateDateColumn({ type: 'date' })
    // createdDate: Date;

    // @UpdateDateColumn({ type: 'date', nullable: true, default: () => 'null' })
    // updatedDate: Date;
}
