/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import {
    Entity, BaseEntity, 
    PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany
} from "typeorm";

import Alert from "./Alert";
import Comment from "./Comment";


@Entity({ name: "user" })
export default class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", nullable: false })
    nickname! : string;

    @Column({ type: "varchar", nullable: false })
    password! : string;

    @Column({ type: "varchar", nullable: false })
    email! : string;

    @Column({ type: "varchar", nullable: false, name: "user_status" })
    userStatus! : string;

    @Column({ type: "varchar", nullable: true, name: "user_photo_path" })
    userPhotoPath! : string;

    @CreateDateColumn({ name: "create_at" })
    createAt! : Date;

    @UpdateDateColumn({ name: "update_at" })
    updateAt! : Date;

    @OneToMany((type) => Alert, (alert) => alert.users)
    alerts! : Alert[];

    @OneToMany((type) => Comment, (comment) => comment.users)
    comments! : Comment[];
}
