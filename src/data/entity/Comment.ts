import {
  Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn
} from 'typeorm';

@Entity({ name: "comment"})
export default class Comment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar"})
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;
}