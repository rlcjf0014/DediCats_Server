/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import {
    Entity, PrimaryGeneratedColumn, Column,
    CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany,
} from "typeorm";

import { CommentStatus } from "../../types/index";
import { User, Post, Report } from "..";


@Entity({ name: "comment" })
export default class Comment {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", nullable: false })
    content!: string;

    @Column({ type: "varchar", nullable: false })
    status!: CommentStatus;

    @CreateDateColumn({ name: "create_at" })
    createAt! : Date;

    @UpdateDateColumn({ name: "update_at" })
    updateAt! : Date;

    @OneToMany((type) => Report, (report) => report.comment)
    reports!: Report[];

    @ManyToOne((type) => User, (user) => user.comments, { cascade: true, nullable: true })
    user!: User;

    @ManyToOne((type) => Post, (post) => post.comments, { cascade: true, nullable: true })
    post!: Post;
}
