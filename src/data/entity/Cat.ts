import {
  Entity, BaseEntity, PrimaryGeneratedColumn, Column,
} from "typeorm";

@Entity()
export default class Cat extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;
}