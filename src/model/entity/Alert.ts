/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import {
    Entity, BaseEntity,
    PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne,
} from "typeorm";


import { User } from "..";


@Entity()
export default class Alert extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", nullable: false })
    content!: string;

    @Column({ type: "varchar", nullable: false })
    status!: string;

    @CreateDateColumn({ name: "create_at" })
    createAt! : Date;

    @UpdateDateColumn({ name: "update_at" })
    updateAt! : Date;

    @ManyToOne((type) => User, (user) => user.alerts, { cascade: true, nullable: true })
    user!: User;
}
