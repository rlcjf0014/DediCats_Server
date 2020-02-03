/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import {
    // eslint-disable-next-line max-len
    Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable,
} from "typeorm";
import Tag from "./Tag";

@Entity({ name: "cat" })
export default class Cat extends BaseEntity {
    @PrimaryGeneratedColumn()
    id! :number;

    @Column({ type: "nvarchar", comment: "a brief explanation of about 200 characters based on uniCode.", default: null })
    description! :string;

    @Column({ type: "point", nullable: false })
    location! :string;

    @Column({ type: "varchar", nullable: false })
    nickname! :string;

    @Column({ type: "varchar", nullable: false, length: 10 })
    cut! :string;

    @Column({ type: "varchar", nullable: false, length: 100 })
    rainbow! :string;

    @Column({ type: "varchar", nullable: true })
    species! :string;

    @Column({ type: "varchar", nullable: true })
    today! :string;

    @Column({
        type: "timestamp", name: "today_time", nullable: true,
    })
    todayTime! :Date;

    @CreateDateColumn()
    createAt! : Date;

    @UpdateDateColumn()
    updateAt! : Date;

    // , tag => tag.id, { cascade: true }
    @ManyToMany(type => Tag)
    @JoinTable()
    tags! :Tag[];
}
