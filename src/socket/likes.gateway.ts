import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class LikeGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('like')
  LikeNotification(boardId: number, userId: number) {
    console.log('좋아요 알림');
    this.server.emit(
      'like',
      { boardId, userId },
      { message: '좋아요 알림을 받았습니다!' },
    );
  }
}

// like.gateway.ts

//   @SubscribeMessage('like')
//   handleLikeEvent(@MessageBody() data: any): void {
//     console.log(`좋아요 알림: ${data.message}`);
//     // 모든 클라이언트에게 'like' 이벤트를 발생시킴
//     this.server.emit('like', data);
//   }
// }
