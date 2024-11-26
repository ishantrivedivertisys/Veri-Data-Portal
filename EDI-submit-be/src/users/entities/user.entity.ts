import { UsersStatus } from 'src/common/model/usersStatus';
import { Role } from 'src/role/entities/role.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';

@Entity({name: 'USER'})
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', nullable: true })
    firstName: string;

    @Column({ type: 'varchar', nullable: true })
    lastName: string;

    @Column({ type: 'date', nullable: true })
    dob: Date;

    @Column({ type: 'varchar', unique: true })
    email: string;

    @Column({ type: 'varchar', nullable: true })
    phone: string;

    @Column({ type: 'varchar', nullable: true })
    address: string;

    @Column({ type: 'varchar', nullable: true })
    city: string;

    @Column({ type: 'varchar', nullable: true })
    state: string;

    @Column({ type: 'varchar', nullable: true })
    zip: string;

    @Column({ type: 'varchar', nullable: true })
    otp: string;

    @Column({ type: 'varchar', nullable: true })
    password: string;

    @Column({ type: 'varchar', default : UsersStatus.INACTIVE })
    status: string;

    @Column({ type: 'timestamp', nullable: true })
    date: Date;

    @ManyToOne(() => Role, (role: Role) => role.user, {
        eager: false,
        onDelete: 'CASCADE'
    })
    role: Role[];

    @Column({ type: 'number', nullable: true })
    roleId: number;
}
