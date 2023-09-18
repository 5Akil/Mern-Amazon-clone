import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Promotion extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;

  @Column({nullable:true})
  discountPercentage: number;

  @Column({nullable:true})
  startDate: Date;

  @Column({nullable:true})
  endDate: Date;
}
