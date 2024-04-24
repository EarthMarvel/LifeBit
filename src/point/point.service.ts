import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Point } from './entity/point.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { CreatePointDto } from './dto/createPoint.dto';

@Injectable()
export class PointService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Point)
    private pointRepository: Repository<Point>,
  ) {}

  async createInitialPoint(): Promise<Point> {
    const initialPoint = this.pointRepository.create({
      value: 0,
      totalValue: 0,
    }); // 초기 포인트 값을 설정
    return this.pointRepository.save(initialPoint);
  }

  async plusPoint(amount: number, user_id: number) {
    const user = await this.userRepository.findOneBy({ user_id });

    if (!user) {
      throw new Error('User not found');
    }

    // 포인트 엔티티 확인 및 생성 로직
    let point = await this.pointRepository.findOneBy({ user });

    if (!point) {
      point = new Point();
      point.user = user;
      point.value = 0; // 초기값 설정
      await this.pointRepository.save(point); // 새로운 포인트 엔티티 저장
    }

    point.totalValue += amount; // 포인트 증가
    point.value = amount;
    await this.pointRepository.save(point); // 변경된 포인트 정보 저장

    await this.userRepository.save(user); // 변경된 사용자 정보 저장
  }

  /*
  async allPointView() {
    await this.pointRepository.find({
      order: {
        value: 'DESC',
      },
      take: 100,
    });
  }
  */
}
