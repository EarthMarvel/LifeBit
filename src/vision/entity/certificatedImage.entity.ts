import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Mission } from 'src/mission/entities/mission.entity';

@Entity({ name: 'certificatedImage' })
export class CertificatedImage {
  @PrimaryGeneratedColumn()
  certificatedImageId: number;

  @CreateDateColumn()
  certificatedAt: Date;

  @Column({ default: false })
  isCertificated: boolean;

  @ManyToOne(() => Mission, (mission) => mission.certificatedImages)
  @JoinColumn({ name: 'missionId' })
  mission: Mission;

  @ManyToOne(() => User, (user) => user.certificatedImages)
  @JoinColumn({ name: 'certificatedUserId', referencedColumnName: 'user_id' })
  user: User;
}
