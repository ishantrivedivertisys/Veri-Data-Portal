import { FileUpload } from "src/file-upload/entities/fileUpoad.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: 'TEMP_DATA'})
export class TempData {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', nullable: true})
    column1: string;
    
    @Column({type: 'varchar', nullable: true})
    column2: string;

    @Column({type: 'varchar', nullable: true})
    column3: string;

    @Column({type: 'varchar', nullable: true})
    column4: string;

    @Column({type: 'varchar', nullable: true})
    column5: string;

    @Column({type: 'varchar', nullable: true})
    column6: string;

    @Column({type: 'varchar', nullable: true})
    column7: string;

    @Column({type: 'varchar', nullable: true})
    column8: string;

    @Column({type: 'varchar', nullable: true})
    column9: string;

    @Column({type: 'varchar', nullable: true})
    column10: string;

    @Column({type: 'varchar', nullable: true})
    column11: string;
    
    @Column({type: 'varchar', nullable: true})
    column12: string;

    @Column({type: 'varchar', nullable: true})
    column13: string;

    @Column({type: 'varchar', nullable: true})
    column14: string;

    @Column({type: 'varchar', nullable: true})
    column15: string;

    @Column({type: 'varchar', nullable: true})
    column16: string;

    @Column({type: 'varchar', nullable: true})
    column17: string;

    @Column({type: 'varchar', nullable: true})
    column18: string;

    @Column({type: 'varchar', nullable: true})
    column19: string;

    @Column({type: 'varchar', nullable: true})
    column20: string;

    @Column({type: 'varchar', nullable: true})
    column21: string;
    
    @Column({type: 'varchar', nullable: true})
    column22: string;

    @Column({type: 'varchar', nullable: true})
    column23: string;

    @Column({type: 'varchar', nullable: true})
    column24: string;

    @Column({type: 'varchar', nullable: true})
    column25: string;

    @Column({type: 'varchar', nullable: true})
    column26: string;

    @Column({type: 'varchar', nullable: true})
    column27: string;

    @Column({type: 'varchar', nullable: true})
    column28: string;

    @Column({type: 'varchar', nullable: true})
    column29: string;

    @Column({type: 'varchar', nullable: true})
    column30: string;

    @Column({type: 'varchar', nullable: true})
    column31: string;
    
    @Column({type: 'varchar', nullable: true})
    column32: string;

    @Column({type: 'varchar', nullable: true})
    column33: string;

    @Column({type: 'varchar', nullable: true})
    column34: string;

    @Column({type: 'varchar', nullable: true})
    column35: string;

    @Column({type: 'varchar', nullable: true})
    column36: string;

    @Column({type: 'varchar', nullable: true})
    column37: string;

    @Column({type: 'varchar', nullable: true})
    column38: string;

    @Column({type: 'varchar', nullable: true})
    column39: string;

    @Column({type: 'varchar', nullable: true})
    column40: string;

    @Column({type: 'varchar', nullable: true})
    column41: string;
    
    @Column({type: 'varchar', nullable: true})
    column42: string;

    @Column({type: 'varchar', nullable: true})
    column43: string;

    @Column({type: 'varchar', nullable: true})
    column44: string;

    @Column({type: 'varchar', nullable: true})
    column45: string;

    @Column({type: 'varchar', nullable: true})
    column46: string;

    @Column({type: 'varchar', nullable: true})
    column47: string;

    @Column({type: 'varchar', nullable: true})
    column48: string;

    @Column({type: 'varchar', nullable: true})
    column49: string;

    @Column({type: 'varchar', nullable: true})
    column50: string;

    @ManyToOne(() => FileUpload, (fileUpload: FileUpload) => fileUpload.tempData, {
        eager: false,
        onDelete: 'CASCADE'
    })
    fileUpload: FileUpload[];

    @Column({ type: 'int', nullable: true})
    fileUploadId: number;

    // @Column({type: 'varchar', nullable: true})
    // rowType: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdDate: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: true, default: () => 'null' })
    updatedDate: Date;
}
