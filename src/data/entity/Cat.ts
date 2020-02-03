/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import {
    Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany,
     JoinTable, OneToMany, ManyToOne
} from "typeorm";
import Tag from "./Tag";
import Photo from "./Photo";
import Post from "./Post";
import User from "./User";
import Report from "./Report";
// const cutDefault:string = "{ Y :  0, N : 0, unknown : 0}";
// const rainbowDefault:string = "{ Y :  0, Y_date : 2020-01-31 , N : 0, N_date : 2020-01-31  }";

// 등록 유저 column 아직 등록되어있지 않음
@Entity({ name: "cat" })
export default class Cat extends BaseEntity {
    @PrimaryGeneratedColumn()
    id! :number;

    @Column({ type: "nvarchar", nullable: true })
    description! :string;

    @Column({ type: "point", nullable: false })
    location! :string;

    @Column({ type: "varchar", nullable: false })
    nickname! :string;

    @Column({
        type: "simple-json", nullable: false,
    })
    cut :{Y:number, N:number, unknown:number} = { Y: 0, N: 0, unknown: 0 };

    @Column({
        type: "simple-json",
        nullable: false,
    })
    rainbow :{Y:number, YDate:any, N:number, NDate:any} = {
        Y: 0, YDate: null, N: 0, NDate: null,
    };

    @Column({ type: "varchar", nullable: true })
    species! :string;

    @Column({ type: "varchar", nullable: true })
    today! :string;

    @Column({
        type: "timestamp", name: "today_time", nullable: true,
    })
    todayTime! :Date;

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

    @ManyToOne((type) => User, (user) => user.cats, { cascade: true, nullable: true })
    user!: User;

    @ManyToMany((type) => Tag, (tag) => tag.id, { cascade: true })
    @JoinTable({ name: "cat_tag" })
    tags! :Tag[];

    @ManyToMany((type) => User, (user) => user.id, {cascade: true})
    @JoinTable({ name: "following_cat" })
    users! :User[];
}
