import { Account } from "src/account/entities/account.entity";
import { Country } from "src/country/entities/country.entity";
import { State } from "src/state/entities/state.entity";
import { TempExperience } from "src/temp-experience/entities/temp-experience.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "ACCOUNTXREF" })
export class Accountxref {
    @PrimaryColumn({name: 'CUSTREFNO', type: 'varchar'})
    custRefNo: string;

    // @ManyToOne(() => Account, (account: Account) => account.accountXref,
    // {
    //     eager: false,
    //     onDelete: 'CASCADE'
    // })
    // @JoinColumn({name: 'account', referencedColumnName: 'id'})
    // accounts: Account[];

    @Column({name: 'ACCOUNT', type: 'number', nullable: true})
    account: number;

    @Column({name: 'CUSTNO', type: 'number', nullable: true})
    custNo: number;

    @Column({name: 'DATASITE', type: 'number', nullable: true})
    dataSite: number;

    @Column({name: 'ADDRESS_1', type: 'varchar', nullable: true})
    address1: string;

    @Column({name: 'ADDRESS_2', type: 'varchar', nullable: true})
    address2: string;

    @Column({name: 'CITY', type: 'varchar', nullable: true})
    city: string;

    // @ManyToOne(() => Country, (country: Country) => country.accountXref,
    // {
    //     eager: false,
    //     onDelete: 'CASCADE'
    // })
    // @JoinColumn({name: 'country', referencedColumnName: 'id'})
    // countries: Country[];

    @Column({name: 'COUNTRY', type: 'number', nullable: true})
    country: number;

    @Column({name: 'CRC', type: 'number', nullable: true})
    crc: number;

    @Column({name: 'LASTTRANSFER', type: 'date', nullable: true})
    lastTransfer: Date;

    @Column({name: 'NAME_1', type: 'varchar', nullable: true})
    name1: string;

    @Column({name: 'NAME_2', type: 'varchar', nullable: true})
    name2: string;

    // @ManyToOne(() => State, (state: State) => state.accountXref,
    // {
    //     eager: false,
    //     onDelete: 'CASCADE'
    // })
    // @JoinColumn({name: 'state', referencedColumnName: 'code'})
    // states: State[];

    @Column({name: 'STATE', type: 'varchar', nullable: true})
    state: string;

    @Column({name: 'ZIP', type: 'varchar', nullable: true})
    zip: string;

    // @OneToMany(() => TempExperience, (tempExperience: TempExperience) => tempExperience.customer)
    // tempExperience: TempExperience[];

    // @CreateDateColumn({ type: 'date' })
    // createdDate: Date;

    // @UpdateDateColumn({ type: 'date', nullable: true, default: () => 'null' })
    // updatedDate: Date;
}

