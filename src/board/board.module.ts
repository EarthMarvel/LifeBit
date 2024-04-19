import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { Boards } from './entities/board.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocketModule } from './socket/socket.module';
import { UserModule } from 'src/user/user.module';
import { S3Service } from 'src/user/s3.service';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { multerOptionsFactory } from 'src/utils/multer.options.factory';

@Module({
  imports: [
    TypeOrmModule.forFeature([Boards]),
    SocketModule,
    UserModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: multerOptionsFactory,
      inject: [ConfigService],
    }),
  ],
  providers: [BoardService, S3Service],
  controllers: [BoardController],
})
export class BoardModule {}
