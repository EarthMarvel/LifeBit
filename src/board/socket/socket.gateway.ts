import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class SocketGateway {
  @WebSocketServer() server: Server;

  LikeNotification(boardId: number, userId: number) {
    console.log('알림 찍히는거 보쏘');
    this.server.emit('likeNotification', { boardId, userId });
  }
}
// 알림  프론트에서 띄우기
