import { Permission } from "src/permission/entities/permission.entity";
import { Role } from "src/role/entities/role.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: 'ROLE_PERMISSION'})
export class RolePermission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'number', nullable: true })
    roleId: number;

    @ManyToOne(() => (Role), (role: Role) => role.rolePermission,{
        eager: false,
        onDelete: 'CASCADE'
    })
    role: Role[];
 
    @Column({ type: 'number', nullable: true })
    permissionId: number;

    @ManyToOne(() => (Permission), (permission: Permission) => permission.rolePermission, {
        eager: false,
        onDelete: 'CASCADE'
    })
    permission: Permission[];

    @Column({ type: 'varchar', nullable: true })
    status: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdDate: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: true, default: () => 'null' })
    updatedDate: Date;
}