/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import {
    Entity, BaseEntity,
    PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne,
} from "typeorm";


import User from "./User";
import Cat from "./Cat";
import Tag from "./Tag";


@Entity({ name: "cat_tag"})
export default class CatTag extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", nullable: false })
    status!: string;

    @Column({ type: "varchar", nullable: false })
    deleteUser!: string;

    @CreateDateColumn({ name: "create_at" })
    createAt! : Date;

    @UpdateDateColumn({ name: "update_at" })
    updateAt! : Date;

    @ManyToOne((type) => User, (user) => user.catTags, { cascade: true, nullable: true })
    user!: User;

    @ManyToOne((type) => Cat, (cat) => cat.catTags, { cascade: true, nullable: true })
    cat!: Cat;

    @ManyToOne((type) => Tag, (tag) => tag.catTags, { cascade: true, nullable: true })
    tag!: Tag;
}