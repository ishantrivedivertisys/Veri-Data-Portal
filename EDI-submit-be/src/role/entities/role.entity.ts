import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RoleStatus } from "./roleStatus.enum";
import { RolePermission } from "src/role-permission/entities/role-permission.entity";

@Entity({name: 'ROLE'})
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', nullable: false })
    name: string;

    @Column({ type: 'varchar', default: RoleStatus.INACTIVE, nullable: true })
    status: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdDate: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: true, default: () => 'null' })
    updatedDate: Date;

    @OneToMany(() => User, (user: User) => user.role)
    user: User;

    @OneToMany(() => RolePermission, (rolePermission: RolePermission) => rolePermission.role)
    rolePermission: RolePermission;
}
