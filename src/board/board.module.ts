import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { Boards } from './entities/board.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocketModule } from '../socket/socket.module';
import { UserModule } from 'src/user/user.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { multerOptionsFactory } from 'src/utils/multer.options.factory';
import { Like } from './entities/likes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Boards, Like]),
    SocketModule,
    UserModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: multerOptionsFactory,
      inject: [ConfigService],
    }), // 멀터옵션 추가 안하면 path 말고 buffer
  ],
  providers: [BoardService],
  controllers: [BoardController],
})
export class BoardModule {}
