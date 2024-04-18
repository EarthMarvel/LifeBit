import { Boards } from '../../board/entities/board.entity';
import { Point } from '../../point/entity/point.entity';
import { Mission } from '../../mission/entities/mission.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CertificatedImage } from 'src/vision/entity/certificatedImage.entity';

@Entity({
  name: 'users',
})
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

  @ManyToMany(() => Boards, (boards) => boards.like)
  @JoinTable()
  likeBoards: Boards[];

  @OneToMany(() => Point, (point) => point.user)
  point: Point[];

  @OneToMany(
    () => CertificatedImage,
    (certificatedImage) => certificatedImage.user,
  )
  certificatedImages: CertificatedImage[];
}
