import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Boards } from './board.entity';
import { User } from 'src/user/entities/user.entity';

@Entity({ name: 'likes' })
export class Like {
  @PrimaryGeneratedColumn()
  likeId: number;

  @Column({ type: 'bigint', name: 'boardId', nullable: true })
  boardId: number;

  @Column({ type: 'bigint', name: 'userId', nullable: true })
  userId: number;

  @ManyToOne(() => Boards, (boards) => boards.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'boardId', referencedColumnName: 'boardId' })
  boards: Boards;

  @ManyToOne(() => User, (user) => user.likes)
  @JoinColumn({ name: 'userId', referencedColumnName: 'user_id' })
  users: User;
}
