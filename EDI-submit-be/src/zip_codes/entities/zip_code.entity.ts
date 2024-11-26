import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({name: 'ZIP_CODES'})
export class ZipCode {
    @PrimaryColumn({name: 'ID',type: 'number'})
    id: number;

    @Column({ name: 'ZIP_CODE', type: 'varchar', nullable: true})
    zip_code: string;

    @Column({ name: 'ZIP_CODE_TYPE', type: 'varchar', nullable: true})
    zip_code_type: string;

    @Column({ name: 'CITY', type: 'varchar', nullable: true})
    city: string;

    @Column({ name: 'STATE', type: 'varchar', nullable: true})
    state: string;

    @Column({ name: 'LAT', type: 'number', nullable: true})
    lat: number;

    @Column({ name: 'LON', type: 'number', nullable: true})
    lon: number;

    @Column({ name: 'COUNTRY', type: 'varchar', nullable: true})
    country: string;
}
