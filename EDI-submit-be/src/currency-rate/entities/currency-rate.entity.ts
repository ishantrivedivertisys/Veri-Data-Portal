import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CurrencyRateStatus } from "./currency-rate.status.enum";
import { CurrencyRateCurrency } from "./currency-rate.enum";

@Entity({name: 'CURRENCY_RATE'})
export class CurrencyRate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date', nullable: true})
    wefDate: Date;

    @Column({ type: 'varchar', default: CurrencyRateCurrency.CAD, nullable: true})
    currency: string;

    @Column({ type: 'decimal', precision: 20, scale: 2, nullable: true})
    dollar: number;

    @Column({ type: 'varchar', default: CurrencyRateStatus.ACTIVE, nullable: true})
    status: string;

    @CreateDateColumn({ type: "timestamp" })
    createdDate: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: true, default: () => 'null' })
    updatedDate: Date;
}
