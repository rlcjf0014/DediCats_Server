import {
    Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
} from "typeorm";

@Entity({ name: "cat" })
class Cat extends BaseEntity {
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
}

export default Cat;
