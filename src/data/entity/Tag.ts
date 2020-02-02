/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import {
    Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany,
} from "typeorm";

import Cat from "./Cat";

@Entity({ name: "tag" })
export default class Tag extends BaseEntity {
      @PrimaryGeneratedColumn()
      id: number;

      @Column({ type: "varchar", nullable: "false" })
      content:string;

      @CreateDateColumn()
      createAt: Date;

      @UpdateDateColumn()
      updateAt: Date;

      @ManyToMany((type) => Cat, (cat) => cat.id, { cascade: true })
      cats: Cat[];
}
