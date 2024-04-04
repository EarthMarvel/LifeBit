import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { MissionType } from '../types/missionType';
import { Category } from '../types/category';

@Entity()
export class Mission {
  @PrimaryGeneratedColumn()
  missionId: number;

  // userId
  @Column({ type: 'int', nullable: false })
  userId: number;

  // category : ENUM
  @Column({ type: 'enum', enum: Category, nullable: false })
  category: Category;

  // title
  @Column({ type: 'varchar', nullable: false })
  title: string;

  // description
  @Column({ type: 'varchar', nullable: false })
  description: string;

  // startDate
  @Column({ type: 'timestamp', nullable: false })
  startDate: Date;

  // endDate
  @Column({ type: 'timestamp', nullable: false })
  endDate: Date;

  // numberPeople
  @Column({ type: 'int', nullable: false })
  numberPeople: number;

  // thumbnailUrl
  @Column({ type: 'varchar', nullable: false })
  thumbnailUrl: string;

  // type
  @Column({ type: 'enum', enum: MissionType, nullable: false })
  type: MissionType;

  // authSum
  @Column({ type: 'int', default: 0 })
  authSum: number;

  // chatroomId
  // @Column({ type: 'number', unique: true, nullable: false })
  // chatroomId: number;

  // Mission과 ChatRoom의 일대일 관계
  // @OneToOne(() => ChatRoom, (chatRoom) => chatRoom.mission)
  // chatRoom: ChatRoom;
}
