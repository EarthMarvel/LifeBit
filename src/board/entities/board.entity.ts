import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../types/category_status.enum';
import { User } from '../../user/entities/user.entity';

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

  // enum으로 하면 되나?!
  @Column({ type: 'enum', enum: Category })
  category: Category;

  // nestjs socket io 알람기능? 좋아요 알림기능?
  // 이미지는 S3 ?
  // 카테고리, 제목으로 검색 기능

  @ManyToMany(() => User, (user) => user.likeBoards)
  @JoinTable()
  like: User[];
}
