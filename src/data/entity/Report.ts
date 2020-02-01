import {
  Entity, BaseEntity, PrimaryGeneratedColumn, Column,
} from 'typeorm';

@Entity()
export default class Report extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;
}