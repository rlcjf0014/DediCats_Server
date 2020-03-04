/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import {
    Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn,
} from "typeorm";

import { CatTag } from "..";


@Entity({ name: "tag" })
export default class Tag {
      @PrimaryGeneratedColumn()
      id!: number;

      @Column({ type: "varchar", nullable: false })
      content!:string;

      @CreateDateColumn()
      createAt!: Date;

      @UpdateDateColumn()
      updateAt!: Date;

      @OneToMany((type) => CatTag, (catTag) => catTag.tag)
      catTags!: CatTag[];

    //   @ManyToMany((type) => Cat, (cat) => cat.id, { cascade: true })
    //   cats!: Cat[];
}
