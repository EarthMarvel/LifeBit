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

import { CertificatedImage } from 'src/vision/entity/certificatedImage.entity';

@Entity()
export class Mission {
  @PrimaryGeneratedColumn()
  missionId: number;

  // category : ENUM
  @Column({ type: 'varchar', nullable: false })
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
  @Column({ type: 'int', nullable: false })
  numberPeople: number;

  // thumbnail
  @Column({ type: 'varchar', nullable: true })
  thumbnail: string;

  // authSum
  @Column({ type: 'int', default: 0 })
  authSum: number;

  // 미션 생성자 ID를 나타내는 필드 (연관 관계를 설정하지 않습니다)
  @Column({ type: 'int', nullable: true })
  creatorId: number;

  @OneToMany(
    () => CertificatedImage,
    (certificatedImage) => certificatedImage.mission,
  )
  certificatedImages: CertificatedImage[];
}
