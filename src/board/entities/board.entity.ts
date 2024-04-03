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
import { User } from 'src/user/entities/user.entity';

@Entity({ name: 'boards' })
export class Boards extends BaseEntity {
  @PrimaryGeneratedColumn()
  boardId: number;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false })
  content: string;

  // 이미지
  @Column()
  thumbnail: string;

  // 좋아요 기능
  @Column({ type: 'bigint' })
  likedCount: number;

  // 생성 날짜
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  // 수정 날짜
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // enum으로 하면 되나?!
  @Column({ type: 'enum', enum: Category })
  category: Category;

  // nestjs socket io 알람기능? 좋아요 알림기능?
  // 이미지는 S3 ?

  @ManyToMany(() => User, (user) => user.likeBoards)
  @JoinTable()
  like: User[];
}
