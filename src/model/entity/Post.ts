/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import {
    Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne,
} from "typeorm";

import {
    Cat, Photo, Comment, Report, User,
} from "..";

import { PostStatus } from "../../types/index";
// 유저아이디 작성되어있지 않음
@Entity({ name: "post" })
export default class Post {
      @PrimaryGeneratedColumn()
      id!: number;

      @Column({ type: "text", nullable: false })
      content!:string;

      @Column({ type: "varchar", length: 2, nullable: false })
      status!: PostStatus;

      @CreateDateColumn({ name: "create_at" })
      createAt!: Date;

      @UpdateDateColumn({ name: "update_at" })
      updateAt!: Date;

      @OneToMany((type) => Photo, (photo) => photo.post)
      photos!: Photo[];

      @ManyToOne((type) => Cat, (cat) => cat.posts, { cascade: true, nullable: false })
      cat !: Cat;

      @ManyToOne((type) => User, (user) => user.posts, { cascade: true, nullable: false })
      user !: User;

      @OneToMany((type) => Comment, (comment) => comment.post)
      comments!: Comment[];

      @OneToMany((type) => Report, (report) => report.post)
      reports!: Report[];
}
