import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToMany,
  ManyToOne,
  JoinTable,
} from 'typeorm';

import { MissionType } from '../types/missionType';
import { Category } from '../types/category';
import { User } from '../../user/entities/user.entity';
import { CertificatedImage } from 'src/vision/entity/certificatedImage.entity';
import { UserMission } from 'src/user-mission/entities/user-mission.entity';

@Entity()
export class Mission {
  @PrimaryGeneratedColumn()
  missionId: number;

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
  @Column({ type: 'datetime', nullable: false })
  startDate: Date;

  // endDate
  @Column({ type: 'datetime', nullable: false })
  endDate: Date;

  // numberPeople
  @Column({ type: 'int', nullable: false })
  numberPeople: number;

  // thumbnail
  @Column({ type: 'varchar', nullable: true })
  thumbnail: string;

  // type
  // @Column({ type: 'enum', enum: MissionType, nullable: false })
  // type: MissionType;

  // authSum
  @Column({ type: 'int', default: 0 })
  authSum: number;

  // chatroomId
  // @Column({ type: 'number', unique: true, nullable: false })
  // chatroomId: number;

  // Mission과 ChatRoom의 일대일 관계
  // @OneToOne(() => ChatRoom, (chatRoom) => chatRoom.mission)
  // chatRoom: ChatRoom;

  // 미션 생성자 ID를 나타내는 필드 (연관 관계를 설정하지 않습니다)
  @Column({ type: 'int', nullable: true })
  creatorId: number;

  @OneToMany(() => UserMission, (userMission) => userMission.user)
  userMissions: UserMission[];

  @OneToMany(
    () => CertificatedImage,
    (certificatedImage) => certificatedImage.mission,
  )
  certificatedImages: CertificatedImage[];
}
