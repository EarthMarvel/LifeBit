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
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CertificatedImage } from 'src/vision/entity/certificatedImage.entity';
import { Like } from 'src/board/entities/likes.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @ManyToMany(() => Mission, (mission) => mission.creatorId)
  @JoinTable()
  missions: Mission[];

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
}
