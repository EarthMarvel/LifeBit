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

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ default: 0 })
  totalValue: number;

  // User와의 1:1 관계로 수정
  @OneToOne(() => User, (user) => user.point) // 수정됨
  @JoinColumn({ name: 'user_id' }) // 외래 키 컬럼 이름을 지정
  user: User;
}
