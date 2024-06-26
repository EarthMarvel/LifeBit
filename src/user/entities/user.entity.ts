import { Boards } from '../../board/entities/board.entity';
import { Point } from '../../point/entity/point.entity';
import { Mission } from '../../mission/entities/mission.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CertificatedImage } from 'src/vision/entity/certificatedImage.entity';
import { Like } from 'src/board/entities/likes.entity';
import { UserMission } from 'src/user-mission/entities/user-mission.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  nickName: string;

  @Column({ type: 'varchar', nullable: true })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ nullable: true })
  providerId: string;

  @OneToMany(() => Boards, (boards) => boards.users)
  boards: Boards[];

  @OneToMany(() => Like, (likes) => likes.users)
  likes: Like[];

  @OneToOne(() => Point, (point) => point.user)
  point: Point;

  @OneToMany(
    () => CertificatedImage,
    (certificatedImage) => certificatedImage.user,
  )
  certificatedImages: CertificatedImage[];

  // @OneToMany(() => UserMission, (userMission) => userMission.mission)
  // userMissions: UserMission[];
}
