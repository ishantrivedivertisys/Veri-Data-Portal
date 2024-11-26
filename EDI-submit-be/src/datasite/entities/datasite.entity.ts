import { Edisubmitter } from "src/edisubmitter/entities/edisubmitter.entity";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity({name: 'DATASITE'})
export class Datasite {
    @PrimaryColumn({name: 'ID',type: 'number'})
    id: number;

    @Column({ name: 'CUSTOMER', type: 'number', nullable: true})
    customer: number;

    @Column({name: 'MESSAGE', type: 'varchar', nullable: true})
    message: string;

    @OneToMany(() => Edisubmitter, (ediSubmitter: Edisubmitter) => ediSubmitter.datasite)
    ediSubmitter: Edisubmitter;
}
