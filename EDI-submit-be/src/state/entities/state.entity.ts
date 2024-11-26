import { Accountxref } from "src/accountxref_core/entities/accountxref_core.entity";
import { Country } from "src/country/entities/country.entity";
import { TempExperience } from "src/temp-experience/entities/temp-experience.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: 'STATE'})
export class State {
    @PrimaryColumn({name: 'CODE',type: 'varchar'})
    code: string;

    @ManyToOne(() => Country, (country: Country) => country.state, {
        eager: false,
        onDelete: 'CASCADE'
    })
    @JoinColumn({name: 'COUNTRY', referencedColumnName: 'id'})
    countries: Country[];

    @Column({ name: 'COUNTRY', type: 'int', nullable: true})
    country: number;

    @Column({name: 'NAME', type: 'varchar', nullable: true})
    name: string;

    // @OneToMany(() => TempExperience, (tempExperience: TempExperience) => tempExperience.state)
    // tempExperience: TempExperience;

    // @OneToMany(() => AccountxrefCore, (accountXref: AccountxrefCore) => accountXref.state)
    // accountXref: AccountxrefCore;

    // @CreateDateColumn({ type: 'date' })
    // createdDate: Date;

    // @UpdateDateColumn({ type: 'date', nullable: true, default: () => 'null' })
    // updatedDate: Date;
}
