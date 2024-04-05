import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'point' })
export class Point {
  @PrimaryGeneratedColumn()
  pointId: number;

  @Column({ default: 0 })
  point: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.point)
  @JoinColumn({ name: 'user_id' })
  user: User;
}