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
    this.server.emit('msgToClient', payload);
  }

  //   socket.on("join-room", (roomId, peerId) => {
  //     console.log("someone joined room", roomId, peerId);
  //     socket.join(roomId);
  //     socket.broadcast.to(roomId).emit("user-connected", peerId);
  //   });
  //
  //   socket.on("leave-room", (leavedPeerId, roomId) => {
  //     console.log("someone left room", leavedPeerId, roomId);
  //     socket.leave(roomId);
  //     socket.broadcast.to(roomId).emit("leave-room", leavedPeerId);
  //   });
  //
  //   // socket.emit("me", socket.id);
  //
  //   // socket.on("disconnect", () => {
  //   //   socket.broadcast.emit("callended");
  //   // });
  //
  //   // socket.on("calluser", ({ userToCall, signalData, from, name }) => {
  //   //   io.to(userToCall).emit("calluser", { signal: signalData, from, name });
  //   // });
  //
  //   // socket.on("answercall", (data) => {
  //   //   io.to(data.to).emit("callaccepted", data.signal);
  //   // });

  afterInit() {
    EventsGateway.logger.debug('Socket Server Init Complete');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    EventsGateway.logger.debug('Client connected', socket.nsp.name);

    if (!onlineMap[socket.nsp.name]) {
      onlineMap[socket.nsp.name] = {};
    }

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
