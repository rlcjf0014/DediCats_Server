import {
    Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne,
} from "typeorm";
import Cat from "./Cat";

  @Entity({ name: "photo" })
export default class Photo extends BaseEntity {
      @PrimaryGeneratedColumn()
      id!: number;

      @Column({ type: "varchar", nullable: false })
      path!: string;

      @ManyToOne((type) => Cat, (cat) => cat.photos)
      cat_id !: Cat;

      @Column({ name: "is_profile", type: "varchar", length: 2 })
      isProfile!: string;

      @Column({ type: "varchar", length: 2 })
      status!: string;

      @CreateDateColumn({ name: "create_at" })
      createAt! : Date;

      @UpdateDateColumn({ name: "update_at" })
      updateAt! : Date;
}
