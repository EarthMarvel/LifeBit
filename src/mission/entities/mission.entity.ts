import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { MissionType } from '../types/missionType';

@Entity()
export class Mission {
  @PrimaryGeneratedColumn()
  missionId: number;

  // userId
  @Column({ type: 'varchar', unique: true, nullable: false })
  userId: number;

  // chatroomId
  @Column({ type: 'varchar', unique: true, nullable: false })
  chatroomId: number;

  // category : ENUM
  @Column({ type: 'varchar', unique: true, nullable: false })
  category: string;

  // title
  @Column({ type: 'varchar', nullable: false })
  title: string;

  // description
  @Column({ type: 'varchar', nullable: false })
  description: string;

  // startDate
  @Column({ type: 'datetime', nullable: false })
  startDate: Date;

  // endDate
  @Column({ type: 'datetime', nullable: false })
  endDate: Date;

  // numberPeople
  @Column({ type: 'number', nullable: false })
  numberPeople: number;

  // thumbnailUrl
  @Column({ type: 'varchar', nullable: false })
  thumbnailUrl: string;

  // type
  @Column({ type: 'enum', enum: MissionType, nullable: false })
  type: string;

  // authSum
  @Column({ type: 'number' })
  authSum: number;
}
