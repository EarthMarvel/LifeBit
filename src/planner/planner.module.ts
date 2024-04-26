import { Module } from '@nestjs/common';
import { PlannerController } from './planner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entity/task.entity';
import { Planner } from './entity/planner.entity';
import { PlannerService } from './planner.service';
import { Mission } from 'src/mission/entities/mission.entity';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Planner, Task, Mission, User]),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [PlannerService],
  controllers: [PlannerController],
  exports: [PlannerService],
})
export class PlannerModule {}
