import Joi from 'joi'; 
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PointModule } from './point/point.module';
import { MissionModule } from './mission/mission.module';
import { BoardModule } from './board/board.module';
import { PlannerModule } from './planner/planner.module';
import { CommentModule } from './comment/comment.module';
import { MainController } from './main/main.controller';
import { MainService } from './main/main.service';
import { MainModule } from './main/main.module';
import { Plan } from './planner/entity/plan.entity';
import { Planner } from './planner/entity/planner.entity';

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
    entities: [Planner, Plan],
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
