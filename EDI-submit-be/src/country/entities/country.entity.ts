import { Account } from "src/account/entities/account.entity";
import { Accountxref } from "src/accountxref_core/entities/accountxref_core.entity";
import { State } from "src/state/entities/state.entity";
import { TempExperience } from "src/temp-experience/entities/temp-experience.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: 'COUNTRY'})
export class Country {
    @PrimaryColumn({name: 'ID', type: 'int' })
    id: number;

    @Column({name: 'CODE', type: 'varchar', nullable: true})
    code: string;

    @Column({name: 'NAME', type: 'varchar', nullable: true})
    name: string;

    @Column({name: 'REGION', type: 'int', nullable: true})
    region: number;

    @Column({name: 'TWO_CHAR_CODE', type: 'varchar', nullable: true})
    two_char_code: string;

    // @OneToMany(() => TempExperience, (tempExperience: TempExperience) => tempExperience.country)
    // tempExperience: TempExperience;

    @OneToMany(() => Account, (account: Account) => account.country)
    account: Account;

    @OneToMany(() => State, (state: State) => state.country)
    state: State;

    // @OneToMany(() => AccountxrefCore, (accountXref: AccountxrefCore) => accountXref.country)
    // accountXref: AccountxrefCore;

    // @CreateDateColumn({ type: 'date' })
    // createdDate: Date;

    // @UpdateDateColumn({ type: 'date', nullable: true, default: () => 'null' })
    // updatedDate: Date;
}
