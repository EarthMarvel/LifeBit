import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Plan } from './plan.entity';

@Entity({ name: 'planner' })
export class Planner {
  @PrimaryGeneratedColumn()
  plannerId: number;

  @OneToMany(() => Plan, (plan) => plan.planner)
  plan: Plan[];

  //임의 userId
  @Column({ type: 'varchar', unique: true, nullable: false })
  userId: number;

  @Column({ type: 'varchar' })
  name?: string;

  @Column({ type: 'varchar' })
  description?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
