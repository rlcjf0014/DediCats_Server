/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import {
    Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany,
    JoinTable, OneToMany, ManyToOne,
} from "typeorm";

import {
    Photo, Post, User, Report, CatTag,
} from "..";


import { CatStatus } from "../../types/index";
// const cutDefault:string = "{ Y :  0, N : 0, unknown : 0}";
// const rainbowDefault:string = "{ Y :  0, Y_date : 2020-01-31 , N : 0, N_date : 2020-01-31  }";

// 등록 유저 column 아직 등록되어있지 않음
@Entity({ name: "cat" })
export default class Cat extends BaseEntity {
    @PrimaryGeneratedColumn()
    id! :number;

    @Column({ type: "nvarchar", nullable: false })
    description! :string;

    @Column({ type: "point", nullable: false })
    location! :string;

    @Column({ type: "varchar", nullable: false })
    address! :string;

    @Column({ type: "varchar", nullable: false })
    nickname! :string;

    @Column({
        type: "varchar", nullable: false, width: 20,
    })
    cut!: string;

    @Column({
        type: "varchar",
        nullable: false,
        width: 20,
    })
    rainbow!: string;

    @Column({ type: "varchar", nullable: false })
    species! :string;

    @Column({ type: "varchar", nullable: true })
    today! :string;

    @Column({
        type: "timestamp", name: "today_time", nullable: true,
    })
    todayTime! :Date;

    @Column({ type: "varchar", length: 2, nullable: false })
    status! : CatStatus;

    @CreateDateColumn({ name: "create_at" })
    createAt! : Date;

    @UpdateDateColumn({ name: "update_at" })
    updateAt! : Date;

    @OneToMany((type) => Photo, (photo) => photo.cat)
    photos!: Photo[];

    @OneToMany((type) => Post, (post) => post.cat)
    posts!: Post[];

    @OneToMany((type) => Report, (report) => report.cat)
    reports!: Report[];

    @OneToMany((type) => CatTag, (catTag) => catTag.cat)
    catTags!: CatTag[];

    @ManyToOne((type) => User, (user) => user.cats, { cascade: true, nullable: false })
    user!: User;

    @ManyToMany((type) => User, (user) => user.cats, { cascade: true })
    @JoinTable({ name: "following_cat" })
    users! :User[];
}
