import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Point {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: number;

  @Column({ default: 0 })
  totalValue: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => User, (user) => user.point)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
  user: User;
}
