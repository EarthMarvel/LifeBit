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
import { MainController } from './main/main.controller';
import { MainService } from './main/main.service';
import { MainModule } from './main/main.module';
import { Boards } from './board/entities/board.entity';
import { Plan } from './planner/entity/plan.entity';
import { Planner } from './planner/entity/planner.entity';
import { Mission } from './mission/entities/mission.entity';
import { Point } from './point/entity/point.entity';

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
    entities: [User, Planner, Plan, Point, Boards, Mission],
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
  ],
  controllers: [MainController],
  providers: [MainService],
})
export class AppModule {}
