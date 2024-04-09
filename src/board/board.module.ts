import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { Boards } from './entities/board.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [TypeOrmModule.forFeature([Boards]), SocketModule],
  providers: [BoardService],
  controllers: [BoardController],
})
export class BoardModule {}
