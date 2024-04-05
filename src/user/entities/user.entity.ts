import { Boards } from 'src/board/entities/board.entity';
import { Point } from 'src/point/entity/point.entity';
import { Mission } from 'src/mission/entities/mission.entity';

import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @ManyToMany(() => Mission, (mission) => mission.user_id)
  @JoinTable()
  missions: Mission[];

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  nickName: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @ManyToMany(() => Boards, (boards) => boards.like)
  @JoinTable()
  likeBoards: Boards[];

  @OneToMany(() => Point, (point) => point.user)
  point: Point[];
}
