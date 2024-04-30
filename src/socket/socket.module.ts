import { Module } from '@nestjs/common';
import { LikeGateway } from './likes.gateway';

@Module({
  providers: [LikeGateway],
  exports: [LikeGateway],
})
export class SocketModule {}
