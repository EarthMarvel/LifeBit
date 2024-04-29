import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../types/category_status.enum';
import { User } from '../../user/entities/user.entity';
import { Like } from './likes.entity';

@Entity({ name: 'boards' })
export class Boards extends BaseEntity {
  @PrimaryGeneratedColumn()
  boardId: number;

  @Column({ type: 'bigint', name: 'userId', nullable: true })
  userId: number;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false })
  content: string;

  @Column({ type: 'varchar', nullable: true, default: '' })
  thumbnail: string;

  @Column({ type: 'bigint', nullable: true, default: 0 })
  likedCount: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ type: 'enum', enum: Category })
  category: Category;

  @ManyToOne(() => User, (user) => user.boards)
  @JoinColumn({ name: 'userId', referencedColumnName: 'user_id' })
  users: User;

  @OneToMany(() => Like, (like) => like.boards)
  likes: Like[];
}
