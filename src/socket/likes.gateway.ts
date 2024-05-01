import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class LikeGateway {
  @WebSocketServer() server: Server;

  sendLikeNotification(boardId, userId) {
    this.server.emit('likeNotification', { boardId, userId });
  }
}

// @WebSocketGateway()
// export class LikeGateway {
//   @WebSocketServer() server: Server;

//   @SubscribeMessage('like')
//   LikeNotification(boardId: number, userId: number) {
//     console.log('좋아요 알림');
//     this.server.emit(
//       'like',
//       { boardId, userId },
//       { message: '좋아요 알림을 받았습니다!' },
//     );
//   }
// }
