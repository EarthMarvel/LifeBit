import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Point } from './entity/point.entity';
import { Repository } from 'typeorm';
import { S3Service } from 'src/user/s3.service';

@Injectable()
export class PointService {
  constructor(
    @InjectRepository(Point)
    private readonly pointRepository: Repository<Point>,
    private readonly s3Service: S3Service,
  ) {}

  async plusePoint(addpoint: number, user_id: number) {
    const userPoint = await this.pointRepository.findOne({
      where: { user_id },
    });

    userPoint.point += addpoint;
    await this.pointRepository.save(userPoint);
  }

  async allPointView() {
    const allPoint = await this.pointRepository.find({
      relations: ['user'],
      order: {
        point: 'DESC',
      },
      take: 10,
    });

    const formattedPoints = allPoint.map((point) => ({
      pointId: point.pointId,
      point: point.point,
      createdAt: point.createdAt,
      nickName: point.user.nickName,
      image: point.user.image,
    }));
    return formattedPoints;
  }
}
