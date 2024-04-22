import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(8080)
export class ChatGateway {
  @WebSocketServer()
  server!: Server;
  async handleConnection(client: Socket): Promise<void> {
    const socketId = client.id;
    console.log(socketId);
    this.server.emit('성진', '하이');
  }
  @SubscribeMessage('민석')
  async handleMessage(@MessageBody() data: any): Promise<void> {
    console.log(data);
    this.server.emit('성진', data);
  }
}
// import {
//   MessageBody,
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';

// @WebSocketGateway(8080)
// export class ChatGateway {
//   @WebSocketServer()
//   server!: Server;

//   handleConnection(client: Socket): void {
//     const socketId = client.id;
//     console.log(`Client connected: ${socketId}`);
//     this.server.emit('성진', '안녕');
//   }

//   @SubscribeMessage('민석')
//   handleMessage(@MessageBody() message: string, client: Socket): void {
//     const socketId = client.id;
//     console.log(`Message from ${socketId}: ${message}`);
//     this.server.emit('성진', { sender: socketId, message });
//   }
// }
