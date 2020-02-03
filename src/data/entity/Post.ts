/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import {
    Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne,
} from "typeorm";

import Cat from "./Cat";
import Photo from "./Photo";
import Comment from "./Comment";
// 유저아이디 작성되어있지 않음
@Entity({ name: "post" })
export default class Post extends BaseEntity {
      @PrimaryGeneratedColumn()
      id!: number;

      @Column({ type: "text", nullable: false })
      content!:string;

      @Column({ type: "varchar", length: 2, nullable: false })
      status!: string;

      @CreateDateColumn({ name: "create_at" })
      createAt!: Date;

      @UpdateDateColumn({ name: "update_at" })
      updateAt!: Date;

      @OneToMany((type) => Photo, (photo) => photo.post)
      photos!: Photo[];

      @ManyToOne((type) => Cat, (cat) => cat.posts, { cascade: true, nullable: false })
      cat !: Cat;

      @OneToMany((type) => Comment, (comment) => comment.comments)
      comments!: Comment[];

}
