import { Logger } from '@nestjs/common';
import type {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { onlineMap } from './online-map';

@WebSocketGateway({ namespace: /\/ws-.+/ })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private static readonly logger = new Logger(EventsGateway.name);

  @WebSocketServer() public server: Server;

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: { name: string; text: string }): void {
    EventsGateway.logger.debug('Message received', payload);
    this.server.emit('msgToClient', payload);
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, payload: { peerId: string }) {
    // block the user if room already full(max 5 users)
    if (Object.keys(onlineMap[client.nsp.name]).length >= 5) {
      client.emit('message', 'Room is full');

      return;
    }

    EventsGateway.logger.debug('Client joined', payload);
    client.broadcast.emit('joinToClient', payload);
  }

  afterInit() {
    EventsGateway.logger.debug('Socket Server Init Complete');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    EventsGateway.logger.debug('Client connected', socket.nsp.name);

    if (!onlineMap[socket.nsp.name]) {
      onlineMap[socket.nsp.name] = {};
    }

    onlineMap[socket.nsp.name][socket.id] = socket.id;

    socket.emit('message', socket.nsp.name);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    EventsGateway.logger.debug('Client disconnected');
    const newNamespace = socket.nsp;
    delete onlineMap[socket.nsp.name][socket.id];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    newNamespace.emit('onlineList', Object.values(onlineMap[socket.nsp.name]));
  }
}
