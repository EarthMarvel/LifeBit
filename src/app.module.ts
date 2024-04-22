import Joi from 'joi';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PointModule } from './point/point.module';
import { MissionModule } from './mission/mission.module';
import { BoardModule } from './board/board.module';
import { PlannerModule } from './planner/planner.module';
import { CommentModule } from './comment/comment.module';
import { Boards } from './board/entities/board.entity';
import { User } from './user/entities/user.entity';
import { MainModule } from './main/main.module';
import { Task } from './planner/entity/task.entity';
import { Planner } from './planner/entity/planner.entity';
import { Mission } from './mission/entities/mission.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SchedulerModule } from './utils/scheduler/scheduler.module';
import { Point } from './point/entity/point.entity';
import { VisionModule } from './vision/vision.module';
import { Like } from './board/entities/likes.entity';
import { ChatGateway } from './socket/chat.gateway';

const typeOrmModuleOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'mysql',
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    database: configService.get('DB_NAME'),
    entities: [User, Planner, Task, Point, Boards, Mission, Like],
    synchronize: configService.get('DB_SYNC'),
    logging: true,
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET_KEY: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNC: Joi.boolean().required(),
      }),
    }),
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    AuthModule,
    UserModule,
    PointModule,
    MissionModule,
    BoardModule,
    PlannerModule,
    CommentModule,
    MainModule,
    SchedulerModule,
    VisionModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
