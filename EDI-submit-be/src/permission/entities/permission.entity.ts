import { RolePermission } from "src/role-permission/entities/role-permission.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: 'PERMISSION'})
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', nullable: false })
    name: string;

    @Column({ type: 'varchar', nullable: true })
    status: string;

    @Column({ type: 'varchar', nullable: true })
    permissionGroupName: string;

    @Column({ type: 'varchar', nullable: true })
    permissionSubGroupName: string;

    @Column({ type: 'varchar', nullable: true })
    permissionKey: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdDate: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: true, default: () => 'null' })
    updatedDate: Date;

    @OneToMany(() => RolePermission, (rolePermission: RolePermission) => rolePermission.permission)
    rolePermission: RolePermission;
}