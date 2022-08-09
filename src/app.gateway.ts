import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

type PaintCoords = {
  x: number;
  y: number;
  dx: number;
  dy: number;
};

@WebSocketGateway({ cors: true })
export class AppGateway {
  @WebSocketServer() server: Server;
  @SubscribeMessage('send-message')
  onSendMessage(@MessageBody() data: string, @ConnectedSocket() socket: Socket) {
    socket.in('message_room').emit('receive_message', data);
  }

  @SubscribeMessage('paint')
  painting(@MessageBody() data: PaintCoords, @ConnectedSocket() socket: Socket) {
    socket.broadcast.emit('repaint', data);
  }

  @SubscribeMessage('clear')
  clear(@ConnectedSocket() socket: Socket) {
    socket.broadcast.emit('clear_canvas');
  }

  handleConnection(socket: Socket) {
    console.log('JOINED:');
    socket.join('message_room');
  }
}
