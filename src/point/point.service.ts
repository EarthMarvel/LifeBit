import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Point } from './entity/point.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PointService {
  constructor(
    @InjectRepository(Point)
    private readonly pointRepository: Repository<Point>,
  ) {}

  async plusePoint(addpoint: number, user_id: number) {
    const userPoint = await this.pointRepository.findOne({
      where: { user_id },
    });

    userPoint.point += addpoint;
    await this.pointRepository.save(userPoint);
  }

  async allPointView() {
    await this.pointRepository.find({
      order: {
        point: 'DESC',
      },
      take: 100,
    });
  }
}
