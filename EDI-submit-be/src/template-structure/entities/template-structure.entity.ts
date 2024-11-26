import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'TEMPLATE_STRUCTURE' })
export class TemplateStructure {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'TEMPLATE_COLUMN_NAME', type: 'varchar', nullable: true})
    templateColumnName: string;

    @Column({name: 'TABLE_COLUMN_NAME', type: 'varchar', nullable: true})
    tableColumnName: string;

    @Column({name: 'VALIDATION', type: 'varchar', nullable: true})
    validation: string;

    @Column({name: 'IS_MULTIPLE_ALLOW', type: 'number', nullable: true, precision: 1, scale: 0})
    isMultipleAllow: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdDate: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: true, default: () => 'null' })
    updatedDate: Date;
}
