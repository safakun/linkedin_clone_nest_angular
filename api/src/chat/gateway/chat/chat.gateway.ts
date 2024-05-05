import { UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { JwtGuard } from '../../../auth/guards/jwt.guard';

@WebSocketGateway({ cors: { origin: ['http://localhost:8100'] } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server

  @UseGuards(JwtGuard)
  handleConnection() {
      console.log('Socket IO Connection made');
  }

  handleDisconnect() {
    console.log('Socket IO handle disconnect');
  }

  @SubscribeMessage('sendMessage')
  handleMessage(socket: Socket, message: string) {
    this.server.emit('newMessage', message);
  }
}
