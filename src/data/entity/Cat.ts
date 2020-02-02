/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import {
    Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany,
} from "typeorm";
import Tag from "./Tag";

@Entity({ name: "cat" })
export default class Cat extends BaseEntity {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({ type: "nvarchar", comment: "a brief explanation of about 200 characters based on uniCode." })
    description:string;

    @Column({ type: "point", nullable: "false" })
    location:string;

    @Column({ type: "varchar", nullable: "false" })
    nickname:string;

    @Column({ type: "varchar", nullable: "false", length: 100 })
    cut:string;

    @Column({ type: "varchar", nullable: "false", length: 100 })
    rainbow:string;

    @Column({ type: "varchar", nullable: "true" })
    species:string;

    @Column({ type: "varchar", nullable: "true" })
    today:string;

    @Column({
        type: "timestamp", name: "today_time", nullable: "true", comment: "Time when \"today\"column updated",
    })
    todayTime:Date;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @ManyToMany((type) => Tag, (tag) => tag.id, { cascade: true })
    tags:Tag[];
}
