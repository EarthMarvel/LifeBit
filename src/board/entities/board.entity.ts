import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
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

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false })
  content: string;

  // 이미지
  @Column({ type: 'varchar', nullable: false, default: '' })
  thumbnail: string;

  // 좋아요 기능
  @Column({ type: 'bigint', nullable: false, default: 0 })
  likedCount: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ type: 'enum', enum: Category })
  category: Category;

  @ManyToOne(() => User, (user) => user.boards)
  users: User;

  @OneToMany(() => Like, (like) => like.boards)
  likes: Like[];
}
