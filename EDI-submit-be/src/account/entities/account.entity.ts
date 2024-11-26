import { Accountxref } from "src/accountxref_core/entities/accountxref_core.entity";
import { Country } from "src/country/entities/country.entity";
import { Experience } from "src/experience/entities/experience.entity";
import { TempExperience } from "src/temp-experience/entities/temp-experience.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: 'ACCOUNT'})
export class Account {
    @PrimaryColumn({name: 'ID', type: 'int'})
    id: number;

    @Column({name: 'DUNSNO', type: 'int', nullable: true})
    dunsNo: number;

    @Column({name: 'NAME_1', type: 'varchar', nullable: false})
    name_1: string;

    @Column({name: 'NAME_2', type: 'varchar', nullable: true})
    name_2: string;

    @Column({name: 'ADDRESS_1', type: 'varchar', nullable: true})
    address_1: string;

    @Column({name: 'ADDRESS_2', type: 'varchar', nullable: true})
    address_2: string;

    @Column({name: 'CITY', type: 'varchar', nullable: false})
    city: string;

    @Column({name: 'ZIP_CODE', type: 'varchar', nullable: true})
    zip_code: string;

    @Column({name: 'STATE', type: 'varchar', nullable: true})
    state: string;

    @ManyToOne(() => Country, (country: Country) => country.account, {
        eager: false,
        onDelete: 'CASCADE'
    })
    @JoinColumn({name: 'COUNTRY', referencedColumnName: 'id'})
    countries: Country[];

    @Column({ name: 'COUNTRY', type: 'int', nullable: false})
    country: number;

    @Column({name: 'BRANCH', type: 'varchar', nullable: true})
    branch: string;

    @Column({name: 'PARENT', type: 'int', nullable: true})
    parent: number;

    @Column({name: 'REFER_TO', type: 'int', nullable: true})
    refer_to: number;

    @Column({name: 'PRINCIPAL', type: 'varchar', nullable: true})
    principal: string;

    @Column({name: 'MESSAGE', type: 'varchar', nullable: true})
    message: string;

    @Column({name: 'SIC_CODE', type: 'int', nullable: true})
    sic_code: number;

    @Column({name: 'CREATED', type: 'int', nullable: false})
    created: number;

    @Column({name: 'ACTIVITY', type: 'int', nullable: true})
    activity: number;

    @Column({name: 'MODIFIED', type: 'int', nullable: true})
    modified: number;

    @Column({name: 'INTERNALMSG', type: 'varchar', nullable: true})
    internalMsg: string;

    @Column({name: 'ALIASES', type: 'varchar', nullable: true})
    aliases: string;

    @Column({name: 'LAT', type: 'decimal', precision: 20, scale: 2, nullable: true})
    lat: number;

    @Column({name: 'LON', type: 'decimal', precision: 20, scale: 2, nullable: true})
    lon: number;

    @Column({name: 'FID', type: 'varchar', nullable: true})
    fId: string;

    @Column({name: 'WEBSITE', type: 'varchar', nullable: true})
    website: string;

    @Column({name: 'PARENT_NAME', type: 'varchar', nullable: true})
    parent_name: string;

    @Column({name: 'DATE_BUSINESS_ESTABLISHED', type: 'date', nullable: true})
    date_business_established: Date;

    @Column({name: 'DATE_OF_INCORPORATION', type: 'date', nullable: true})
    date_of_incorporation: Date;

    @Column({name: 'STATE_OF_INCORPORATION', type: 'varchar', nullable: true})
    state_of_incorporation: string;


    // @OneToMany(() => TempExperience, (tempExperience: TempExperience) => tempExperience.account)
    // tempExperience: TempExperience;

    // @OneToMany(() => Experience, (experience: Experience) => experience.account)
    // experience: Experience;

    // @OneToMany(() => AccountxrefCore, (accountXref: AccountxrefCore) => accountXref.account)
    // accountXref: AccountxrefCore;

    // @CreateDateColumn({ name: 'ID', type: 'date' })
    // createdDate: Date;

    // @UpdateDateColumn({ name: 'ID', type: 'date', nullable: true, default: () => 'null' })
    // updatedDate: Date;
}
