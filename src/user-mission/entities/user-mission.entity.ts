import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from 'src/user/entities/user.entity';
import { Mission } from 'src/mission/entities/mission.entity';

@Entity()
export class UserMission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userMissions)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Mission, (mission) => mission.userMissions)
  @JoinColumn({ name: 'missionId' })
  mission: Mission;

  @Column()
  participationDate: Date;
}
