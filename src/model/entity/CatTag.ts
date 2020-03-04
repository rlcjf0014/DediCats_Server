/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import {
    Entity,
    PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne,
} from "typeorm";

import { TagStatus } from "../../types/index";
import { User, Cat, Tag } from "..";


@Entity({ name: "cat_tag" })
export default class CatTag {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", nullable: false, width: 2 })
    status!: TagStatus;

    @Column({ type: "varchar", nullable: true })
    deleteUser!: number;

    @CreateDateColumn({ name: "create_at" })
    createAt! : Date;

    @UpdateDateColumn({ name: "update_at" })
    updateAt! : Date;

    @ManyToOne((type) => User, (user) => user.catTags, { cascade: true, nullable: false })
    user!: User;

    @ManyToOne((type) => Cat, (cat) => cat.catTags, { cascade: true, nullable: false })
    cat!: Cat;

    @ManyToOne((type) => Tag, (tag) => tag.catTags, { cascade: true, nullable: false })
    tag!: Tag;
}
