import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class LikeGateway {
  @WebSocketServer() server: Server;

  sendLikeNotification(boardId, userId) {
    this.server.emit('likeNotification', { boardId, userId });
  }
}
