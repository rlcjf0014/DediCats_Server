/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import {
    Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn,
} from "typeorm";
import { Cat, Post } from "..";

import { PhotoStatus } from "../../types/index";

  @Entity({ name: "photo" })
export default class Photo {
      @PrimaryGeneratedColumn()
      id!: number;

      @Column({ type: "varchar", nullable: false })
      path!: string;

      @Column({
          name: "is_profile", type: "varchar", length: 2, nullable: false, default: "N",
      })
      isProfile!: string;

      @Column({ type: "varchar", length: 2, nullable: false })
      status!: PhotoStatus;

      @CreateDateColumn({ name: "create_at", nullable: false })
      createAt! : Date;

      @UpdateDateColumn({ name: "update_at", nullable: false })
      updateAt! : Date;

      @ManyToOne((type) => Cat, (cat) => cat.photos, { cascade: true, nullable: true })
      cat !: Cat[];

      @ManyToOne((type) => Post, (post) => post.photos, { cascade: true, nullable: true })
      post !: Post[];
}
