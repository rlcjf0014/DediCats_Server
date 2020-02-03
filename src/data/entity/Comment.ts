/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import {
    Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne,
} from "typeorm";

import User from "./User";
import Post from "./Post";

@Entity({ name: "comment" })
export default class Comment extends BaseEntity {
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

    @ManyToOne((type) => User, (user) => user.comments)
    users!: User;

    @ManyToOne((type) => Post, (post) => post.comments)
    posts!: Post;
}
