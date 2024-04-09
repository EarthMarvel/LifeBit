import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class SocketGateway {
  @WebSocketServer() server: Server;

  LikeNotification(boardId: number, userId: number) {
    this.server.emit('likeNotification', { boardId, userId });
  }
}
